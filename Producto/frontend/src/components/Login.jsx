import React, { useState } from "react";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa todos los campos.");
    } else {
      setError("");
      onLogin({ email, password });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        background: "white",
        padding: 40,
        borderRadius: 16,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: 400,
        width: "90%"
      }}>
        <h1 style={{ color: "#333", marginBottom: 8, fontSize: 28 }}>ConstruFácil</h1>
        <p style={{ color: "#666", marginBottom: 32 }}>Gestión de proyectos de construcción</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
          <button
            type="submit"
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
              marginBottom: 16
            }}
          >
            Iniciar sesión
          </button>
          {error && <div style={{ color: "#e53e3e", marginBottom: 8 }}>{error}</div>}
        </form>
        <p style={{ color: "#666", marginTop: 16 }}>
          ¿No tienes cuenta?{' '}
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
