import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login_check", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Vérifie si c'est Sasuke qui se connecte
      if (email === "jojo@gmail.com" && password === "azerty") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="login-container">
  <h2 className="login-title">Connexion</h2>
  {error && <p className="error">{error}</p>}
  <form onSubmit={handleSubmit} className="login-form">
    <div className="form-group">
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input"
      />
    </div>
    <div className="form-group">
      <label>Mot de passe:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="input"
      />
    </div>
    <button type="submit" className="btn-submit">Se connecter</button>
  </form>
  <p className="register-link">
        Pas encore de compte ? <Link to="/register" style={{ color: "#00c853", textDecoration: "underline" }}>Créer un compte</Link>
      </p>
</div>
  );
}

export default Login;
