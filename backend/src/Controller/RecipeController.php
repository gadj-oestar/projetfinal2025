<?php

namespace App\Controller;

use App\Service\SpoonacularService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class RecipeController extends AbstractController
{
    #[Route('/api/recipes/{query}', name: 'recipes')]
    public function search(string $query, SpoonacularService $spoonacularService): JsonResponse
    {
        $recipes = $spoonacularService->searchRecipes($query, 5);
        return $this->json($recipes);
    }
}
