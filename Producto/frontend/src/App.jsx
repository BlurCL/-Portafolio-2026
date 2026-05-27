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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 40,
            borderRadius: 16,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            textAlign: "center",
            maxWidth: 400,
            width: "90%",
          }}
        >
          <h1 style={{ color: "#333", marginBottom: 8, fontSize: 28 }}>
            ConstruFácil
          </h1>

          <p style={{ color: "#666", marginBottom: 32 }}>
            Gestión de proyectos de construcción
          </p>

          <button
            onClick={() => setShowCotizacionAnonima(true)}
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: 16,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            Generar Cotización
          </button>

          <button
            onClick={() => {
              setAuthView("login");
              setShowCotizacionAnonima(false);
            }}
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: 16,
              fontWeight: "bold",
              background: "transparent",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 16,
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
          <h1 style={{ textAlign: "center" }}>ConstruFácil</h1>

          <p style={{ textAlign: "center" }}>
            Calcula la superficie de tu proyecto y selecciona el tipo de obra
          </p>

          <button onClick={() => setShowCotizacionAnonima(false)}>
            Volver
          </button>
        </div>

        <div className="main-content">
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
        <h1 style={{ textAlign: "center" }}>ConstruFácil</h1>

        <p style={{ textAlign: "center" }}>
          Calcula la superficie de tu proyecto y selecciona el tipo de obra
        </p>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Bienvenido, <strong>{user.nombre || user.nombreUsuario || user.correo}</strong>
        </p>

        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div className="main-content">
        <div className="card">
          <FormularioProyecto user={user} />
        </div>
      </div>
    </div>
  );
}

export default App;