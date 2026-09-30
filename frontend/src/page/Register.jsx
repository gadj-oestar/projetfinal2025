import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { API_URL } from "../api";
import AuthLayout from "../components/AuthLayout.jsx";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/register`, { email, password });
      setSuccess(res.data.message || "Compte créé, vous pouvez vous connecter.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Le mot de passe est trop court. Il doit contenir au moins 6 caractères."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1>Créer un compte</h1>
      <p className="muted">Gratuit, et il ne faut qu'un email.</p>

      {error && <p className="alert" role="alert">{error}</p>}
      {success && (
        <p className="alert alert-success" role="status">
          {success} <Link to="/login">Se connecter</Link>
        </p>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
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
            autoComplete="new-password"
            placeholder="6 caractères minimum"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>
      </form>

      <p className="auth-switch">
        Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
