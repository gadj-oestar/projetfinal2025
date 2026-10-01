<?php

namespace App\Tests;

use Symfony\Component\HttpClient\Response\MockResponse;

/**
 * Remplace les appels à Spoonacular pendant les tests :
 * pas de réseau ni de vraie clé API nécessaires.
 */
class SpoonacularMockResponseFactory
{
    public function __invoke(string $method, string $url, array $options = []): MockResponse
    {
        // Ingrédient spécial pour simuler une panne de l'API
        if (str_contains($url, 'ingredients=panne')) {
            return new MockResponse('{"message":"error"}', ['http_code' => 500]);
        }

        if (preg_match('#/recipes/(\d+)/information#', $url, $m)) {
            return new MockResponse(json_encode([
                'id' => (int) $m[1],
                'title' => 'Recette de test',
            ]));
        }

        return new MockResponse(json_encode([
            ['id' => 716429, 'title' => 'Pasta de test', 'usedIngredientCount' => 1, 'missedIngredientCount' => 0],
        ]));
    }
}
