import React, { useState } from "react";

const ferreterias = [
  {
    nombre: "Ferremax",
    ubicacion: "Dentro de Maipú",
    despacho: 0, // gratis dentro de la comuna
    materiales: {
      "Cemento (sacos)": 5500,
      "Arena (m3)": 22000,
      "Grava (m3)": 20000,
      "Malla ACMA (m2)": 27000,
      "Madera (listones)": 3200,
      "Clavos (kg)": 2700,
      "Plancha OSB (m2)": 16000,
      "Perfil metalcon (m)": 4200,
      "Tornillos (unidades)": 3200,
      "Yeso cartón (m2)": 8500,
      "Masilla (kg)": 4200,
      "Cerchas (unidades)": 37000,
      "Zinc (m2)": 13000,
      "Perfiles metálicos (m)": 6200,
      "Planchas metálicas (m2)": 16000
    }
  },
  {
    nombre: "Construmart",
    ubicacion: "Fuera de Maipú",
    despacho: 15000, // costo de despacho
    materiales: {
      "Cemento (sacos)": 5200,
      "Arena (m3)": 21000,
      "Grava (m3)": 19000,
      "Malla ACMA (m2)": 26000,
      "Madera (listones)": 3100,
      "Clavos (kg)": 2600,
      "Plancha OSB (m2)": 15500,
      "Perfil metalcon (m)": 4100,
      "Tornillos (unidades)": 3100,
      "Yeso cartón (m2)": 8200,
      "Masilla (kg)": 4100,
      "Cerchas (unidades)": 36000,
      "Zinc (m2)": 12500,
      "Perfiles metálicos (m)": 6100,
      "Planchas metálicas (m2)": 15500
    }
  }
];

export default function ComparadorCotizaciones({ materiales }) {
  const [seleccionada, setSeleccionada] = useState(null);

  const calcularCostoFerreteria = (ferreteria) => {
    let total = 0;
    materiales.forEach(material => {
      const precioUnitario = ferreteria.materiales[material.nombre] || 0;
      const cantidad = parseFloat(material.cantidad);
      total += precioUnitario * cantidad;
    });
    return total + ferreteria.despacho;
  };

  const cotizaciones = ferreterias.map(ferreteria => ({
    ...ferreteria,
    costoTotal: calcularCostoFerreteria(ferreteria)
  }));

  const masEconomica = cotizaciones.reduce((prev, curr) => prev.costoTotal < curr.costoTotal ? prev : curr);

  const handlePago = (ferreteria) => {
    // Simular redirección a la ferretería
    if (ferreteria.nombre === "Ferremax") {
      window.open("https://www.ferremax.cl", "_blank");
    } else {
      window.open("https://www.construmart.cl", "_blank"); // Asumiendo URL
    }
  };

  return (
    <div className="comparador-section">
      <h3>Comparar Cotizaciones en Ferreterías</h3>
      <p>Comuna de destino: Maipú</p>
      <div className="cotizaciones-grid">
        {cotizaciones.map((ferreteria, index) => (
          <div key={index} className={`cotizacion-card ${ferreteria === masEconomica ? 'mas-economica' : ''}`}>
            <h4>{ferreteria.nombre}</h4>
            <p>Ubicación: {ferreteria.ubicacion}</p>
            <p>Despacho: ${ferreteria.despacho.toLocaleString('es-CL')}</p>
            <p><strong>Total: ${ferreteria.costoTotal.toLocaleString('es-CL')}</strong></p>
            {ferreteria === masEconomica && <p style={{color: 'green'}}>¡Más económica!</p>}
            <button onClick={() => handlePago(ferreteria)}>Ir a Pago</button>
          </div>
        ))}
      </div>
    </div>
  );
}