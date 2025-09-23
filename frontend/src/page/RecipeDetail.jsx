import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/recipes/detail/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecipe(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
        setError("Impossible de récupérer les détails de la recette.");
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Chargement...</p>;

  return (
    <div className="recipe-detail">
      <h2>{recipe.title}</h2>
      {recipe.image && <img src={recipe.image} alt={recipe.title} />}
      
      <h3>Ingredients:</h3>
      <ul>
        {recipe.extendedIngredients?.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>

      <h3>Instructions:</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(recipe.instructions || "No instructions provided."),
        }}
      />

      <Link to="/recipes" className="back-btn">⬅ Back</Link>
    </div>
  );
}

export default RecipeDetail;
