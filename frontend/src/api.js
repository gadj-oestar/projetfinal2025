import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getToken = () => localStorage.getItem("token");

export const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// Lit les rôles contenus dans le JWT (payload Lexik : { roles: [...] })
export const getRoles = () => {
  const token = getToken();
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.roles || [];
  } catch {
    return [];
  }
};

export const fetchRecipeDetail = (id) =>
  axios.get(`${API_URL}/api/recipes/detail/${encodeURIComponent(id)}`, { headers: authHeaders() });

// Historique local des recettes consultées (10 dernières)
export const addToHistory = (recipe) => {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const next = [
    { id: recipe.id, title: recipe.title, image: recipe.image || "" },
    ...history.filter((r) => r.id !== recipe.id),
  ].slice(0, 10);
  localStorage.setItem("history", JSON.stringify(next));
};
