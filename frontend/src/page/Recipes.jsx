import React, { useState } from "react";
import axios from "axios";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("pasta");
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    const token = localStorage.getItem("token");
    setError("");

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/recipes/${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.results) {
        setRecipes(response.data.results);
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Impossible de récupérer les recettes.");
    }
  };

  const addFavorite = (recipe) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.find((r) => r.id === recipe.id)) {
      favorites.push(recipe);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${recipe.title} ajouté aux favoris !`);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Recettes</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un ingrédient"
        />
        <button onClick={fetchRecipes}>Rechercher</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "0.5rem",
              borderRadius: "5px",
            }}
          >
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                style={{ width: "80px", marginRight: "1rem", borderRadius: "5px" }}
              />
            )}
            <span style={{ flex: 1 }}>{recipe.title}</span>
            <button onClick={() => addFavorite(recipe)}>❤️ Favoris</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recipes;
