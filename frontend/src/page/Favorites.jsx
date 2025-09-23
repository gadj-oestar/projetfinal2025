import React, { useEffect, useState } from "react";
import "../css/recipes.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Charger les favoris au montage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Supprimer un favori
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorites-page">
      <h1 className="welcome-title">❤️ Mes Recettes Favoris</h1>

      {favorites.length === 0 ? (
        <p>Aucun favori pour le moment.</p>
      ) : (
        <ul className="recipe-list">
          {favorites.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              <h3>{recipe.title}</h3>
              <button onClick={() => removeFavorite(recipe.id)}>❌ Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
