import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/recipes.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les favoris depuis la base de données au montage
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté pour voir vos favoris.");
        return;
      }

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Normaliser les données côté front si nécessaire
        const favoritesData = res.data.map((fav) => ({
          id: fav.id,
          recipeId: fav.recipeId,
          title: fav.title,
          image: fav.image,
        }));

        setFavorites(favoritesData);
      } catch (err) {
        console.error(err.response?.data || err);
        setError("Impossible de récupérer les favoris.");
      }
    };

    fetchFavorites();
  }, []);

  // Supprimer un favori
  const removeFavorite = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour supprimer un favori.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Impossible de supprimer le favori.");
    }
  };

  // Récupérer les détails d'une recette
  const fetchRecipeDetail = async (recipeId) => {
    setDetailLoading(true);
    setSelectedRecipe(null);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour voir les détails.");
      setDetailLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/recipes/detail/${recipeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRecipe(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Impossible de récupérer les détails de la recette.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="favorites-page">
      <h1 className="welcome-title">❤️ Mes Recettes Favoris</h1>

      {error && <p className="error">{error}</p>}

      {favorites.length === 0 ? (
        <p>Aucun favori pour le moment.</p>
      ) : (
        <ul className="recipe-list">
          {favorites.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              <h3>{recipe.title}</h3>
              <button onClick={() => fetchRecipeDetail(recipe.recipeId)}>
                Voir détails
              </button>
              <button onClick={() => removeFavorite(recipe.id)}>
                ❌ Supprimer
              </button>
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
    </div>
  );
}

export default Favorites;
