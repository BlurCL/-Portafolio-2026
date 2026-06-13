import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";

export default function AdminFerreterias({ user }) {
  const [ferreterias, setFerreterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guardandoId, setGuardandoId] = useState(null);
  const [error, setError] = useState("");

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

  const cambiarEstado = async (ferreteria) => {
    const nuevoEstado = !ferreteria.activa;

    try {
      setGuardandoId(ferreteria.idFerreteria);
      setError("");
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
        Desde aquí puedes habilitar o deshabilitar las ferreterías que aparecen en
        el comparador de cotizaciones.
      </p>

      {loading && <div className="info-panel">Cargando ferreterías...</div>}
      {error && <div className="alert-error">{error}</div>}

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
