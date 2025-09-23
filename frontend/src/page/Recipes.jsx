import React, { useState } from "react";
import axios from "axios";
import "../css/recipes.css";

function Recipes() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;

    setError("");
    setLoading(true);
    setRecipes([]);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/recipes/${encodeURIComponent(ingredients)}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      if (res.data.results?.length > 0) {
        setRecipes(res.data.results);
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        setError("Aucune recette trouvée.");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Impossible de récupérer les recettes.");
    }

    setLoading(false);
  };

  const addFavorite = (recipe) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.find((r) => r.id === recipe.id)) {
      favorites.push(recipe);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${recipe.title} ajouté aux favoris !`);
    }
  };

  const handleExampleClick = (example) => {
    setIngredients(example);
  };

  return (
    <div className="recipes-page">
      <h1 className="welcome-title">WELCOME ,</h1>
      <h2 className="subtitle">What ingredients do you have today?</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter your ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {recipes.length > 0 && (
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              <h3>{recipe.title}</h3>
              <button onClick={() => addFavorite(recipe)}>❤️ Favoris</button>
            </li>
          ))}
        </ul>
      )}

      <div className="examples-box">
        <p className="example-title">Examples:</p>
        <div className="examples-list">
          <button onClick={() => handleExampleClick("egg,tomato,spaghetti")}>
            egg,tomato,spaghetti
          </button>
          <button onClick={() => handleExampleClick("i have a meat rice and bean")}>
            i have a meat rice and bean
          </button>
          <button
            onClick={() =>
              handleExampleClick("healthy recipe with carrot tomato and apple")
            }
          >
            healthy recipe with carrot tomato and apple
          </button>
        </div>
      </div>
    </div>
  );
}

export default Recipes;
