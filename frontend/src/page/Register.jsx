import { useState } from "react";
import axios from "axios";
import "../css/register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        email,
        password,
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(
        "Le mot de passe est trop court. Il doit contenir au moins 6 caractères."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" data-icon="📧">
            <label>Email :</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" data-icon="🔒">
            <label>Mot de passe :</label>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-register">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
