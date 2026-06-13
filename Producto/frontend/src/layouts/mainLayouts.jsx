import React from "react";

export default function MainLayout({ user, onLogout, children }) {
  return (
    <div className="app-container">
      <div className="main-content">
        <div className="header-wrapper">
          <h1 className="text-center" style={{ margin: 0 }}>ConstruFácil</h1>
          {user && (
            <button className="btn-logout" onClick={onLogout}>Cerrar sesión</button>
          )}
        </div>
        {user && (
          <p className="text-center mt-10">
            Bienvenido, <strong>{user.nombre || user.correo}</strong>
          </p>
        )}
      </div>

      <div className="main-content mt-10">
        {children}
      </div>

      <footer className="app-footer">
        <div className="app-footer-content">
          <p>ConstruFácil se basa en la norma chilena NCh353:2018 para estimar materiales de construcción.</p>
          <p>El sistema solo aplica reglas simplificadas y no reemplaza un presupuesto profesional.</p>
        </div>
      </footer>
    </div>
  );
}