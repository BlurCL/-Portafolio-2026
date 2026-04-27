import React, { useMemo, useState } from "react";
import { tiposObra, opcionesPorTipo, datosConstruccion } from "../data/opciones";

export default function FormularioProyecto() {
  const [tipo, setTipo] = useState("");
  const [subtipo, setSubtipo] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [resultado, setResultado] = useState(null);

  const opciones = useMemo(() => opcionesPorTipo[tipo] || [], [tipo]);
  const superficie = useMemo(() => {
    const valorLargo = parseFloat(largo);
    const valorAncho = parseFloat(ancho);
    return !Number.isNaN(valorLargo) && !Number.isNaN(valorAncho)
      ? valorLargo * valorAncho
      : 0;
  }, [largo, ancho]);

  const materialesCalculados = useMemo(() => {
    if (!tipo || !subtipo || superficie === 0) return null;
    const datosTipo = datosConstruccion[tipo];
    if (!datosTipo) return null;
    const datosSubtipo = datosTipo[subtipo];
    if (!datosSubtipo) return null;
    
    const calculados = [];
    let costoTotal = 0;
    
    for (const material of datosSubtipo.materiales) {
      const cantidad = material.rendimiento * superficie;
      const costo = cantidad * material.precio;
      costoTotal += costo;
      calculados.push({
        nombre: material.nombre,
        cantidad: cantidad.toFixed(2),
        costo: costo.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
      });
    }
    
    return { materiales: calculados, costoTotal };
  }, [tipo, subtipo, superficie]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultado(superficie);
  };

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
    setSubtipo("");
  };

  return (
    <section className="card">
      <h2>Formulario de proyecto</h2>
      <p>Selecciona el tipo de obra y completa las medidas para obtener la superficie.</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Tipo de obra
          <select value={tipo} onChange={handleTipoChange}>
            <option value="">Seleccione</option>
            {tiposObra.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subtipo
          <select value={subtipo} onChange={(e) => setSubtipo(e.target.value)} disabled={!tipo}>
            <option value="">Seleccione</option>
            {opciones.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </label>

        <label>
          Largo (m)
          <input
            type="number"
            min="0"
            step="0.1"
            value={largo}
            onChange={(e) => setLargo(e.target.value)}
            placeholder="Ej. 5.0"
          />
        </label>

        <label>
          Ancho (m)
          <input
            type="number"
            min="0"
            step="0.1"
            value={ancho}
            onChange={(e) => setAncho(e.target.value)}
            placeholder="Ej. 3.2"
          />
        </label>

        <div className="button-row">
          <button type="submit" disabled={!tipo || !subtipo || !largo || !ancho}>
            Calcular superficie
          </button>
        </div>
      </form>

      <div className="info-panel">
        <p>
          <strong>Tipo seleccionado:</strong> {tipo || "No elegido"}
        </p>
        <p>
          <strong>Subtipo:</strong> {subtipo || "No elegido"}
        </p>
        <p>
          <strong>Superficie actual:</strong> {superficie ? `${superficie.toFixed(2)} m²` : "--"}
        </p>
      </div>

      {resultado !== null && (
        <div className="result-box">
          <p>La superficie de tu proyecto es <strong>{resultado.toFixed(2)} m²</strong>.</p>
          {materialesCalculados && (
            <div className="materiales-section">
              <h3>Materiales necesarios:</h3>
              <ul>
                {materialesCalculados.materiales.map((material, index) => (
                  <li key={index}>
                    <strong>{material.nombre}:</strong> {material.cantidad} - {material.costo}
                  </li>
                ))}
              </ul>
              <p className="costo-total">
                <strong>Costo total estimado: {materialesCalculados.costoTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}