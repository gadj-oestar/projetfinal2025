import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";

// Fiche détaillée d'une recette, affichée par-dessus la page
function RecipeModal({ recipe, loading, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={recipe?.title || "Chargement de la recette"}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="icon-btn close" onClick={onClose} aria-label="Fermer">
          <FaTimes />
        </button>

        {loading || !recipe ? (
          <div className="modal-loading">
            <AiOutlineLoading3Quarters className="spin" size={28} />
            Chargement de la recette...
          </div>
        ) : (
          <>
            {recipe.image && <img className="modal-cover" src={recipe.image} alt="" />}
            <div className="modal-content">
              <h2>{recipe.title}</h2>
              <div className="recipe-meta">
                {recipe.readyInMinutes && <span className="tag">{recipe.readyInMinutes} min</span>}
                {recipe.servings && <span className="tag">{recipe.servings} personnes</span>}
              </div>

              {recipe.summary && <p className="summary">{recipe.summary}</p>}

              <h3>Ingrédients</h3>
              <ul className="ingredients">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <h3>Préparation</h3>
              {recipe.steps?.length ? (
                <ol className="steps">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="muted">Pas d'instructions fournies pour cette recette.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeModal;
