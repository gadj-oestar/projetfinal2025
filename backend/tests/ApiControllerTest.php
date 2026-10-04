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
        // Les titres sont traduits en français
        $this->assertSame('[fr] Pasta de test', $responseData['results'][0]['title']);
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

        // Titre, résumé (sans HTML ni lien Spoonacular), ingrédients et étapes traduits
        $this->assertSame('[fr] Test recipe', $responseData['title']);
        $this->assertSame('[fr] A tasty dish.', $responseData['summary']);
        $this->assertSame(['[fr] 2 eggs'], $responseData['ingredients']);
        $this->assertSame(['[fr] Boil the eggs.'], $responseData['steps']);
    }

    // Une panne de Spoonacular ne doit pas renvoyer la clé API au client
    public function testSpoonacularErrorDoesNotLeakApiKey(): void
    {
        $client = static::createClient();
        $token = $this->loginAndGetToken($client);

        $client->request(
            'GET',
            '/api/recipes/panne',
            [],
            [],
            ['HTTP_Authorization' => "Bearer $token"]
        );

        $this->assertResponseStatusCodeSame(502);
        $this->assertStringNotContainsString('apiKey', $client->getResponse()->getContent());
    }
}
