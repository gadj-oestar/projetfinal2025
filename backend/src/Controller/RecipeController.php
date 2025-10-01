<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class RecipeController extends AbstractController
{
    private HttpClientInterface $client;
    private string $apiKey;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
        $this->apiKey = $_ENV['SPOONACULAR_API_KEY'] ?? '';
    }

    // 📌 Récupérer des recettes à partir des ingrédients
    #[Route('/api/recipes/{ingredients}', name: 'get_recipes', methods: ['GET'])]
    public function getRecipes(string $ingredients): JsonResponse
    {
        try {
            $response = $this->client->request('GET', 'https://api.spoonacular.com/recipes/findByIngredients', [
                'query' => [
                    'ingredients' => $ingredients,
                    'number' => 5,
                    'apiKey' => $this->apiKey,
                ],
            ]);

            return new JsonResponse([
                'results' => $response->toArray(),
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur API Spoonacular : ' . $e->getMessage(),
            ], 500);
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

            return new JsonResponse($response->toArray());
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur API Spoonacular : ' . $e->getMessage(),
            ], 500);
        }
    }
}
