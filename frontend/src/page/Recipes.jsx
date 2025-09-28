import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import "../css/recipes.css";
import Header from "./Header.jsx";
import HowItWork from "./HowItWork";

function Recipes() {
  // === STATES ===
  const [ingredients, setIngredients] = useState(""); // Les ingrédients entrés par l'utilisateur
  const [recipes, setRecipes] = useState([]); // Liste des recettes récupérées
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Détails d'une recette sélectionnée
  const [error, setError] = useState(""); // Message d'erreur
  const [loading, setLoading] = useState(false); // Chargement de la génération de recettes
  const [detailLoading, setDetailLoading] = useState(false); // Chargement des détails d'une recette
  const [darkMode, setDarkMode] = useState(false); // Mode sombre / clair

  // === FONCTION POUR TOGGLER LE MODE JOUR/NUIT ===
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Appliquer la classe CSS "dark" ou "light" au body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // === FONCTION POUR GÉNÉRER LES RECETTES ===
  const handleGenerate = async () => {
    const query = ingredients.trim(); // Nettoyage de l'entrée
    if (!query) return; // Si aucun ingrédient, on quitte

    // Vérifie si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour générer une recette.");
      alert("Vous devez être connecté pour générer une recette."); // Notification
      return; // Stoppe la fonction
    }

    setError(""); // Reset des erreurs
    setLoading(true); // Affiche le loader
    setRecipes([]); // Reset des recettes
    setSelectedRecipe(null); // Reset du détail

    try {
      // Appel API pour récupérer les recettes
      const res = await axios.get(
        `http://127.0.0.1:8000/api/recipes/${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
      );

      if (res.data.results?.length > 0) {
        setRecipes(res.data.results);

        // Historique local : on évite les doublons
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
      setLoading(false); // Masque le loader
    }
  };

  
  // === FONCTION POUR AFFICHER LES DÉTAILS D'UNE RECETTE ===
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

  // === FONCTION POUR AJOUTER AUX FAVORIS ===
  const addFavorite = (recipe) => {
    if (!recipe?.id || !recipe?.title) return;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.find((r) => r.id === recipe.id)) {
      favorites.push(recipe);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${recipe.title} ajouté aux favoris !`);
    }
  };

  // === FONCTION POUR EXEMPLES D'INGRÉDIENTS ===
  const handleExampleClick = (example) => {
    if (typeof example === "string" && example.length < 100) {
      setIngredients(example.trim());
    }
  };

  // === RENDER ===
  return (
    <div className={`recipes-page page-with-header ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <Header />

      {/* Section Search */}
      <div className="search-section">
        {/* Toggle Dark Mode */}
        <button
          className="button-toggle"
          onClick={toggleDarkMode}
          style={{
            backgroundColor: darkMode ? "#f5deb3" : "#2c3e50",
            color: darkMode ? "#333" : "#fff",
          }}
        >
          {darkMode ? "Mode Jour" : "Mode Nuit"}
        </button>

        {/* Titres */}
        <h1 className="welcome-title">WELCOME ,</h1>
        <h2 className="subtitle">What ingredients do you have today?</h2>

        {/* Input + Generate */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter your ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? <AiOutlineLoading3Quarters className="spin" /> : "Generate"}
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && <p className="error">{error}</p>}

      {/* Liste des recettes */}
      {recipes.length > 0 && (
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              <h3>{recipe.title}</h3>
              <button onClick={() => addFavorite(recipe)}>❤️ Favoris</button>
              <button onClick={() => fetchRecipeDetail(recipe.id)}>Voir Détails</button>
            </li>
          ))}
        </ul>
      )}

      {/* Loader détails */}
      {detailLoading && <p>Chargement du détail...</p>}

      {/* Détails recette */}
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

      {/* Exemples d'ingrédients */}
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

      {/* Section How It Works */}
      <HowItWork />
    </div>
  );
}

export default Recipes;
