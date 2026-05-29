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

        <footer className="app-footer">
          <div className="app-footer-content">
            <p>
              ConstruFácil se tomó como referencia la Norma Chilena NCh353:2018, Construcción – Cubicación de obras de edificación – Metodología de cálculo – Requisitos, elaborada por el Instituto Nacional de Normalización. Esta norma establece criterios para determinar cantidades de partidas de obras de edificación, lo que permite justificar el uso de unidades como metros cúbicos, metros cuadrados, metros lineales y unidades en la estimación de materiales.
            </p>
            <p>
              El sistema no reemplaza una cubicación profesional ni un presupuesto técnico definitivo, sino que aplica reglas simplificadas basadas en criterios de medición usados en construcción.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        
        <div className="header-wrapper">
          <h1 className="text-center" style={{ margin: 0 }}>ConstruFácil</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
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

      <footer className="app-footer">
        <div className="app-footer-content">
          <p>
ConstruFácil se basa en la norma chilena NCh353:2018 para estimar materiales de construcción utilizando medidas como metros cúbicos, cuadrados y lineales.          </p>
          <p>
El sistema solo aplica reglas simplificadas y no reemplaza una cubicación o presupuesto profesional.          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;


