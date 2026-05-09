import React, { useState } from "react";

const ferreterias = [
  {
    nombre: "Ferremax",
    ubicacion: "Dentro de Maipú",
    despacho: 0,
    factorPrecio: 0.97,
    url: "https://www.ferremax.cl"
  },
  {
    nombre: "Construmart",
    ubicacion: "Fuera de Maipú",
    despacho: 15000,
    factorPrecio: 1.04,
    url: "https://www.construmart.cl"
  }
];

export default function ComparadorCotizaciones({ materiales = [] }) {
  const [seleccionada, setSeleccionada] = useState(null);

  const formatCLP = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP"
    });
  };

  const totalBase = materiales.reduce((total, material) => {
    const subtotal = Number(material.subtotal || 0);
    return total + subtotal;
  }, 0);

  const calcularCostoFerreteria = (ferreteria) => {
    const subtotalMateriales = totalBase * ferreteria.factorPrecio;
    return Math.round(subtotalMateriales + ferreteria.despacho);
  };

  const cotizaciones = ferreterias.map((ferreteria) => ({
    ...ferreteria,
    costoTotal: calcularCostoFerreteria(ferreteria)
  }));

  const masEconomica = cotizaciones.reduce((prev, curr) =>
    prev.costoTotal < curr.costoTotal ? prev : curr
  );

  const handlePago = (ferreteria) => {
    setSeleccionada(ferreteria.nombre);
    window.open(ferreteria.url, "_blank");
  };

  if (!materiales.length || totalBase <= 0) {
    return null;
  }

  return (
    <div className="comparador-section">
      <h3>Comparar Cotizaciones en Ferreterías</h3>

      <p>
        <strong>Comuna de destino:</strong> Maipú
      </p>

      <p>
        <strong>Total base del presupuesto:</strong> {formatCLP(totalBase)}
      </p>

      <div className="cotizaciones-grid">
        {cotizaciones.map((ferreteria) => (
          <div
            key={ferreteria.nombre}
            className={`cotizacion-card ${
              ferreteria.nombre === masEconomica.nombre ? "mas-economica" : ""
            }`}
          >
            <h4>{ferreteria.nombre}</h4>

            <p>
              <strong>Ubicación:</strong> {ferreteria.ubicacion}
            </p>

            <p>
              <strong>Variación precio:</strong>{" "}
              {ferreteria.factorPrecio < 1
                ? `${Math.round((1 - ferreteria.factorPrecio) * 100)}% más barato`
                : `${Math.round((ferreteria.factorPrecio - 1) * 100)}% más caro`}
            </p>

            <p>
              <strong>Despacho:</strong> {formatCLP(ferreteria.despacho)}
            </p>

            <p>
              <strong>Total:</strong> {formatCLP(ferreteria.costoTotal)}
            </p>

            {ferreteria.nombre === masEconomica.nombre && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                ¡Más económica!
              </p>
            )}

            <button type="button" onClick={() => handlePago(ferreteria)}>
              Ir a Pago
            </button>

            {seleccionada === ferreteria.nombre && (
              <p>Redirigiendo a {ferreteria.nombre}...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}