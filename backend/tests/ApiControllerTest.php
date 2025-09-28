<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApiControllerTest extends WebTestCase
{
    private string $token = '';

    // Test d'inscription
    public function testRegister(): void
    {
        $client = static::createClient();

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

        $this->token = $responseData['token'];
        $this->assertNotEmpty($this->token);
    }

    // Test de recherche de recettes
    public function testSearchRecipes(): void
    {
        $client = static::createClient();

        // Connexion pour récupérer un token
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

        $loginData = json_decode($client->getResponse()->getContent(), true);
        $token = $loginData['token'];

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

        // Connexion pour récupérer un token
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

        $loginData = json_decode($client->getResponse()->getContent(), true);
        $token = $loginData['token'];

        // Mettre un ID de recette réel pour le test
        $recipeId = 716429;

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
