import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link correctement
import "../css/header.css";
import Favorite from "./Favorites";
import History from "./History";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      credentials: "include", 
    });
    window.location.href = "/login";
  };

  return (
    <header className="app-header">
      <div className="logo">RecetteBuddy</div>

      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/favorites">Favorites</Link></li>
          <li><Link to="/history">History</Link></li>
          
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <div className="hamburger" onClick={toggleMenu}>
        <div />
        <div />
        <div />
      </div>
    </header>
  );
};

export default Header;
