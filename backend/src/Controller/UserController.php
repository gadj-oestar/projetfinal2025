<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request, 
        UserPasswordHasherInterface $passwordHasher, 
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérification de la longueur du mot de passe
        if (!isset($data['password']) || strlen($data['password']) < 6) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le mot de passe est trop court. Il doit contenir au moins 6 caractères.'
            ], 400); // 400 = Bad Request
        }

        $user = new User();
        $user->setEmail($data['email']);
        
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Utilisateur créé avec succès !'
        ]);
    }
}
