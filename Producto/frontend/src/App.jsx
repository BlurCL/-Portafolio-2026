import React from "react";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./layouts/mainLayouts";
import FormularioProyecto from "./components/FormularioProyecto";
import AdminFerreterias from "./components/AdminFerreterias";
import Login from "./views/Login";
import Register from "./views/Register";

export default function App() {
  const { user, authView, setAuthView, handleLogin, handleLogout } = useAuth();

  if (!user && authView === "initial") {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">ConstruFácil</h1>
          <p className="auth-subtitle">Gestión de proyectos de construcción</p>

          <button className="auth-button" onClick={() => setAuthView("login")}>
            Iniciar Sesión / Registrarse
          </button>
        </div>
      </div>
    );
  }

  if (!user && authView === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  if (!user && authView === "register") {
    return (
      <Register
        onRegister={handleLogin}
        onSwitchToLogin={() => setAuthView("login")}
      />
    );
  }

  const esAdmin = String(user?.rol || "").toUpperCase() === "ADMIN";

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {esAdmin ? (
        <AdminFerreterias user={user} />
      ) : (
        <FormularioProyecto user={user} />
      )}
    </MainLayout>
  );
}