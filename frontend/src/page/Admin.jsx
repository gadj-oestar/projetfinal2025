import React, { useEffect } from "react";
import "../css/admin.css";

function Admin() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté en tant qu'admin !");
      window.location.href = "/login";
    } else {
      window.location.href = "http://127.0.0.1:8000/admin";
    }
  }, []);

  return (
    <div className="admin-redirect">
      <div className="card">
        <div className="spinner" />
        <h1>Accès au panneau d’administration</h1>
        <p>Nous vérifions vos droits et ouvrons l’interface EasyAdmin…</p>
        <span className="chip">Sécurisé • ROLE_ADMIN requis</span>
        {/* bouton “au cas où” si la redirection n'a pas lieu automatiquement */}
        <button
          className="btn"
          onClick={() => (window.location.href = "http://127.0.0.1:8000/admin")}
          style={{ display: "inline-flex", marginLeft: ".6rem" }}
        >
          Ouvrir maintenant
        </button>
      </div>
    </div>
  );
}

export default Admin;
