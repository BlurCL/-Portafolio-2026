import React from "react";

export default function AdminFerreterias({ user }) {
  const [ferreterias, setFerreterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guardandoId, setGuardandoId] = useState(null);
  const [error, setError] = useState("");

  const esAdmin = String(user?.rol || "").toUpperCase() === "ADMIN";

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
    </section>
  );
}

