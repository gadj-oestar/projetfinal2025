<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class SpoonacularService
{
    private $client;
    private $apiKey;

    public function __construct(HttpClientInterface $client, string $apiKey)
    {
        $this->client = $client;
        $this->apiKey = $apiKey;
    }

    /**
     * Récupère des recettes en fonction des ingrédients
     * @param array $ingredients
     * @param int $number
     * @return array
     */
    public function getRecipesByIngredients(array $ingredients, int $number = 5): array
    {
        $ingredientsParam = implode(',', $ingredients);

        $response = $this->client->request('GET', 'https://api.spoonacular.com/recipes/findByIngredients', [
            'query' => [
                'ingredients' => $ingredientsParam,
                'number' => $number,
                'apiKey' => $this->apiKey,
            ]
        ]);

        return $response->toArray();
    }
}
