import React from "react";

// Mise en page commune aux pages de connexion et d'inscription
function AuthLayout({ children }) {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <span className="brand">
          <span className="brand-mark" aria-hidden="true">R</span>
          RecetteBuddy
        </span>
        <div>
          <h2>Des recettes à partir de ce que vous avez déjà.</h2>
          <p>Moins de gaspillage, moins de courses, plus d'idées pour le dîner.</p>
        </div>
        <span />
      </aside>
      <main className="auth-main">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;
