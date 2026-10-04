import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { getToken } from "../api";

const currentTheme = () => {
  const saved = document.documentElement.dataset.theme;
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(currentTheme);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Le JWT est sans état : supprimer le jeton suffit, sans attendre l'API
  // (qui peut mettre une minute à se réveiller sur l'offre gratuite de Render)
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const loggedIn = Boolean(getToken());

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
          {loggedIn ? (
            <button onClick={handleLogout}>Déconnexion</button>
          ) : (
            <NavLink to="/login">Connexion</NavLink>
          )}
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
