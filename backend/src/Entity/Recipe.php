<?php

namespace App\Entity;

use App\Repository\RecipeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RecipeRepository::class)]
class Recipe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $ingredients = null; // stockés en JSON ou texte

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $instructions = null;

    public function getId(): ?int { return $this->id; }

    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }

    public function getImage(): ?string { return $this->image; }
    public function setImage(?string $image): self { $this->image = $image; return $this; }

    public function getIngredients(): ?string { return $this->ingredients; }
    public function setIngredients(?string $ingredients): self { $this->ingredients = $ingredients; return $this; }

    public function getInstructions(): ?string { return $this->instructions; }
    public function setInstructions(?string $instructions): self { $this->instructions = $instructions; return $this; }
}
