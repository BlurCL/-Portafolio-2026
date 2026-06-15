import React, { useState } from "react";
import { regiones } from "../data/regiones";

const USUARIO_API_URL =
  import.meta.env.VITE_USUARIO_API_URL || "http://localhost:8084/api";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [region, setRegion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comuna, setComuna] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !password || !confirm) {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre.trim())) {
        setError("El nombre solo puede contener letras.");
        return;
      }
      setError("Completa nombre, correo y contraseña.");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
      edad--;
    }

    if (edad < 18) {
      setError("Debes ser mayor de 18 años.");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(`${USUARIO_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre,
          correo: email,
          password: password,
          confirmarPassword: confirm
        })
      });

      const regexTelefono = /^(\+56)?9\d{8}$/;

      if (telefono && !regexTelefono.test(telefono)) {
        setError("Debe ingresar un teléfono válido. Ej: +56912345678");
        return;
      }

      if (!region || !ciudad || !comuna) {
        setError("Debe seleccionar región, ciudad y comuna.");
        return;
      }

      if (!response.ok) {
        let mensajeError = "No se pudo registrar el usuario.";
        try {
          const errorData = await response.json();
          mensajeError = errorData.error || mensajeError;
        } catch {
        }
        throw new Error(mensajeError);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (onRegister) {
        onRegister({
          nombre,
          fechaNacimiento,
          telefono,
          direccion,
          region,
          ciudad,
          comuna,
          email,
          correo: email,
          token: data.token
        });
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error al registrar usuario.");
    } finally {
      setCargando(false);
    }
  };

  const handleGoToLogin = () => {
    onSwitchToLogin();
  };

  if (success) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">ConstruFácil</h1>
          <p className="auth-subtitle">¡Registro exitoso!</p>
          <p>Ahora puedes iniciar sesión con tu correo y contraseña.</p>

          <button className="auth-button mt-10" onClick={handleGoToLogin}>
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">ConstruFácil</h1>
        <p className="auth-subtitle">Crea tu cuenta</p>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            placeholder="Ej: Juan Pérez González"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />

          <input
            className="auth-input"
            type="date"
            placeholder="Fecha de nacimiento"
            value={fechaNacimiento}
            onChange={e => setFechaNacimiento(e.target.value)}
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Ej: nombre@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="tel"
            placeholder="Ej: +56912345678"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
          />

          <input
            className="auth-input"
            type="text"
            placeholder="Ej: Alameda 1234"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
          />

          <select
            className="auth-input"
            value={region}
            onChange={e => {
              setRegion(e.target.value);
              setCiudad("");
              setComuna("");
            }}
          >
            <option value="">Selecciona una región</option>
            {regiones.map(r => (
              <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
            ))}
          </select>

          <select
            className="auth-input"
            value={ciudad}
            onChange={e => {
              setCiudad(e.target.value);
              setComuna("");
            }}
            disabled={!region}
          >
            <option value="">Selecciona una ciudad</option>
            {region && regiones.find(r => r.nombre === region)?.ciudades.map(c => (
              <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>

          <select
            className="auth-input"
            value={comuna}
            onChange={e => setComuna(e.target.value)}
            disabled={!ciudad}
          >
            <option value="">Selecciona una comuna</option>
            {region && ciudad &&
              regiones
                .find(r => r.nombre === region)
                ?.ciudades.find(c => c.nombre === ciudad)
                ?.comunas.map(com => (
                  <option key={com} value={com}>{com}</option>
                ))}
          </select>

          <input
            className="auth-input"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <small className="auth-help">
              Debe contener al menos 8 caracteres, una mayúscula y un número.
          </small>

          <input
            className="auth-input"
            type="password"
            placeholder="Repita la contraseña"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-button" type="submit" disabled={cargando}>
            {cargando ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="auth-subtitle mt-10">
          <button className="auth-link" type="button" onClick={onSwitchToLogin}>
            ← Volver
          </button>
        </p>
      </div>
    </div>
  );
}