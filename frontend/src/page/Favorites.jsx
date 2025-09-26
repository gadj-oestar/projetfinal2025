import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/recipes.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Récupérer les détails d'une recette
  const fetchRecipeDetail = async (id) => {
    setDetailLoading(true);
    setSelectedRecipe(null);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/recipes/detail/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSelectedRecipe(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Impossible de récupérer les détails de la recette.");
    }

    setDetailLoading(false);
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
              <button onClick={() => fetchRecipeDetail(recipe.id)}>Voir détails</button>
              <button onClick={() => removeFavorite(recipe.id)}>❌ Supprimer</button>
            </li>
          ))}
        </ul>
      )}

      {detailLoading && <p>Chargement du détail...</p>}

      {selectedRecipe && (
        <div className="recipe-detail">
          <h2>{selectedRecipe.title}</h2>
          {selectedRecipe.image && (
            <img src={selectedRecipe.image} alt={selectedRecipe.title} />
          )}
          <p dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }} />
          <h4>Ingrédients :</h4>
          <ul>
            {selectedRecipe.extendedIngredients?.map((ing) => (
              <li key={ing.id}>{ing.original}</li>
            ))}
          </ul>
          <h4>Instructions :</h4>
          <p dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Favorites;
