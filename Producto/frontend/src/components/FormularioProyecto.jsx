import React, { useMemo, useState, useEffect } from "react";
import { tiposObra, opcionesPorTipo, datosConstruccion } from "../data/opciones";
import ComparadorCotizaciones from "./ComparadorCotizaciones";

export default function FormularioProyecto({ user }) {
  const [tipo, setTipo] = useState("");
  const [subtipo, setSubtipo] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [borradores, setBorradores] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [showBorradores, setShowBorradores] = useState(false);

  useEffect(() => {
    if (user) {
      const savedHistorial = localStorage.getItem(`historial_${user.email}`);
      if (savedHistorial) {
        setHistorial(JSON.parse(savedHistorial));
      }
      const savedBorradores = localStorage.getItem(`borradores_${user.email}`);
      if (savedBorradores) {
        setBorradores(JSON.parse(savedBorradores));
      }
    }
  }, [user]);

  const saveHistorial = (cotizacion) => {
    if (user) {
      const newHistorial = [...historial, { ...cotizacion, fecha: new Date().toISOString() }];
      setHistorial(newHistorial);
      localStorage.setItem(`historial_${user.email}`, JSON.stringify(newHistorial));
    }
  };

  const saveBorrador = () => {
    if (user && (tipo || subtipo || largo || ancho)) {
      const borrador = { tipo, subtipo, largo, ancho, fecha: new Date().toISOString() };
      const newBorradores = [...borradores, borrador];
      setBorradores(newBorradores);
      localStorage.setItem(`borradores_${user.email}`, JSON.stringify(newBorradores));
    }
  };

  const loadBorrador = (borrador) => {
    setTipo(borrador.tipo);
    setSubtipo(borrador.subtipo);
    setLargo(borrador.largo);
    setAncho(borrador.ancho);
  };

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
    if (materialesCalculados) {
      const cotizacion = {
        tipo,
        subtipo,
        superficie,
        materiales: materialesCalculados.materiales,
        costoTotal: materialesCalculados.costoTotal
      };
      saveHistorial(cotizacion);
    }
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
          {user && (
            <button type="button" onClick={saveBorrador}>
              Guardar Borrador
            </button>
          )}
        </div>
      </form>

      {user && (
        <div className="button-row">
          <button onClick={() => setShowHistorial(!showHistorial)}>
            {showHistorial ? 'Ocultar Historial' : 'Ver Historial'}
          </button>
          <button onClick={() => setShowBorradores(!showBorradores)}>
            {showBorradores ? 'Ocultar Borradores' : 'Ver Borradores'}
          </button>
        </div>
      )}

      {showHistorial && user && (
        <div className="historial-section">
          <h3>Historial de Cotizaciones</h3>
          {historial.length === 0 ? (
            <p>No hay cotizaciones guardadas.</p>
          ) : (
            <ul>
              {historial.map((item, index) => (
                <li key={index}>
                  <strong>{item.tipo} - {item.subtipo}</strong> ({item.superficie.toFixed(2)} m²) - {item.costoTotal} - {new Date(item.fecha).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showBorradores && user && (
        <div className="borradores-section">
          <h3>Borradores</h3>
          {borradores.length === 0 ? (
            <p>No hay borradores guardados.</p>
          ) : (
            <ul>
              {borradores.map((borrador, index) => (
                <li key={index}>
                  <strong>{borrador.tipo} - {borrador.subtipo}</strong> ({borrador.largo}x{borrador.ancho}) - {new Date(borrador.fecha).toLocaleString()}
                  <button onClick={() => loadBorrador(borrador)}>Cargar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
              <ComparadorCotizaciones materiales={materialesCalculados.materiales} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}