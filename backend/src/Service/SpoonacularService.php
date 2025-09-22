<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class SpoonacularService
{
    private $client;
    private $apiKey;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
        $this->apiKey = $_ENV['SPOONACULAR_API_KEY'];
    }

    public function searchRecipes(string $query, int $number = 5): array
{
    $url = 'https://api.spoonacular.com/recipes/complexSearch';

    try {
        $response = $this->client->request('GET', $url, [
            'query' => [
                'apiKey' => $this->apiKey,
                'query' => $query,
                'number' => $number
            ]
        ]);

        return $response->toArray();
    } catch (\Exception $e) {
        // Retourner une erreur claire au frontend
        return [
            'error' => 'Impossible de récupérer les recettes : ' . $e->getMessage()
        ];
    }
}
}
