import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { API_URL, NETWORK_ERROR, getRoles } from "../api";
import AuthLayout from "../components/AuthLayout.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/login_check`, { email, password });
      localStorage.setItem("token", res.data.token);

      // Les administrateurs sont reconnus grâce au rôle présent dans le JWT
      navigate(getRoles().includes("ROLE_ADMIN") ? "/admin" : "/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response ? "Email ou mot de passe incorrect." : NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1>Connexion</h1>
      <p className="muted">Content de vous revoir.</p>

      {error && <p className="alert" role="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
