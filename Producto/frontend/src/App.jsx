import React, { useState, useEffect } from "react";
import FormularioProyecto from "./components/FormularioProyecto";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("initial");
  const [showCotizacionAnonima, setShowCotizacionAnonima] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUsuario = localStorage.getItem("idUsuario");
    const idCliente = localStorage.getItem("idCliente");
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const correo = localStorage.getItem("correo");
    const rol = localStorage.getItem("rol");

    if (token && correo) {
      setUser({
        idUsuario,
        idCliente,
        nombre: nombreUsuario,
        nombreUsuario,
        email: correo,
        correo,
        rol,
        token,
      });

      setAuthView("login");
      setShowCotizacionAnonima(false);
    }
  }, []);

  const handleRegister = () => {
    setAuthView("login");
  };

  const handleLogin = (loginData) => {
    if (!loginData || !loginData.token) {
      alert("No se recibió token desde el servidor.");
      return;
    }

    setUser({
      idUsuario: loginData.idUsuario,
      idCliente: loginData.idCliente,
      nombre: loginData.nombreUsuario || loginData.nombre || loginData.correo,
      nombreUsuario: loginData.nombreUsuario || loginData.nombre,
      email: loginData.correo || loginData.email,
      correo: loginData.correo || loginData.email,
      rol: loginData.rol,
      token: loginData.token,
    });

    setAuthView("login");
    setShowCotizacionAnonima(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("idCliente");
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("correo");
    localStorage.removeItem("rol");

    setUser(null);
    setAuthView("initial");
    setShowCotizacionAnonima(false);
  };

  if (!user && authView === "initial" && !showCotizacionAnonima) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">ConstruFácil</h1>
          <p className="auth-subtitle">Gestión de proyectos de construcción</p>

          {/* El botón de Generar Cotización fue eliminado de aquí */}

          {/* El botón de Iniciar Sesión ahora es el principal (auth-button) */}
          <button
            className="auth-button"
            onClick={() => {
              setAuthView("login");
              setShowCotizacionAnonima(false);
            }}
          >
            Iniciar Sesión / Registrarse
          </button>
        </div>
      </div>
    );
  }

  if (!user && authView === "register") {
    return (
      <Register
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthView("login")}
      />
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

  if (!user && showCotizacionAnonima) {
    return (
      <div className="app-container">
        <div className="main-content">
          <h1 className="text-center">ConstruFácil</h1>
          <p className="text-center">
            Calcula la superficie de tu proyecto y selecciona el tipo de obra
          </p>
          <button onClick={() => setShowCotizacionAnonima(false)}>
            Volver
          </button>
        </div>

        <div className="main-content mt-10">
          <div className="card">
            <FormularioProyecto user={null} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        
        <div className="header-wrapper">
          <div className="header-title-container">
            <h1 className="text-center" style={{ margin: 0 }}>ConstruFácil</h1>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <p className="text-center mt-10">
          Calcula la superficie de tu proyecto y selecciona el tipo de obra
        </p>
        <p className="text-center mt-10">
          Bienvenido, <strong>{user.nombre || user.nombreUsuario || user.correo}</strong>
        </p>
      </div>

      <div className="main-content mt-10">
        <div className="card">
          <FormularioProyecto user={user} />
        </div>
      </div>
    </div>
  );
}

export default App;