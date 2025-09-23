<?php

namespace App\Controller;

use App\Service\SpoonacularService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class RecipeController extends AbstractController
{
    #[Route('/api/recipes/{query}', name: 'recipes_search', methods: ['GET'])]
    public function search(string $query, SpoonacularService $spoonacularService): JsonResponse
    {
        try {
            $recipes = $spoonacularService->searchRecipes($query, 5);

            return $this->json([
                'results' => $recipes['results'] ?? []
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Impossible de récupérer les recettes.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/recipes/detail/{id}', name: 'recipe_detail', methods: ['GET'])]
    public function detail(int $id, SpoonacularService $spoonacularService): JsonResponse
    {
        try {
            $recipe = $spoonacularService->getRecipeDetail($id);

            return $this->json($recipe ?? []);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Impossible de récupérer les détails de la recette.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
