<?php

namespace App\Controller;

use App\Entity\Recipe;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin/recipes')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    #[Route('', name: 'admin_recipe_list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $recipes = $em->getRepository(Recipe::class)->findAll();
        $data = array_map(fn($r) => [
            'id' => $r->getId(),
            'title' => $r->getTitle(),
            'description' => $r->getDescription(),
            'image' => $r->getImage(),
            'ingredients' => $r->getIngredients(),
            'instructions' => $r->getInstructions(),
        ], $recipes);

        return $this->json($data);
    }

    #[Route('', name: 'admin_recipe_add', methods: ['POST'])]
    public function add(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $recipe = new Recipe();
        $recipe->setTitle($data['title']);
        $recipe->setDescription($data['description'] ?? null);
        $recipe->setImage($data['image'] ?? null);
        $recipe->setIngredients($data['ingredients'] ?? null);
        $recipe->setInstructions($data['instructions'] ?? null);

        $em->persist($recipe);
        $em->flush();

        return $this->json(['message' => 'Recette ajoutée avec succès !', 'id' => $recipe->getId()], 201);
    }

    #[Route('/{id}', name: 'admin_recipe_update', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $recipe = $em->getRepository(Recipe::class)->find($id);
        if (!$recipe) {
            return $this->json(['error' => 'Recette introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $recipe->setTitle($data['title'] ?? $recipe->getTitle());
        $recipe->setDescription($data['description'] ?? $recipe->getDescription());
        $recipe->setImage($data['image'] ?? $recipe->getImage());
        $recipe->setIngredients($data['ingredients'] ?? $recipe->getIngredients());
        $recipe->setInstructions($data['instructions'] ?? $recipe->getInstructions());

        $em->flush();

        return $this->json(['message' => 'Recette mise à jour avec succès !']);
    }

    #[Route('/{id}', name: 'admin_recipe_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $recipe = $em->getRepository(Recipe::class)->find($id);
        if (!$recipe) {
            return $this->json(['error' => 'Recette introuvable'], 404);
        }

        $em->remove($recipe);
        $em->flush();

        return $this->json(['message' => 'Recette supprimée avec succès !']);
    }
}
