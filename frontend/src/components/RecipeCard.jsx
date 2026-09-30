import React from "react";
import { FaHeart, FaTrashAlt } from "react-icons/fa";

// Carte recette réutilisée sur l'accueil et dans les favoris
function RecipeCard({ recipe, onOpen, onFavorite, onRemove }) {
  const missed = recipe.missedIngredientCount;

  return (
    <li className="recipe-card">
      <div className="recipe-media">
        {recipe.image && <img src={recipe.image} alt="" loading="lazy" />}
        {onFavorite && (
          <button
            className="icon-btn"
            onClick={() => onFavorite(recipe)}
            aria-label={`Ajouter ${recipe.title} aux favoris`}
            title="Ajouter aux favoris"
          >
            <FaHeart />
          </button>
        )}
      </div>
      <div className="recipe-body">
        <h3>{recipe.title}</h3>
        {typeof missed === "number" && (
          <div className="recipe-meta">
            <span className="tag tag-ok">{recipe.usedIngredientCount} en stock</span>
            <span className="tag">
              {missed === 0 ? "Rien à acheter" : `${missed} manquant${missed > 1 ? "s" : ""}`}
            </span>
          </div>
        )}
        <div className="recipe-actions">
          <button className="btn btn-primary btn-sm" onClick={() => onOpen(recipe)}>
            Voir la recette
          </button>
          {onRemove && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onRemove(recipe)}
              aria-label={`Retirer ${recipe.title} des favoris`}
            >
              <FaTrashAlt />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default RecipeCard;
