<?php

namespace App\Tests;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApiControllerTest extends WebTestCase
{
    private string $token = '';

    private function loginAndGetToken($client): string
    {
        $client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'testuser@example.com',
                'password' => 'password123'
            ])
        );

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $responseData);

        return $responseData['token'];
    }

    // Test d'inscription
    public function testRegister(): void
    {
        $client = static::createClient();
        $container = static::getContainer();

        /** @var EntityManagerInterface $entityManager */
        $entityManager = $container->get('doctrine')->getManager();

        // On vide les anciens utilisateurs pour éviter les doublons
        $entityManager->createQuery('DELETE FROM App\Entity\User')->execute();

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'testuser@example.com',
                'password' => 'password123'
            ])
        );

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('success', $responseData['status']);
    }

    // Test de login et récupération du token
    public function testLogin(): void
    {
        $client = static::createClient();
        $this->token = $this->loginAndGetToken($client);

        $this->assertNotEmpty($this->token);
    }

    // Test de recherche de recettes
    public function testSearchRecipes(): void
    {
        $client = static::createClient();
        $token = $this->loginAndGetToken($client);

        $client->request(
            'GET',
            '/api/recipes/pasta',
            [],
            [],
            ['HTTP_Authorization' => "Bearer $token"]
        );

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('results', $responseData);
    }

    // Test des détails d'une recette
    public function testRecipeDetail(): void
    {
        $client = static::createClient();
        $token = $this->loginAndGetToken($client);

        $recipeId = 716429; // à remplacer par un ID valide si besoin

        $client->request(
            'GET',
            "/api/recipes/detail/$recipeId",
            [],
            [],
            ['HTTP_Authorization' => "Bearer $token"]
        );

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('id', $responseData);
        $this->assertEquals($recipeId, $responseData['id']);
    }
}
