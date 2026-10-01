import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { API_URL, getToken } from "../api";

const ADMIN_URL = `${API_URL}/admin`;

function Admin() {
  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
    } else {
      window.location.href = ADMIN_URL;
    }
  }, []);

  return (
    <div className="container">
      <div className="center-card">
        <AiOutlineLoading3Quarters className="spin" />
        <h1>Ouverture de l'administration</h1>
        <p>Redirection vers EasyAdmin. Le rôle ROLE_ADMIN est requis.</p>
        <a className="btn btn-primary" href={ADMIN_URL}>Ouvrir maintenant</a>
      </div>
    </div>
  );
}

export default Admin;
