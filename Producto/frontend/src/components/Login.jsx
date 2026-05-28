import React, { useState } from "react";

const USUARIO_API_URL =
  import.meta.env.VITE_USUARIO_API_URL || "http://localhost:8084/api";

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
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">ConstruFácil</h1>
        <p className="auth-subtitle">Gestión de proyectos de construcción</p>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="auth-error">{error}</div>}

          <button
            className="auth-button"
            type="submit"
            disabled={cargando}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-subtitle mt-10">
          ¿No tienes cuenta?{" "}
          <button
            className="auth-link"
            type="button"
            onClick={onSwitchToRegister}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}