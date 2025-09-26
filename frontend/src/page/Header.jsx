import React, { useState } from "react";
import "../css/header.css";

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
          <li><a href="#home">Home</a></li>
          <li><a href="#howitworks">How it Works</a></li>
          <li><a href="#recipes">Recipes</a></li>
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
