<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class SpoonacularService
{
	private HttpClientInterface $client;
	private string $apiKey;

	public function __construct(HttpClientInterface $client, string $apiKey)
	{
		$this->client = $client;
		$this->apiKey = $apiKey;
	}

	/**
	 * Recherche de recettes par ingrédients ou mot-clé
	 */
	public function searchRecipes(string $query, int $number = 5): array
	{
		$response = $this->client->request('GET', 'https://api.spoonacular.com/recipes/complexSearch', [
			'query' => [
				'apiKey' => $this->apiKey,
				'query' => $query,
				'number' => $number,
			],
		]);
		return $response->toArray();
	}

	/**
	 * Récupère les détails d'une recette par son ID
	 */
	public function getRecipeDetail(int $id): array
	{
		$response = $this->client->request('GET', "https://api.spoonacular.com/recipes/{$id}/information", [
			'query' => [
				'apiKey' => $this->apiKey,
				'includeNutrition' => false, // tu peux mettre true si besoin
			],
		]);
		return $response->toArray();
	}
}