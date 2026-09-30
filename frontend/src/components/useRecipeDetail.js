import { useCallback, useState } from "react";
import { addToHistory, fetchRecipeDetail, getToken } from "../api";

// Ouvre la fiche d'une recette et l'ajoute à l'historique
export default function useRecipeDetail(setError) {
  const [open, setOpen] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const openRecipe = useCallback(
    async (id) => {
      if (!getToken()) {
        setError("Vous devez être connecté pour voir les détails.");
        return;
      }
      setOpen(true);
      setRecipe(null);
      setLoading(true);
      try {
        const res = await fetchRecipeDetail(id);
        setRecipe(res.data);
        addToHistory(res.data);
      } catch (err) {
        console.error("Erreur détail :", err.response?.data || err.message);
        setOpen(false);
        setError("Impossible de récupérer les détails de la recette.");
      } finally {
        setLoading(false);
      }
    },
    [setError]
  );

  const close = useCallback(() => setOpen(false), []);

  return { open, recipe, loading, openRecipe, close };
}
