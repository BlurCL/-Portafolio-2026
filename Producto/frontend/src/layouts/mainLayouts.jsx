import React from "react";

export default function MainLayout({
  user,
  onLogout,
  children,
  vistaActiva,
  setVistaActiva,
  esAdmin,
}) {
  const nombreUsuario =
    user?.nombreUsuario ||
    localStorage.getItem("nombreUsuario") ||
    user?.nombre ||
    user?.correo ||
    localStorage.getItem("correo");

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-logo">ConstruFácil</div>

        <div className="navbar-menu">
          {!esAdmin && (
            <>
              <button
                className={vistaActiva === "inicio" ? "nav-btn active" : "nav-btn"}
                onClick={() => setVistaActiva("inicio")}
              >
                Inicio
              </button>

              <button
                className={vistaActiva === "historial" ? "nav-btn active" : "nav-btn"}
                onClick={() => setVistaActiva("historial")}
              >
                Historial
              </button>

              <button
                className={vistaActiva === "borradores" ? "nav-btn active" : "nav-btn"}
                onClick={() => setVistaActiva("borradores")}
              >
                Borradores
              </button>

              <button
                className={vistaActiva === "comparador" ? "nav-btn active" : "nav-btn"}
                onClick={() => setVistaActiva("comparador")}
              >
                Comparador
              </button>
            </>
          )}

          {esAdmin && (
            <button className="nav-btn active">
              Admin
            </button>
          )}
        </div>

        <div className="navbar-user">
          <span>
            Bienvenido, <strong>{nombreUsuario}</strong>
          </span>

          <button className="btn-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}