<?php

namespace App\Controller\Admin;

use App\Entity\Recipe;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;

class RecipeCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Recipe::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->onlyOnIndex(), // affiché uniquement dans la liste
            TextField::new('title', 'Titre'),
            TextareaField::new('description', 'Description')->hideOnIndex(),
            ImageField::new('image', 'Image')
                ->setBasePath('/uploads/images')
                ->setUploadDir('public/uploads/images')
                ->setRequired(false),
            TextareaField::new('ingredients', 'Ingrédients')->hideOnIndex(),
            TextareaField::new('instructions', 'Instructions')->hideOnIndex(),
        ];
    }
}
