<?php

namespace App\Controller;

use App\Service\SpoonacularService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class RecipeController extends AbstractController
{
    // Recherche des recettes (accessible uniquement aux utilisateurs connectés)
    #[Route('/api/recipes/{query}', name: 'recipes_search', methods: ['GET'])]
    public function search(string $query, SpoonacularService $spoonacularService): JsonResponse
    {
        // Vérifie que l'utilisateur est connecté
        $this->denyAccessUnlessGranted('ROLE_USER');

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

    // Détails d'une recette (accessible uniquement aux utilisateurs connectés)
    #[Route('/api/recipes/detail/{id}', name: 'recipe_detail', methods: ['GET'])]
    public function detail(int $id, SpoonacularService $spoonacularService): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

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
    #[Route('/api/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(): void
    {
        // Cette méthode peut rester vide, Symfony s'en charge automatiquement.
        throw new \Exception('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
