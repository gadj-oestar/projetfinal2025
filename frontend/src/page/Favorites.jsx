import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";

import { API_URL, authHeaders, getToken } from "../api";
import RecipeCard from "../components/RecipeCard.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import useRecipeDetail from "../components/useRecipeDetail.js";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const detail = useRecipeDetail(setError);

  // Charger les favoris depuis la base de données au montage
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!getToken()) {
        setError("Vous devez être connecté pour voir vos favoris.");
        setLoaded(true);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/favorites`, { headers: authHeaders() });
        setFavorites(
          res.data.map((fav) => ({
            id: fav.id,
            recipeId: fav.recipeId,
            title: fav.title,
            image: fav.image,
          }))
        );
      } catch (err) {
        console.error(err.response?.data || err);
        setError("Impossible de récupérer les favoris.");
      } finally {
        setLoaded(true);
      }
    };

    fetchFavorites();
  }, []);

  // Supprimer un favori
  const removeFavorite = async (fav) => {
    try {
      await axios.delete(`${API_URL}/api/favorites/${fav.id}`, { headers: authHeaders() });
      setFavorites((list) => list.filter((f) => f.id !== fav.id));
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Impossible de supprimer le favori.");
    }
  };

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Mes favoris</h1>
          <p>Les recettes que vous avez gardées de côté.</p>
        </div>
      </div>

      {error && <p className="alert" role="alert">{error}</p>}

      {loaded && !error && favorites.length === 0 && (
        <div className="empty">
          <div className="empty-icon"><FaRegHeart /></div>
          <h2>Aucun favori pour le moment</h2>
          <p>Cliquez sur le cœur d'une recette pour la retrouver ici.</p>
          <Link to="/" className="btn btn-primary">Chercher une recette</Link>
        </div>
      )}

      {favorites.length > 0 && (
        <ul className="recipe-grid">
          {favorites.map((fav) => (
            <RecipeCard
              key={fav.id}
              recipe={fav}
              onOpen={(r) => detail.openRecipe(r.recipeId)}
              onRemove={removeFavorite}
            />
          ))}
        </ul>
      )}

      {detail.open && (
        <RecipeModal recipe={detail.recipe} loading={detail.loading} onClose={detail.close} />
      )}
    </div>
  );
}

export default Favorites;
