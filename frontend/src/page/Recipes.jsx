import React, { useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { API_URL, authHeaders, getToken } from "../api";
import RecipeCard from "../components/RecipeCard.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import useRecipeDetail from "../components/useRecipeDetail.js";
import useToast from "../components/useToast.js";
import HowItWork from "./HowItWork";

// Le back traduit les ingrédients en anglais avant d'interroger Spoonacular
const EXAMPLES = ["œuf, tomate, spaghetti", "riz, haricots, bœuf", "carotte, tomate, pomme"];

function Recipes() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, showToast] = useToast();
  const detail = useRecipeDetail(setError);

  // === GENERER LES RECETTES ===
  const handleGenerate = async (e) => {
    e?.preventDefault();
    const query = ingredients.trim();
    if (!query) return;

    if (!getToken()) {
      setError("Vous devez être connecté pour générer une recette.");
      return;
    }

    setError("");
    setLoading(true);
    setRecipes([]);

    try {
      const res = await axios.get(`${API_URL}/api/recipes/${encodeURIComponent(query)}`, {
        headers: authHeaders(),
      });

      if (res.data.results?.length > 0) {
        setRecipes(res.data.results);
      } else {
        setError("Aucune recette trouvée avec ces ingrédients.");
      }
    } catch (err) {
      console.error("Erreur API :", err.response?.data || err.message);
      setError("Impossible de récupérer les recettes. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // === AJOUTER AUX FAVORIS EN BDD ===
  const addFavorite = async (recipe) => {
    if (!getToken()) {
      setError("Vous devez être connecté pour ajouter aux favoris.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/favorites`,
        { recipeId: recipe.id, title: recipe.title, image: recipe.image || "" },
        { headers: authHeaders() }
      );
      showToast(`« ${recipe.title} » ajoutée aux favoris`);
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.error || "Impossible d'ajouter la recette aux favoris.");
    }
  };

  return (
    <div className="container">
      <section className="hero">
        <span className="eyebrow">Anti-gaspi, zéro prise de tête</span>
        <h1>
          Qu'est-ce qu'on cuisine <em>avec ce que vous avez</em> ?
        </h1>
        <p className="hero-sub">
          Entrez les ingrédients de votre frigo, RecetteBuddy vous propose des recettes à faire tout de suite.
        </p>

        <form className="search" onSubmit={handleGenerate} role="search">
          <input
            type="text"
            placeholder="Ex. : œuf, tomate, riz"
            aria-label="Vos ingrédients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <AiOutlineLoading3Quarters className="spin" /> : "Trouver des recettes"}
          </button>
        </form>
        <p className="hint">Ingrédients en français ou en anglais, séparés par des virgules.</p>

        <div className="chips">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" className="chip" onClick={() => setIngredients(ex)}>
              {ex}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="alert" role="alert">{error}</p>}

      {(loading || recipes.length > 0) && (
        <section className="section">
          <h2 className="section-title">
            {loading ? "Recherche en cours..." : `${recipes.length} idées de recettes`}
          </h2>
          <ul className="recipe-grid">
            {loading
              ? [0, 1, 2, 3].map((i) => <li key={i} className="skeleton" />)
              : recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onOpen={(r) => detail.openRecipe(r.id)}
                    onFavorite={addFavorite}
                  />
                ))}
          </ul>
        </section>
      )}

      <HowItWork />

      {detail.open && (
        <RecipeModal recipe={detail.recipe} loading={detail.loading} onClose={detail.close} />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default Recipes;
