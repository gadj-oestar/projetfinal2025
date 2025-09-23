import React, { useEffect, useState } from "react";
import "../css/history.css";

function History() {
  const [history, setHistory] = useState([]);

  // Charger l’historique depuis localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(storedHistory);
  }, []);

  // Supprimer l’historique
  const clearHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
  };

  return (
    <div className="history-page">
      <h1>Historique des recettes générées</h1>

      {history.length === 0 ? (
        <p>Aucune recette générée pour le moment.</p>
      ) : (
        <ul className="history-list">
          {history.map((recipe, index) => (
            <li key={index} className="history-item">
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} className="history-img" />
              )}
              <div>
                <h3>{recipe.title}</h3>
                <p>ID : {recipe.id}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <button className="clear-btn" onClick={clearHistory}>
          Vider l’historique
        </button>
      )}
    </div>
  );
}

export default History;
