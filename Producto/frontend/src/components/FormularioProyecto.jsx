import React, { useEffect, useMemo, useState } from "react";
import { tiposObra, opcionesPorTipo } from "../data/opciones";
import ComparadorCotizaciones from "./ComparadorCotizaciones";

const CALCULO_API_URL = "http://localhost:8081/api";
const OBRAS_API_URL = "http://localhost:8082/api";

export default function FormularioProyecto({ user }) {
  const [nombreObra, setNombreObra] = useState("");
  const [tipo, setTipo] = useState("");
  const [subtipo, setSubtipo] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");

  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [borradores, setBorradores] = useState([]);

  const [showHistorial, setShowHistorial] = useState(false);
  const [showBorradores, setShowBorradores] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [error, setError] = useState("");

  const userKey = user?.email || "invitado";

  useEffect(() => {
    cargarBorradoresGuardados();
  }, [userKey]);

  useEffect(() => {
    setSubtipo("");
    setResultado(null);
    setError("");

    if (tipo === "Radier") {
      setAlto("0.1");
    } else if (tipo === "Tabique") {
      setAlto("2.4");
    } else {
      setAlto("");
    }
  }, [tipo]);

  const opciones = useMemo(() => {
    return opcionesPorTipo[tipo] || [];
  }, [tipo]);

  const superficie = useMemo(() => {
    const valorLargo = Number(largo);
    const valorAncho = Number(ancho);
    const valorAlto = Number(alto);

    if (!valorLargo || valorLargo <= 0) {
      return 0;
    }

    if (tipo === "Tabique") {
      if (!valorAlto || valorAlto <= 0) {
        return 0;
      }

      return valorLargo * valorAlto;
    }

    if (!valorAncho || valorAncho <= 0) {
      return 0;
    }

    return valorLargo * valorAncho;
  }, [tipo, largo, ancho, alto]);

  const requiereAlto = tipo === "Radier" || tipo === "Tabique";

  const etiquetaAlto = useMemo(() => {
    if (tipo === "Radier") return "Espesor en metros";
    if (tipo === "Tabique") return "Alto en metros";
    return "";
  }, [tipo]);

  const placeholderAlto = useMemo(() => {
    if (tipo === "Radier") return "Ej: 0.1";
    if (tipo === "Tabique") return "Ej: 2.4";
    return "";
  }, [tipo]);

  const cargarBorradoresGuardados = () => {
    try {
      const savedBorradores = localStorage.getItem(`borradores_${userKey}`);
      setBorradores(savedBorradores ? JSON.parse(savedBorradores) : []);
    } catch (error) {
      console.error("Error leyendo borradores desde localStorage:", error);
      setBorradores([]);
    }
  };

  const cargarHistorialBD = async () => {
    setLoadingHistorial(true);
    setError("");

    try {
      const response = await fetch(`${CALCULO_API_URL}/calculos/presupuestos`);

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      setHistorial(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando historial desde BD:", error);
      setError(
        "No se pudo cargar el historial desde la base de datos. Revisa que calculo-service esté funcionando en el puerto 8081."
      );
    } finally {
      setLoadingHistorial(false);
    }
  };

  const toggleHistorial = async () => {
    const nuevoEstado = !showHistorial;
    setShowHistorial(nuevoEstado);

    if (nuevoEstado) {
      await cargarHistorialBD();
    }
  };

  const verDetallePresupuesto = async (itemHistorial) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${CALCULO_API_URL}/calculos/presupuesto/${itemHistorial.idPresupuesto}`
      );

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      const resultadoDetalle = {
        origen: "backend",
        idPresupuesto: data.idPresupuesto || itemHistorial.idPresupuesto,
        obraId: data.obraId || itemHistorial.idObra,
        nombreObra: itemHistorial.nombreObra || "Obra sin nombre",
        tipoObra: data.tipoObra || itemHistorial.tipoObra,
        subtipo: "Presupuesto guardado",
        largo: null,
        ancho: null,
        alto: null,
        superficie: null,
        detalle: Array.isArray(data.detalle) ? data.detalle : [],
        total: data.total || itemHistorial.totalPresupuesto || 0,
      };

      setResultado(resultadoDetalle);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error("Error cargando detalle del presupuesto:", error);
      setError("No se pudo cargar el detalle del presupuesto seleccionado.");
    } finally {
      setLoading(false);
    }
  };

  const guardarBorrador = () => {
    if (!nombreObra && !tipo && !subtipo && !largo && !ancho && !alto) {
      setError("No hay datos para guardar como borrador.");
      return;
    }

    const borrador = {
      nombreObra,
      tipo,
      subtipo,
      largo,
      ancho,
      alto,
      fecha: new Date().toISOString(),
    };

    const nuevosBorradores = [...borradores, borrador];

    setBorradores(nuevosBorradores);
    localStorage.setItem(
      `borradores_${userKey}`,
      JSON.stringify(nuevosBorradores)
    );

    setError("");
    alert("Borrador guardado correctamente.");
  };

  const cargarBorrador = (borrador) => {
    setNombreObra(borrador.nombreObra || "");
    setTipo(borrador.tipo || "");
    setSubtipo(borrador.subtipo || "");
    setLargo(borrador.largo || "");
    setAncho(borrador.ancho || "");
    setAlto(borrador.alto || "");
    setResultado(null);
    setError("");
  };

  const eliminarBorrador = (index) => {
    const nuevosBorradores = borradores.filter((_, i) => i !== index);

    setBorradores(nuevosBorradores);
    localStorage.setItem(
      `borradores_${userKey}`,
      JSON.stringify(nuevosBorradores)
    );
  };

  const validarFormulario = () => {
    if (!nombreObra.trim()) return "Debes ingresar un nombre para la obra.";
    if (!tipo) return "Debes seleccionar un tipo de obra.";
    if (!subtipo) return "Debes seleccionar un subtipo.";
    if (!largo || Number(largo) <= 0) return "Debes ingresar un largo válido.";

    if (!ancho || Number(ancho) <= 0) {
      return "Debes ingresar un ancho válido.";
    }

    if (tipo === "Radier" && (!alto || Number(alto) <= 0)) {
      return "Debes ingresar un espesor válido para el radier.";
    }

    if (tipo === "Tabique" && (!alto || Number(alto) <= 0)) {
      return "Debes ingresar un alto válido para el tabique.";
    }

    if (superficie <= 0) return "La superficie debe ser mayor a cero.";

    return "";
  };

  const obtenerMensajeBackend = async (response) => {
    try {
      const texto = await response.text();
      return texto || "Sin detalle del backend.";
    } catch {
      return "No se pudo leer el detalle del error.";
    }
  };

  const obtenerAltoParaBackend = () => {
    if (tipo === "Radier") return Number(alto || 0.1);
    if (tipo === "Tabique") return Number(alto || 2.4);
    return 0;
  };

  const crearObra = async () => {
    const payloadObra = {
      nombre: nombreObra.trim(),
      nombreObra: nombreObra.trim(),
      nombre_obra: nombreObra.trim(),

      usuarioEmail: user?.email || null,
      usuario_email: user?.email || null,

      tipo,
      tipoObra: tipo,
      tipo_obra: tipo,

      subtipo,

      largo: Number(largo),
      ancho: Number(ancho),
      alto: obtenerAltoParaBackend(),
      superficie,

      medidas: {
        largo: Number(largo),
        ancho: Number(ancho),
        alto: obtenerAltoParaBackend(),
      },
    };

    const response = await fetch(`${OBRAS_API_URL}/obras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadObra),
    });

    if (!response.ok) {
      const detalle = await obtenerMensajeBackend(response);
      console.error("Error creando obra:", detalle);

      throw new Error(
        `No se pudo crear la obra. Código HTTP: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Obra creada desde obras-service:", data);

    const obraId = data.id || data.obraId || data.obra_id;

    if (!obraId) {
      console.error("Respuesta sin ID desde obras-service:", data);
      throw new Error("El backend creó la obra, pero no devolvió el ID.");
    }

    return {
      obraId,
      obra: data,
    };
  };

  const calcularPresupuesto = async (obraId) => {
    const response = await fetch(
      `${CALCULO_API_URL}/calculos/obra/${obraId}/guardar`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      const detalle = await obtenerMensajeBackend(response);
      console.error("Error calculando presupuesto:", detalle);

      throw new Error(
        `No se pudo calcular el presupuesto. Código HTTP: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Presupuesto calculado desde calculo-service:", data);

    return data;
  };

  const normalizarResultadoBackend = (data, obraId) => {
    return {
      origen: "backend",
      idPresupuesto: data.idPresupuesto || data.id_presupuesto || null,
      obraId,
      nombreObra: nombreObra.trim(),
      tipoObra: data.tipoObra || data.tipo_obra || tipo,
      subtipo: data.subtipo || subtipo,
      largo: data.largo || Number(largo),
      ancho: data.ancho || Number(ancho),
      alto: data.alto || obtenerAltoParaBackend(),
      superficie,
      detalle: Array.isArray(data.detalle) ? data.detalle : [],
      total: data.total || 0,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mensajeError = validarFormulario();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const { obraId } = await crearObra();

      const dataPresupuesto = await calcularPresupuesto(obraId);

      const resultadoFinal = normalizarResultadoBackend(
        dataPresupuesto,
        obraId
      );

      setResultado(resultadoFinal);

      if (showHistorial) {
        await cargarHistorialBD();
      }
    } catch (error) {
      console.error("Error generando presupuesto:", error);

      setError(
        "No se pudo generar el presupuesto. Revisa que obras-service esté en el puerto 8082, calculo-service en el puerto 8081 y que exista el endpoint POST /api/obras."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
  };

  const limpiarFormulario = () => {
    setNombreObra("");
    setTipo("");
    setSubtipo("");
    setLargo("");
    setAncho("");
    setAlto("");
    setResultado(null);
    setError("");
  };

  const formatCLP = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleString("es-CL");
  };

  return (
    <section className="card">
      <h2>Formulario de proyecto</h2>

      <p>
        Ingresa los datos de la obra para calcular materiales y generar un
        presupuesto. El sistema guardará la obra automáticamente.
      </p>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Nombre de la obra
          <input
            type="text"
            value={nombreObra}
            onChange={(e) => {
              setNombreObra(e.target.value);
              setResultado(null);
              setError("");
            }}
            placeholder="Ej: Radier patio"
          />
        </label>

        <label>
          Tipo de obra
          <select value={tipo} onChange={handleTipoChange}>
            <option value="">Seleccione</option>

            {tiposObra.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subtipo
          <select
            value={subtipo}
            onChange={(e) => {
              setSubtipo(e.target.value);
              setResultado(null);
              setError("");
            }}
            disabled={!tipo}
          >
            <option value="">Seleccione</option>

            {opciones.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Largo en metros
          <input
            type="number"
            min="0"
            step="0.01"
            value={largo}
            onChange={(e) => {
              setLargo(e.target.value);
              setResultado(null);
              setError("");
            }}
            placeholder="Ej: 5"
          />
        </label>

        <label>
          Ancho en metros
          <input
            type="number"
            min="0"
            step="0.01"
            value={ancho}
            onChange={(e) => {
              setAncho(e.target.value);
              setResultado(null);
              setError("");
            }}
            placeholder="Ej: 3"
          />
        </label>

        {requiereAlto && (
          <label>
            {etiquetaAlto}
            <input
              type="number"
              min="0"
              step={tipo === "Radier" ? "0.01" : "0.1"}
              value={alto}
              onChange={(e) => {
                setAlto(e.target.value);
                setResultado(null);
                setError("");
              }}
              placeholder={placeholderAlto}
            />
          </label>
        )}

        <div className="button-row">
          <button
            type="submit"
            disabled={
              loading ||
              !nombreObra.trim() ||
              !tipo ||
              !subtipo ||
              !largo ||
              !ancho ||
              (requiereAlto && !alto)
            }
          >
            {loading ? "Generando presupuesto..." : "Calcular presupuesto"}
          </button>

          <button type="button" onClick={guardarBorrador}>
            Guardar borrador
          </button>

          <button type="button" onClick={limpiarFormulario}>
            Limpiar
          </button>
        </div>
      </form>

      <div className="info-panel">
        <p>
          <strong>Obra:</strong> {nombreObra || "No ingresada"}
        </p>

        <p>
          <strong>Tipo seleccionado:</strong> {tipo || "No elegido"}
        </p>

        <p>
          <strong>Subtipo:</strong> {subtipo || "No elegido"}
        </p>

        <p>
          <strong>Superficie:</strong>{" "}
          {superficie > 0 ? `${superficie.toFixed(2)} m²` : "--"}
        </p>

        {tipo === "Radier" && (
          <p>
            <strong>Espesor:</strong> {alto ? `${alto} m` : "--"}
          </p>
        )}

        {tipo === "Tabique" && (
          <p>
            <strong>Alto:</strong> {alto ? `${alto} m` : "--"}
          </p>
        )}
      </div>

      <div className="button-row">
        <button type="button" onClick={toggleHistorial}>
          {showHistorial ? "Ocultar historial" : "Ver historial"}
        </button>

        <button type="button" onClick={() => setShowBorradores(!showBorradores)}>
          {showBorradores ? "Ocultar borradores" : "Ver borradores"}
        </button>
      </div>

      {showHistorial && (
        <div className="historial-section">
          <h3>Historial de presupuestos guardados</h3>

          {loadingHistorial ? (
            <p>Cargando historial...</p>
          ) : historial.length === 0 ? (
            <p>No hay presupuestos guardados en la base de datos.</p>
          ) : (
            <ul>
              {historial.map((item) => (
                <li key={item.idPresupuesto}>
                  <strong>{item.nombreObra || "Obra sin nombre"}</strong>

                  <span> | ID: {item.idPresupuesto}</span>

                  <span> | Tipo: {item.tipoObra || "Sin tipo"}</span>

                  <span> | Total: {formatCLP(item.totalPresupuesto)}</span>

                  <span> | Fecha: {formatFecha(item.fechaCreacion)}</span>

                  <div className="button-row small">
                    <button
                      type="button"
                      onClick={() => verDetallePresupuesto(item)}
                      disabled={loading}
                    >
                      Ver detalle
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showBorradores && (
        <div className="borradores-section">
          <h3>Borradores</h3>

          {borradores.length === 0 ? (
            <p>No hay borradores guardados.</p>
          ) : (
            <ul>
              {borradores.map((borrador, index) => (
                <li key={`${borrador.fecha}_${index}`}>
                  <strong>{borrador.nombreObra || "Obra sin nombre"}</strong>

                  <span>
                    {" "}
                    | {borrador.tipo || "Sin tipo"} -{" "}
                    {borrador.subtipo || "Sin subtipo"}
                  </span>

                  <span>
                    {" "}
                    | Medidas: {borrador.largo || "--"} x{" "}
                    {borrador.ancho || "--"} m
                  </span>

                  {borrador.tipo === "Radier" && borrador.alto && (
                    <span> | Espesor: {borrador.alto} m</span>
                  )}

                  {borrador.tipo === "Tabique" && borrador.alto && (
                    <span> | Alto: {borrador.alto} m</span>
                  )}

                  <span> | Fecha: {formatFecha(borrador.fecha)}</span>

                  <div className="button-row small">
                    <button type="button" onClick={() => cargarBorrador(borrador)}>
                      Cargar
                    </button>

                    <button type="button" onClick={() => eliminarBorrador(index)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {resultado && (
        <div className="result-box">
          <h3>Presupuesto generado</h3>

          {resultado.idPresupuesto && (
            <p>
              <strong>ID presupuesto:</strong> {resultado.idPresupuesto}
            </p>
          )}

          <p>
            <strong>Obra:</strong> {resultado.nombreObra}
          </p>

          <p>
            <strong>Tipo de obra:</strong> {resultado.tipoObra}
          </p>

          <p>
            <strong>Subtipo:</strong> {resultado.subtipo}
          </p>

          <p>
            <strong>Superficie:</strong>{" "}
            {resultado.superficie
              ? `${Number(resultado.superficie).toFixed(2)} m²`
              : "--"}
          </p>

          {resultado.tipoObra === "Radier" && resultado.alto > 0 && (
            <p>
              <strong>Espesor:</strong> {resultado.alto} m
            </p>
          )}

          {resultado.tipoObra === "Tabique" && resultado.alto > 0 && (
            <p>
              <strong>Alto:</strong> {resultado.alto} m
            </p>
          )}

          <div className="materiales-section">
            <h3>Materiales necesarios</h3>

            {resultado.detalle.length === 0 ? (
              <p>No hay materiales disponibles para mostrar.</p>
            ) : (
              <ul>
                {resultado.detalle.map((material, index) => (
                  <li key={`${material.material}_${index}`}>
                    <strong>{material.material}</strong> - Cantidad:{" "}
                    {material.cantidad} - Precio unitario:{" "}
                    {formatCLP(material.precioUnitario)} - Subtotal:{" "}
                    {formatCLP(material.subtotal)}
                  </li>
                ))}
              </ul>
            )}

            <p className="costo-total">
              <strong>Total estimado: {formatCLP(resultado.total)}</strong>
            </p>

            {resultado.detalle.length > 0 && (
              <ComparadorCotizaciones
                materiales={resultado.detalle.map((item) => ({
                  nombre: item.material,
                  cantidad: item.cantidad,
                  precioUnitario: item.precioUnitario,
                  subtotal: item.subtotal,
                }))}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}