import React, { useState } from "react";

const USUARIO_API_URL = "http://localhost:8084/api";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(`${USUARIO_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Correo o contraseña incorrectos.");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("idUsuario", data.idUsuario);
        localStorage.setItem("idCliente", data.idCliente);
        localStorage.setItem("nombreUsuario", data.nombreUsuario);
        localStorage.setItem("correo", data.correo);
        localStorage.setItem("rol", data.rol);
      }

      onLogin({
        idUsuario: data.idUsuario,
        idCliente: data.idCliente,
        nombre: data.nombreUsuario,
        nombreUsuario: data.nombreUsuario,
        email: data.correo,
        correo: data.correo,
        rol: data.rol,
        token: data.token,
      });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  };

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

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <div style={{ color: "#e53e3e", marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: 16,
              fontWeight: "bold",
              background: cargando
                ? "#999"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: cargando ? "not-allowed" : "pointer",
              marginBottom: 16,
            }}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p style={{ color: "#666", marginTop: 16 }}>
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}