import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/recipes.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  // Charger les favoris depuis la base de données
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
        setFavorites(res.data); // on affiche directement la réponse
      } catch (err) {
        console.error("Erreur API :", err.response?.data || err.message);
        setError("Impossible de récupérer les favoris.");
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <h1 className="welcome-title">❤️ Mes Recettes Favoris</h1>

      {error && <p className="error">{error}</p>}

      {favorites.length === 0 ? (
        <p>Aucun favori pour le moment.</p>
      ) : (
        <ul className="recipe-list">
          {favorites.map((fav) => (
            <li key={fav.id} className="recipe-item">
              {fav.image && <img src={fav.image} alt={fav.title} />}
              <h3>{fav.title}</h3>
              <p>ID Recette: {fav.recipeId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
