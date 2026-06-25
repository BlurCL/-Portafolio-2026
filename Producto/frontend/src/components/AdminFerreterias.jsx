import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";

export default function AdminFerreterias({ user }) {
  const [ferreterias, setFerreterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guardandoId, setGuardandoId] = useState(null);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [form, setForm] = useState({
    codigoFerreteria: "",
    nombreFerreteria: "",
    comuna: "",
    direccion: "",
    costoDespacho: 0,
  });

  const esAdmin = String(user?.rol || "").toUpperCase() === "ADMIN";

  const cargarFerreterias = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminService.listarFerreterias();
      setFerreterias(data);
    } catch (err) {
      setError(err.message || "Error al cargar ferreterías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (esAdmin) {
      cargarFerreterias();
    }
  }, [esAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const crearFerreteria = async (e) => {
    e.preventDefault();

    try {
      setCreando(true);
      setError("");
      setMensaje("");

      const data = {
        codigoFerreteria: form.codigoFerreteria.trim().toUpperCase(),
        nombreFerreteria: form.nombreFerreteria.trim(),
        comuna: form.comuna.trim(),
        direccion: form.direccion.trim(),
        costoDespacho: Number(form.costoDespacho || 0),
      };

      await adminService.crearFerreteria(data);
      await cargarFerreterias();

      setForm({
        codigoFerreteria: "",
        nombreFerreteria: "",
        comuna: "",
        direccion: "",
        costoDespacho: 0,
      });

      setMensaje("Ferretería creada correctamente. Quedó deshabilitada por defecto.");
    } catch (err) {
      setError(err.message || "No se pudo crear la ferretería.");
    } finally {
      setCreando(false);
    }
  };

  const cambiarEstado = async (ferreteria) => {
    const nuevoEstado = !ferreteria.activa;

    try {
      setGuardandoId(ferreteria.idFerreteria);
      setError("");
      setMensaje("");

      const actualizada = await adminService.cambiarEstadoFerreteria(
        ferreteria.idFerreteria,
        nuevoEstado
      );

      setFerreterias((actuales) =>
        actuales.map((item) =>
          item.idFerreteria === actualizada.idFerreteria ? actualizada : item
        )
      );
    } catch (err) {
      setError(err.message || "No se pudo cambiar el estado.");
    } finally {
      setGuardandoId(null);
    }
  };

  if (!esAdmin) {
    return (
      <section className="card">
        <h2>Acceso restringido</h2>
        <p>Este módulo solo está disponible para usuarios administradores.</p>
      </section>
    );
  }

  return (
    <section className="card admin-card">
      <h2>Panel de administración</h2>
      <p>
        Desde aquí puedes agregar, habilitar o deshabilitar las ferreterías del
        sistema.
      </p>

      {loading && <div className="info-panel">Cargando ferreterías...</div>}
      {error && <div className="alert-error">{error}</div>}
      {mensaje && <div className="info-panel">{mensaje}</div>}

      <form className="admin-form" onSubmit={crearFerreteria}>
        <h3>Agregar nueva ferretería</h3>

        <div className="admin-form-grid">
          <label>
            Código
            <input
              type="text"
              name="codigoFerreteria"
              placeholder="Ej: FERRETERIA_TRES"
              value={form.codigoFerreteria}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Nombre
            <input
              type="text"
              name="nombreFerreteria"
              placeholder="Ej: Ferretería Nueva"
              value={form.nombreFerreteria}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Comuna
            <input
              type="text"
              name="comuna"
              placeholder="Ej: Maipú"
              value={form.comuna}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Dirección
            <input
              type="text"
              name="direccion"
              placeholder="Ej: Sucursal prueba"
              value={form.direccion}
              onChange={handleChange}
            />
          </label>

          <label>
            Costo despacho
            <input
              type="number"
              name="costoDespacho"
              min="0"
              value={form.costoDespacho}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" className="btn-admin habilitar" disabled={creando}>
          {creando ? "Agregando..." : "Agregar ferretería"}
        </button>

        <p className="admin-note">
          Las nuevas ferreterías se crean deshabilitadas por defecto para evitar
          que aparezcan en el comparador sin productos asociados.
        </p>
      </form>

      {!loading && ferreterias.length === 0 && !error && (
        <div className="info-panel">No hay ferreterías registradas.</div>
      )}

      {ferreterias.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ferretería</th>
                <th>Código</th>
                <th>Comuna</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ferreterias.map((ferreteria) => (
                <tr key={ferreteria.idFerreteria}>
                  <td>{ferreteria.nombreFerreteria}</td>
                  <td>{ferreteria.codigoFerreteria}</td>
                  <td>{ferreteria.comuna}</td>
                  <td>
                    <span
                      className={
                        ferreteria.activa
                          ? "estado-badge activo"
                          : "estado-badge inactivo"
                      }
                    >
                      {ferreteria.activa ? "Habilitada" : "Deshabilitada"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={
                        ferreteria.activa
                          ? "btn-admin deshabilitar"
                          : "btn-admin habilitar"
                      }
                      disabled={guardandoId === ferreteria.idFerreteria}
                      onClick={() => cambiarEstado(ferreteria)}
                    >
                      {guardandoId === ferreteria.idFerreteria
                        ? "Guardando..."
                        : ferreteria.activa
                        ? "Deshabilitar"
                        : "Habilitar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}