import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { API_URL } from "../api";

const currentTheme = () => {
  const saved = document.documentElement.dataset.theme;
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(currentTheme);
  const location = useLocation();

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => setIsOpen(false), [location.pathname]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // stockage indisponible : le thème reste valable pour la session
    }
    setTheme(next);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, { method: "POST", credentials: "include" });
    } catch {
      // la déconnexion côté client suffit si l'API ne répond pas
    }
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="app-header">
      <div className="container">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">R</span>
          RecetteBuddy
        </Link>

        <nav className={`nav ${isOpen ? "open" : ""}`} aria-label="Navigation principale">
          <NavLink to="/" end>Accueil</NavLink>
          <NavLink to="/favorites">Favoris</NavLink>
          <NavLink to="/history">Historique</NavLink>
          <button onClick={handleLogout}>Déconnexion</button>
        </nav>

        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        <button
          className="icon-btn menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;
