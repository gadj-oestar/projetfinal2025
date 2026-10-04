<?php

namespace App\Service;

use Psr\Cache\CacheItemPoolInterface;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Traduit des textes avec l'API gratuite MyMemory (https://mymemory.translated.net).
 *
 * - Les traductions réussies sont mises en cache pour économiser le quota journalier.
 * - En cas d'échec (quota atteint, API indisponible), le texte d'origine est renvoyé :
 *   la recette reste lisible, simplement en anglais.
 */
class Translator
{
    private const API_URL = 'https://api.mymemory.translated.net/get';

    // MyMemory refuse les requêtes de plus de 500 octets
    private const MAX_BYTES = 450;

    public function __construct(
        private HttpClientInterface $client,
        private CacheItemPoolInterface $translationCache,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * Traduit une liste de textes en parallèle et renvoie les traductions dans le même ordre.
     *
     * @param string[] $texts
     * @return string[]
     */
    public function translateMany(array $texts, string $from, string $to): array
    {
        $results = [];
        $pending = [];

        foreach ($texts as $i => $text) {
            $text = trim((string) $text);
            if ($text === '') {
                $results[$i] = '';
                continue;
            }

            $key = $this->cacheKey($text, $from, $to);
            $cached = $this->translationCache->getItem($key);
            if ($cached->isHit()) {
                $results[$i] = $cached->get();
                continue;
            }

            // Les textes trop longs sont découpés en phrases puis recollés
            $pending[$i] = [
                'item' => $cached,
                'responses' => array_map(
                    fn (string $chunk) => $this->request($chunk, $from, $to),
                    $this->split($text)
                ),
                'original' => $text,
            ];
        }

        foreach ($pending as $i => $job) {
            $parts = [];
            foreach ($job['responses'] as $response) {
                $parts[] = $this->read($response);
            }

            if (in_array(null, $parts, true)) {
                $results[$i] = $job['original'];
                continue;
            }

            $translated = implode(' ', $parts);
            $results[$i] = $translated;

            $this->translationCache->save($job['item']->set($translated));
        }

        ksort($results);

        return $results;
    }

    public function translate(string $text, string $from, string $to): string
    {
        return $this->translateMany([$text], $from, $to)[0];
    }

    private function request(string $text, string $from, string $to)
    {
        $query = ['q' => $text, 'langpair' => "$from|$to"];

        // Avec un email, le quota gratuit passe de 5 000 à 50 000 caractères par jour
        $email = $_ENV['MYMEMORY_EMAIL'] ?? $_SERVER['MYMEMORY_EMAIL'] ?? '';
        if ($email !== '') {
            $query['de'] = $email;
        }

        return $this->client->request('GET', self::API_URL, ['query' => $query, 'timeout' => 10]);
    }

    private function read($response): ?string
    {
        try {
            $data = $response->toArray();
            $translated = $data['responseData']['translatedText'] ?? null;

            if ((int) ($data['responseStatus'] ?? 0) !== 200 || !is_string($translated)
                || str_starts_with($translated, 'MYMEMORY WARNING')) {
                $this->logger->warning('Traduction MyMemory refusée', ['status' => $data['responseStatus'] ?? null]);

                return null;
            }

            return html_entity_decode($translated, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        } catch (\Throwable $e) {
            $this->logger->warning('Traduction MyMemory indisponible', ['exception' => $e]);

            return null;
        }
    }

    /** @return string[] */
    private function split(string $text): array
    {
        if (strlen($text) <= self::MAX_BYTES) {
            return [$text];
        }

        $chunks = [];
        $current = '';
        foreach (preg_split('/(?<=[.!?])\s+/u', $text) as $sentence) {
            // Une phrase trop longue à elle seule est coupée entre deux mots
            foreach ($this->wrap($sentence) as $piece) {
                if ($current !== '' && strlen($current) + strlen($piece) + 1 > self::MAX_BYTES) {
                    $chunks[] = $current;
                    $current = '';
                }
                $current = $current === '' ? $piece : "$current $piece";
            }
        }
        if ($current !== '') {
            $chunks[] = $current;
        }

        return $chunks;
    }

    /** @return string[] */
    private function wrap(string $sentence): array
    {
        if (strlen($sentence) <= self::MAX_BYTES) {
            return [$sentence];
        }

        $pieces = [];
        $current = '';
        foreach (preg_split('/\s+/u', $sentence) as $word) {
            if ($current !== '' && strlen($current) + strlen($word) + 1 > self::MAX_BYTES) {
                $pieces[] = $current;
                $current = '';
            }
            $current = $current === '' ? $word : "$current $word";
        }
        if ($current !== '') {
            $pieces[] = $current;
        }

        return $pieces;
    }

    private function cacheKey(string $text, string $from, string $to): string
    {
        return "tr_{$from}_{$to}_" . hash('xxh128', $text);
    }
}
