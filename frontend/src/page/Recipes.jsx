import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/recipes.css";
import Header from "./Header";

function Recipes() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle jour/nuit
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Appliquer le thème sur le body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Générer les recettes
  const handleGenerate = async () => {
    const query = ingredients.trim();
    if (!query) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour générer une recette.");
      alert("Vous devez être connecté pour générer une recette.");
      return;
    }

    setError("");
    setLoading(true);
    setRecipes([]);
    setSelectedRecipe(null);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/recipes/${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
      );

      if (res.data.results?.length > 0) {
        setRecipes(res.data.results);

        // Historique local sécurisé : éviter les doublons
        const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
        const newHistory = [
          ...storedHistory,
          ...res.data.results.filter(
            (recipe) => !storedHistory.some((h) => h.id === recipe.id)
          ),
        ];
        localStorage.setItem("history", JSON.stringify(newHistory));
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        setError("Aucune recette trouvée.");
      }
    } catch (err) {
      console.error("Erreur API :", err.response?.data || err.message);
      setError("Impossible de récupérer les recettes. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Détails d'une recette
  const fetchRecipeDetail = async (id) => {
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
        `http://127.0.0.1:8000/api/recipes/detail/${encodeURIComponent(id)}`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
      );
      setSelectedRecipe(res.data);
    } catch (err) {
      console.error("Erreur détail :", err.response?.data || err.message);
      setError("Impossible de récupérer les détails de la recette.");
    } finally {
      setDetailLoading(false);
    }
  };

  // Ajouter aux favoris
  const addFavorite = (recipe) => {
    if (!recipe?.id || !recipe?.title) return;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.find((r) => r.id === recipe.id)) {
      favorites.push(recipe);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${recipe.title} ajouté aux favoris !`);
    }
  };

  // Remplir l'input avec un exemple d'ingrédient
  const handleExampleClick = (example) => {
    if (typeof example === "string" && example.length < 100) {
      setIngredients(example.trim());
    }
  };

  return (
    <div className="recipes-page page-with-header">
      <Header />

      <button
        className="button-toggle"
        onClick={toggleDarkMode}
        style={{
          position: "absolute",
          top: 130,
          right: 20,
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          backgroundColor: darkMode ? "#f5deb3" : "#2c3e50",
          color: darkMode ? "#333" : "#fff",
        }}
      >
        {darkMode ? "Mode Jour" : "Mode Nuit"}
      </button>

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
              <button onClick={() => fetchRecipeDetail(recipe.id)}>
                Voir Détails
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
          <ul>
            {selectedRecipe.extendedIngredients?.map((ing) => (
              <li key={ing.id}>{ing.original}</li>
            ))}
          </ul>
          <p dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
        </div>
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
