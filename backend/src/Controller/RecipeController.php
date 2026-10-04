<?php

namespace App\Controller;

use App\Service\Translator;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class RecipeController extends AbstractController
{
    private HttpClientInterface $client;
    private string $apiKey;
    private LoggerInterface $logger;
    private Translator $translator;

    public function __construct(HttpClientInterface $client, LoggerInterface $logger, Translator $translator)
    {
        $this->client = $client;
        $this->logger = $logger;
        $this->translator = $translator;
        $this->apiKey = $_ENV['SPOONACULAR_API_KEY'] ?? '';
    }

    // 📌 Récupérer des recettes à partir des ingrédients
    #[Route('/api/recipes/{ingredients}', name: 'get_recipes', methods: ['GET'])]
    public function getRecipes(string $ingredients): JsonResponse
    {
        // Spoonacular attend des ingrédients en anglais : on traduit ceux saisis en français
        $list = array_values(array_filter(array_map('trim', explode(',', $ingredients))));
        $translated = $this->translator->translateMany($list, 'fr', 'en');
        $english = implode(',', array_map(fn (string $i) => strtolower(rtrim($i, '. ')), $translated));

        try {
            $response = $this->client->request('GET', 'https://api.spoonacular.com/recipes/findByIngredients', [
                'query' => [
                    'ingredients' => $english,
                    'number' => 5,
                    'apiKey' => $this->apiKey,
                ],
            ]);

            $results = $response->toArray();
            $titles = $this->translator->translateMany(array_column($results, 'title'), 'en', 'fr');
            foreach ($results as $i => &$recipe) {
                $recipe['title'] = $titles[$i] ?? $recipe['title'];
            }

            return new JsonResponse(['results' => $results]);
        } catch (\Exception $e) {
            // Le message d'origine contient l'URL appelée, donc la clé API : on le garde dans les logs
            $this->logger->error('Erreur API Spoonacular', ['exception' => $e]);

            return new JsonResponse([
                'error' => 'Le service de recettes est indisponible. Réessayez plus tard.',
            ], 502);
        }
    }

    // 📌 Récupérer le détail d’une recette
    #[Route('/api/recipes/detail/{id}', name: 'get_recipe_detail', methods: ['GET'])]
    public function getRecipeDetail(int $id): JsonResponse
    {
        try {
            $response = $this->client->request('GET', "https://api.spoonacular.com/recipes/{$id}/information", [
                'query' => [
                    'apiKey' => $this->apiKey,
                ],
            ]);

            return new JsonResponse($this->translateDetail($response->toArray()));
        } catch (\Exception $e) {
            // Le message d'origine contient l'URL appelée, donc la clé API : on le garde dans les logs
            $this->logger->error('Erreur API Spoonacular', ['exception' => $e]);

            return new JsonResponse([
                'error' => 'Le service de recettes est indisponible. Réessayez plus tard.',
            ], 502);
        }
    }

    /**
     * Traduit en français le titre, le résumé, les ingrédients et les étapes d'une recette.
     * Le résumé et les étapes sont renvoyés en texte brut (sans HTML).
     */
    private function translateDetail(array $recipe): array
    {
        $summary = trim(html_entity_decode(strip_tags($recipe['summary'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        // La dernière phrase de Spoonacular renvoie vers des recettes similaires de leur site
        $summary = preg_replace('/\s*(Try|If you like this recipe|Similar recipes)\b.*$/su', '', $summary);

        $ingredients = array_column($recipe['extendedIngredients'] ?? [], 'original');

        $steps = [];
        foreach ($recipe['analyzedInstructions'] ?? [] as $block) {
            foreach ($block['steps'] ?? [] as $step) {
                $steps[] = $step['step'] ?? '';
            }
        }
        if ($steps === [] && !empty($recipe['instructions'])) {
            $text = html_entity_decode(strip_tags(str_replace(['</li>', '</p>', '<br>'], "\n", $recipe['instructions'])), ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $steps = array_values(array_filter(array_map('trim', explode("\n", $text))));
        }

        // Une seule série de requêtes en parallèle pour toute la fiche
        $texts = array_merge([$recipe['title'] ?? '', $summary], $ingredients, $steps);
        $fr = $this->translator->translateMany($texts, 'en', 'fr');

        $recipe['title'] = $fr[0] ?: ($recipe['title'] ?? '');
        $recipe['summary'] = $fr[1];
        $recipe['ingredients'] = array_slice($fr, 2, count($ingredients));
        $recipe['steps'] = array_slice($fr, 2 + count($ingredients));
        unset($recipe['instructions'], $recipe['analyzedInstructions']);

        return $recipe;
    }
}
