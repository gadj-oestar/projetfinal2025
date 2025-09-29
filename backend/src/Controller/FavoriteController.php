<?php

namespace App\Controller;

use App\Entity\Favorite;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/favorites')]
class FavoriteController extends AbstractController
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    // Ajouter un favori
    #[Route('', name: 'add_favorite', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function add(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['recipeId'], $data['title'], $data['image'])) {
            return $this->json(['error' => 'Données manquantes'], 400);
        }

        $user = $this->getUser();

        // Vérifier si le favori existe déjà pour cet utilisateur
        $existingFavorite = $this->em->getRepository(Favorite::class)
            ->findOneBy(['user' => $user, 'recipeId' => $data['recipeId']]);
        if ($existingFavorite) {
            return $this->json(['error' => 'Recette déjà dans les favoris'], 400);
        }

        $favorite = new Favorite();
        $favorite->setRecipeId($data['recipeId']);
        $favorite->setTitle($data['title']);
        $favorite->setImage($data['image']);
        $favorite->setUser($user);

        $this->em->persist($favorite);
        $this->em->flush();

        return $this->json([
            'message' => 'Recette ajoutée aux favoris',
            'favorite' => [
                'id' => $favorite->getId(),
                'recipeId' => $favorite->getRecipeId(),
                'title' => $favorite->getTitle(),
                'image' => $favorite->getImage()
            ]
        ], 201);
    }

    // Lister les favoris
    #[Route('', name: 'list_favorites', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function list(): JsonResponse
    {
        $user = $this->getUser();
        $favorites = $this->em->getRepository(Favorite::class)
            ->findBy(['user' => $user]);

        $data = array_map(fn(Favorite $fav) => [
            'id' => $fav->getId(),
            'recipeId' => $fav->getRecipeId(),
            'title' => $fav->getTitle(),
            'image' => $fav->getImage()
        ], $favorites);

        return $this->json($data);
    }

    // Supprimer un favori
    #[Route('/{id}', name: 'delete_favorite', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        $favorite = $this->em->getRepository(Favorite::class)
            ->find($id);

        if (!$favorite || $favorite->getUser() !== $user) {
            return $this->json(['error' => 'Favori non trouvé'], 404);
        }

        $this->em->remove($favorite);
        $this->em->flush();

        return $this->json(['message' => 'Favori supprimé avec succès']);
    }
}
