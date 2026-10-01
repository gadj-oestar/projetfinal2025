import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHistory } from "react-icons/fa";

import RecipeModal from "../components/RecipeModal.jsx";
import useRecipeDetail from "../components/useRecipeDetail.js";

const readHistory = () => JSON.parse(localStorage.getItem("history")) || [];

function History() {
  const [history, setHistory] = useState(readHistory);
  const [error, setError] = useState("");
  const detail = useRecipeDetail(setError);

  // Supprimer l'historique
  const clearHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
  };

  const closeDetail = () => {
    detail.close();
    setHistory(readHistory());
  };

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Historique</h1>
          <p>Les dernières recettes que vous avez consultées sur cet appareil.</p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearHistory}>
            Vider l'historique
          </button>
        )}
      </div>

      {error && <p className="alert" role="alert">{error}</p>}

      {history.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><FaHistory /></div>
          <h2>Rien pour l'instant</h2>
          <p>Ouvrez une recette depuis l'accueil, elle apparaîtra ici.</p>
          <Link to="/" className="btn btn-primary">Chercher une recette</Link>
        </div>
      ) : (
        <ul className="history-list">
          {history.map((recipe) => (
            <li key={recipe.id} className="history-item">
              {recipe.image && <img src={recipe.image} alt="" />}
              <h3>{recipe.title}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => detail.openRecipe(recipe.id)}>
                Revoir
              </button>
            </li>
          ))}
        </ul>
      )}

      {detail.open && (
        <RecipeModal recipe={detail.recipe} loading={detail.loading} onClose={closeDetail} />
      )}
    </div>
  );
}

export default History;
