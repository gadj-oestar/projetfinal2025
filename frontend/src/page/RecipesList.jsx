import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RecipesList() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!ingredients.trim()) return;
    setError("");
    setLoading(true);
    setRecipes([]);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/recipes/${ingredients}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.results && res.data.results.length > 0) {
        setRecipes(res.data.results);
      } else {
        setError("Aucune recette trouvée.");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Impossible de récupérer les recettes.");
    }
    setLoading(false);
  };

  return (
    <div className="recipes-page">
      <h1>What ingredients do you have today?</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter your ingredient"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {recipes.length > 0 && (
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              <Link to={`/recipes/${recipe.id}`} className="recipe-title">
                {recipe.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecipesList;
