import React, { useState } from "react";
import { regiones } from "../data/regiones";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

    const [nombre, setNombre] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [region, setRegion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [comuna, setComuna] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!nombre || !fechaNacimiento || !telefono || !direccion || !region || !ciudad || !comuna || !email || !password || !confirm) {
        setError("Completa todos los campos.");
      } else if (password !== confirm) {
        setError("Las contraseñas no coinciden.");
      } else {
        setError("");
        setSuccess(true);
        onRegister({ nombre, fechaNacimiento, telefono, direccion, region, ciudad, comuna, email, password });
      }
    };

  if (success) {
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
          <p style={{ color: "#666", marginBottom: 32 }}>¡Registro exitoso!</p>
          <p>Ahora puedes iniciar sesión con tu email y contraseña.</p>
          <button 
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

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
        <p style={{ color: "#666", marginBottom: 32 }}>Crea tu cuenta</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={fechaNacimiento}
            onChange={e => setFechaNacimiento(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            type="tel"
            placeholder="Número de teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <select
            value={region}
            onChange={e => {
              setRegion(e.target.value);
              setCiudad("");
              setComuna("");
            }}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="">Selecciona una región</option>
            {regiones.map(r => (
              <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
            ))}
          </select>
          <select
            value={ciudad}
            onChange={e => {
              setCiudad(e.target.value);
              setComuna("");
            }}
            disabled={!region}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="">Selecciona una ciudad</option>
            {region && regiones.find(r => r.nombre === region)?.ciudades.map(c => (
              <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
          <select
            value={comuna}
            onChange={e => setComuna(e.target.value)}
            disabled={!ciudad}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="">Selecciona una comuna</option>
            {region && ciudad &&
              regiones.find(r => r.nombre === region)?.ciudades.find(c => c.nombre === ciudad)?.comunas.map(com => (
                <option key={com} value={com}>{com}</option>
              ))}
          </select>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
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
            Registrarse
          </button>
          {error && <div style={{ color: "#e53e3e", marginBottom: 8 }}>{error}</div>}
        </form>
        <p style={{ color: "#666", marginTop: 16 }}>
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ← Volver
          </button>
        </p>
      </div>
    </div>
  );
}
