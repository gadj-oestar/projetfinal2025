<?php

namespace App\Tests;

use Symfony\Component\HttpClient\Response\MockResponse;

/**
 * Remplace les appels à Spoonacular et à MyMemory pendant les tests :
 * pas de réseau ni de vraie clé API nécessaires.
 */
class SpoonacularMockResponseFactory
{
    public function __invoke(string $method, string $url, array $options = []): MockResponse
    {
        // MyMemory : vers l'anglais le texte est rendu tel quel, vers le français il est préfixé
        if (str_contains($url, 'api.mymemory.translated.net')) {
            parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
            $text = $query['langpair'] === 'en|fr' ? '[fr] ' . $query['q'] : $query['q'];

            return new MockResponse(json_encode([
                'responseStatus' => 200,
                'responseData' => ['translatedText' => $text],
            ]));
        }

        // Ingrédient spécial pour simuler une panne de l'API
        if (str_contains($url, 'ingredients=panne')) {
            return new MockResponse('{"message":"error"}', ['http_code' => 500]);
        }

        if (preg_match('#/recipes/(\d+)/information#', $url, $m)) {
            return new MockResponse(json_encode([
                'id' => (int) $m[1],
                'title' => 'Test recipe',
                'summary' => 'A <b>tasty</b> dish. Try <a href="#">Other recipe</a> for similar recipes.',
                'extendedIngredients' => [['id' => 1, 'original' => '2 eggs']],
                'analyzedInstructions' => [['steps' => [['number' => 1, 'step' => 'Boil the eggs.']]]],
            ]));
        }

        return new MockResponse(json_encode([
            ['id' => 716429, 'title' => 'Pasta de test', 'usedIngredientCount' => 1, 'missedIngredientCount' => 0],
        ]));
    }
}
