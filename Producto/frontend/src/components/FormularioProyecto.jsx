import React, { useEffect, useMemo, useRef, useState } from "react";
import { tiposObra, opcionesPorTipo } from "../data/opciones";
import ComparadorCotizaciones from "./ComparadorCotizaciones";
import { proyectoService } from "../services/proyectoService";
import { formatCLP, formatFecha } from "../utils/formatters";

export default function FormularioProyecto({
  user,
  vistaActiva,
  setVistaActiva,
}) {
  const [obraData, setObraData] = useState({
    nombreObra: "",
    tipo: "",
    subtipo: "",
    largo: "",
    ancho: "",
    alto: "",
  });

  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [borradores, setBorradores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [loadingDetalleId, setLoadingDetalleId] = useState(null);
  const [detalleHistorial, setDetalleHistorial] = useState(null);
  const [error, setError] = useState("");

  const resultadoRef = useRef(null);

  const userKey =
    user?.email ||
    user?.correo ||
    localStorage.getItem("correo") ||
    "invitado";

  const { nombreObra, tipo, subtipo, largo, ancho, alto } = obraData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setObraData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setResultado(null);
    setError("");
  };

  const cargarBorradoresGuardados = () => {
    try {
      const savedBorradores = localStorage.getItem(`borradores_${userKey}`);
      setBorradores(savedBorradores ? JSON.parse(savedBorradores) : []);
    } catch (err) {
      console.error("Error leyendo borradores desde localStorage:", err);
      setBorradores([]);
    }
  };

  useEffect(() => {
    cargarBorradoresGuardados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey]);

  useEffect(() => {
    let altoDefecto = "";

    if (tipo === "Radier") altoDefecto = "0.1";
    if (tipo === "Tabique") altoDefecto = "2.4";

    setObraData((prev) => ({
      ...prev,
      subtipo: "",
      alto: altoDefecto,
    }));

    setResultado(null);
    setError("");
  }, [tipo]);

  const opciones = useMemo(() => opcionesPorTipo[tipo] || [], [tipo]);

  const superficie = useMemo(() => {
    const valorLargo = Number(largo);
    const valorAncho = Number(ancho);
    const valorAlto = Number(alto);

    if (tipo === "Tabique") {
      if (!valorLargo || valorLargo <= 0) return 0;
      if (!valorAlto || valorAlto <= 0) return 0;

      return valorLargo * valorAlto;
    }

    if (!valorLargo || valorLargo <= 0) return 0;
    if (!valorAncho || valorAncho <= 0) return 0;

    return valorLargo * valorAncho;
  }, [tipo, largo, ancho, alto]);

  const requiereAlto = tipo === "Radier" || tipo === "Tabique";

  const etiquetaAlto =
    tipo === "Radier"
      ? "Espesor en metros"
      : tipo === "Tabique"
      ? "Alto en metros"
      : "";

  const placeholderAlto =
    tipo === "Radier"
      ? "Ej: 0.1"
      : tipo === "Tabique"
      ? "Ej: 2.4"
      : "";

  const obtenerIdCliente = () => {
    const id =
      localStorage.getItem("idCliente") ||
      localStorage.getItem("id_cliente") ||
      user?.idCliente ||
      user?.id_cliente;

    return id ? Number(id) : null;
  };

  const obtenerIdUsuario = () => {
    const id =
      localStorage.getItem("idUsuario") ||
      localStorage.getItem("id_usuario") ||
      user?.idUsuario ||
      user?.id_usuario;

    return id ? Number(id) : null;
  };

  const cargarHistorialBD = async () => {
    setLoadingHistorial(true);
    setError("");

    try {
      const idUsuario = obtenerIdUsuario();

      if (!idUsuario) {
        setHistorial([]);
        throw new Error(
          "No se encontró el idUsuario del usuario conectado en localStorage."
        );
      }

      const data = await proyectoService.obtenerHistorial(idUsuario);
      setHistorial(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando historial desde BD:", error);
      setError("No se pudo cargar el historial del usuario conectado.");
    } finally {
      setLoadingHistorial(false);
    }
  };

  useEffect(() => {
    if (vistaActiva === "historial") {
      cargarHistorialBD();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vistaActiva]);

  const verDetallePresupuesto = async (itemHistorial) => {
    const idPresupuesto = itemHistorial.idPresupuesto;

    if (detalleHistorial?.idPresupuesto === idPresupuesto) {
      setDetalleHistorial(null);
      return;
    }

    setLoadingDetalleId(idPresupuesto);
    setError("");

    try {
      const data = await proyectoService.obtenerDetallePresupuesto(
        idPresupuesto
      );

      setDetalleHistorial({
        idPresupuesto: data.idPresupuesto || idPresupuesto,
        obraId: data.obraId || itemHistorial.idObra,
        nombreObra: itemHistorial.nombreObra || "Obra sin nombre",
        tipoObra: data.tipoObra || itemHistorial.tipoObra || "Sin tipo",
        detalle: Array.isArray(data.detalle) ? data.detalle : [],
        total: data.total || itemHistorial.totalPresupuesto || 0,
      });
    } catch (error) {
      console.error("Error cargando detalle del presupuesto:", error);
      setError("No se pudo cargar el detalle del presupuesto seleccionado.");
    } finally {
      setLoadingDetalleId(null);
    }
  };

  const compararDesdeHistorial = async (itemHistorial) => {
    setLoadingDetalleId(itemHistorial.idPresupuesto);
    setError("");

    try {
      const data = await proyectoService.obtenerDetallePresupuesto(
        itemHistorial.idPresupuesto
      );

      const detalle = Array.isArray(data.detalle) ? data.detalle : [];

      setResultado({
        origen: "historial",
        idPresupuesto: data.idPresupuesto || itemHistorial.idPresupuesto,
        obraId: data.obraId || itemHistorial.idObra,
        nombreObra: itemHistorial.nombreObra || "Obra sin nombre",
        tipoObra: data.tipoObra || itemHistorial.tipoObra || "Sin tipo",
        subtipo: "Presupuesto guardado",
        largo: null,
        ancho: null,
        alto: null,
        superficie: null,
        detalle,
        total: data.total || itemHistorial.totalPresupuesto || 0,
      });

      if (typeof setVistaActiva === "function") {
        setVistaActiva("inicio");
      }

      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } catch (error) {
      console.error("Error comparando presupuesto desde historial:", error);
      setError("No se pudo cargar el presupuesto para comparar nuevamente.");
    } finally {
      setLoadingDetalleId(null);
    }
  };

  const guardarBorrador = () => {
    if (!nombreObra && !tipo && !subtipo && !largo && !ancho && !alto) {
      setError("No hay datos para guardar como borrador.");
      return;
    }

    const borrador = {
      ...obraData,
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
    setObraData({
      nombreObra: borrador.nombreObra || "",
      tipo: borrador.tipo || "",
      subtipo: borrador.subtipo || "",
      largo: borrador.largo || "",
      ancho: borrador.ancho || "",
      alto: borrador.alto || "",
    });

    setResultado(null);
    setError("");

    if (typeof setVistaActiva === "function") {
      setVistaActiva("inicio");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

    if (!largo || Number(largo) <= 0) {
      return "Debes ingresar un largo válido.";
    }

    if (tipo !== "Tabique" && (!ancho || Number(ancho) <= 0)) {
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
      const idCliente = obtenerIdCliente();
      const idUsuario = obtenerIdUsuario();
      const altoMapeado = requiereAlto ? Number(alto) : 0;

      const payloadObra = {
        nombre: nombreObra.trim(),
        nombreObra: nombreObra.trim(),
        nombre_obra: nombreObra.trim(),

        idCliente,
        id_cliente: idCliente,

        idUsuario,
        id_usuario: idUsuario,

        usuarioEmail: user?.email || user?.correo || null,
        usuario_email: user?.email || user?.correo || null,

        tipo,
        tipoObra: subtipo ? subtipo : tipo,
        tipo_obra: subtipo ? subtipo : tipo,

        subtipo,

        largo: Number(largo),
        ancho: tipo === "Tabique" ? 0 : Number(ancho),
        alto: altoMapeado,
        superficie,

        medidas: {
          largo: Number(largo),
          ancho: tipo === "Tabique" ? 0 : Number(ancho),
          alto: altoMapeado,
        },
      };

      const dataObra = await proyectoService.crearObra(payloadObra);

      const obraId =
        dataObra.id ||
        dataObra.obraId ||
        dataObra.obra_id ||
        dataObra.idObra ||
        dataObra.id_obra;

      if (!obraId) {
        throw new Error("El backend creó la obra, pero no devolvió el ID.");
      }

      const dataPresupuesto = await proyectoService.calcularPresupuesto(obraId);

      setResultado({
        origen: "backend",
        idPresupuesto:
          dataPresupuesto.idPresupuesto ||
          dataPresupuesto.id_presupuesto ||
          null,
        obraId,
        nombreObra: nombreObra.trim(),
        tipoObra: dataPresupuesto.tipoObra || dataPresupuesto.tipo_obra || tipo,
        subtipo: dataPresupuesto.subtipo || subtipo,
        largo: dataPresupuesto.largo || Number(largo),
        ancho:
          dataPresupuesto.ancho || (tipo === "Tabique" ? 0 : Number(ancho)),
        alto: dataPresupuesto.alto || altoMapeado,
        superficie,
        detalle: Array.isArray(dataPresupuesto.detalle)
          ? dataPresupuesto.detalle
          : [],
        total: dataPresupuesto.total || 0,
      });

      if (vistaActiva === "historial") {
        await cargarHistorialBD();
      }
    } catch (error) {
      console.error("Error generando presupuesto:", error);
      setError(
        "No se pudo generar el presupuesto. Revisa la conectividad de los microservicios."
      );
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setObraData({
      nombreObra: "",
      tipo: "",
      subtipo: "",
      largo: "",
      ancho: "",
      alto: "",
    });

    setResultado(null);
    setDetalleHistorial(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const obtenerNombreMaterial = (material) => {
    return (
      material.material ||
      material.nombre ||
      material.nombreMaterial ||
      material.nombre_material ||
      "Material sin nombre"
    );
  };

  const obtenerUnidadComercial = (nombre = "") => {
    const texto = nombre.toLowerCase();

    if (texto.includes("cemento")) return "sacos";
    if (texto.includes("arena")) return "m³";
    if (texto.includes("grava")) return "m³";
    if (texto.includes("malla")) return "unidades";
    if (texto.includes("tornillo")) return "unidades";
    if (texto.includes("zinc")) return "planchas";
    if (texto.includes("costanera")) return "unidades";
    if (texto.includes("perfil")) return "unidades";
    if (texto.includes("yeso")) return "planchas";
    if (texto.includes("osb")) return "unidades";
    if (texto.includes("teja")) return "unidades";
    if (texto.includes("fieltro")) return "rollos";
    if (texto.includes("clavo")) return "unidades";
    if (texto.includes("policarbonato")) return "unidades";
    if (texto.includes("cinta")) return "rollos";
    if (texto.includes("pino")) return "unidades";

    return "unidades";
  };

  const obtenerCantidadCompra = (cantidad) => {
    const numero = Number(cantidad || 0);

    if (numero <= 0) return 0;

    return Math.ceil(numero);
  };

  const calcularSubtotalCompra = (material) => {
    const cantidadCompra = obtenerCantidadCompra(material.cantidad);
    const precioUnitario = Number(material.precioUnitario || 0);

    return cantidadCompra * precioUnitario;
  };

  const calcularTotalCompra = (detalle = []) => {
    return detalle.reduce((total, material) => {
      return total + calcularSubtotalCompra(material);
    }, 0);
  };

  const mostrarSubtipo = (subtipoResultado) => {
    if (!subtipoResultado) return false;
    if (subtipoResultado === "Presupuesto guardado") return false;

    return true;
  };

  const tieneSuperficieValida = (valorSuperficie) => {
    return valorSuperficie !== null && Number(valorSuperficie) > 0;
  };

  const detalleResultado = Array.isArray(resultado?.detalle)
    ? resultado.detalle
    : [];

  useEffect(() => {
    if (resultado && vistaActiva === "inicio") {
      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }
  }, [resultado, vistaActiva]);

  return (
    <>
      <section className="card">
        {error && <div className="alert-error">{error}</div>}

        {vistaActiva === "inicio" && (
          <>
            <div className="seccion-header">
              <div>
                <h2>Cotizar proyecto</h2>
                <p>
                  Completa los datos de la obra. Al calcular, el presupuesto y
                  las cotizaciones aparecerán automáticamente en esta misma
                  pantalla.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                Nombre de la obra
                <input
                  type="text"
                  name="nombreObra"
                  value={nombreObra}
                  onChange={handleInputChange}
                  placeholder="Ej: Radier patio"
                />
              </label>

              <label>
                Tipo de obra
                <select name="tipo" value={tipo} onChange={handleInputChange}>
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
                  name="subtipo"
                  value={subtipo}
                  onChange={handleInputChange}
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
                  name="largo"
                  min="0"
                  step="0.01"
                  value={largo}
                  onChange={handleInputChange}
                  placeholder="Ej: 5"
                />
              </label>

              {tipo !== "Tabique" && (
                <label>
                  Ancho en metros
                  <input
                    type="number"
                    name="ancho"
                    min="0"
                    step="0.01"
                    value={ancho}
                    onChange={handleInputChange}
                    placeholder="Ej: 3"
                  />
                </label>
              )}

              {requiereAlto && (
                <label>
                  {etiquetaAlto}
                  <input
                    type="number"
                    name="alto"
                    min="0"
                    step={tipo === "Radier" ? "0.01" : "0.1"}
                    value={alto}
                    onChange={handleInputChange}
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
                    (tipo !== "Tabique" && !ancho) ||
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
          </>
        )}

        {vistaActiva === "historial" && (
          <div className="historial-section">
            <h3>Historial de presupuestos guardados</h3>

            <p>
              Desde aquí puedes revisar presupuestos anteriores o cargarlos
              nuevamente para comparar ferreterías.
            </p>

            {loadingHistorial ? (
              <p>Cargando historial...</p>
            ) : historial.length === 0 ? (
              <p>No hay presupuestos guardados en la base de datos.</p>
            ) : (
              <ul>
                {historial.map((item) => (
                  <li key={item.idPresupuesto}>
                    <div className="historial-item-header">
                      <div>
                        <strong>{item.nombreObra || "Obra sin nombre"}</strong>
                        <span> | ID: {item.idPresupuesto}</span>
                        <span> | Tipo: {item.tipoObra || "Sin tipo"}</span>
                        <span>
                          {" "}
                          | Total: {formatCLP(item.totalPresupuesto)}
                        </span>
                        <span>
                          {" "}
                          | Fecha:{" "}
                          {formatFecha(item.fechaCreacion || item.fechaCreation)}
                        </span>
                      </div>

                      <div className="button-row small">
                        <button
                          type="button"
                          onClick={() => verDetallePresupuesto(item)}
                          disabled={loadingDetalleId === item.idPresupuesto}
                        >
                          {loadingDetalleId === item.idPresupuesto
                            ? "Cargando..."
                            : detalleHistorial?.idPresupuesto ===
                              item.idPresupuesto
                            ? "Ocultar detalle"
                            : "Ver detalle"}
                        </button>

                        <button
                          type="button"
                          onClick={() => compararDesdeHistorial(item)}
                          disabled={loadingDetalleId === item.idPresupuesto}
                        >
                          Cargar y comparar
                        </button>
                      </div>
                    </div>

                    {detalleHistorial?.idPresupuesto === item.idPresupuesto && (
                      <div className="historial-detalle-card">
                        <h4>Detalle del presupuesto</h4>

                        <p>
                          <strong>Obra:</strong>{" "}
                          {detalleHistorial.nombreObra}
                        </p>

                        <p>
                          <strong>Tipo de obra:</strong>{" "}
                          {detalleHistorial.tipoObra}
                        </p>

                        {detalleHistorial.detalle.length === 0 ? (
                          <p>
                            No hay materiales disponibles para este presupuesto.
                          </p>
                        ) : (
                          <div className="tabla-responsive">
                            <table className="tabla-materiales">
                              <thead>
                                <tr>
                                  <th>Material</th>
                                  <th>Cantidad para compra</th>
                                  <th>Precio unitario</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>

                              <tbody>
                                {detalleHistorial.detalle.map(
                                  (material, index) => {
                                    const nombreMaterial =
                                      obtenerNombreMaterial(material);
                                    const unidad =
                                      obtenerUnidadComercial(nombreMaterial);
                                    const cantidadCompra =
                                      obtenerCantidadCompra(material.cantidad);

                                    return (
                                      <tr key={`${nombreMaterial}_${index}`}>
                                        <td>
                                          <strong>{nombreMaterial}</strong>
                                        </td>
                                        <td>
                                          {cantidadCompra} {unidad}
                                        </td>
                                        <td>
                                          {formatCLP(material.precioUnitario)}
                                        </td>
                                        <td>
                                          {formatCLP(
                                            calcularSubtotalCompra(material)
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <p className="costo-total">
                          <strong>
                            Total estimado de compra:{" "}
                            {formatCLP(
                              calcularTotalCompra(detalleHistorial.detalle)
                            )}
                          </strong>
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {vistaActiva === "borradores" && (
          <div className="borradores-section">
            <h3>Borradores</h3>

            <p>
              Los borradores permiten continuar una cotización que todavía no se
              ha calculado.
            </p>

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
                      <button
                        type="button"
                        onClick={() => cargarBorrador(borrador)}
                      >
                        Cargar borrador
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarBorrador(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {vistaActiva === "inicio" && resultado && (
          <div className="result-box" ref={resultadoRef}>
            <h3>Presupuesto generado</h3>

            {resultado.origen === "historial" && (
              <div className="alert-info">
                Presupuesto recuperado desde historial. Puedes revisar sus
                materiales y comparar nuevamente las ferreterías disponibles.
              </div>
            )}

            <p>
              <strong>Obra:</strong> {resultado.nombreObra}
            </p>

            <p>
              <strong>Tipo de obra:</strong> {resultado.tipoObra}
            </p>

            {mostrarSubtipo(resultado.subtipo) && (
              <p>
                <strong>Subtipo:</strong> {resultado.subtipo}
              </p>
            )}

            {tieneSuperficieValida(resultado.superficie) && (
              <p>
                <strong>Superficie:</strong>{" "}
                {Number(resultado.superficie).toFixed(2)} m²
              </p>
            )}

            {resultado.tipoObra === "Radier" && Number(resultado.alto) > 0 && (
              <p>
                <strong>Espesor:</strong> {resultado.alto} m
              </p>
            )}

            {resultado.tipoObra === "Tabique" && Number(resultado.alto) > 0 && (
              <p>
                <strong>Alto:</strong> {resultado.alto} m
              </p>
            )}

            <div className="materiales-section">
              <h3>Materiales necesarios</h3>

              {detalleResultado.length === 0 ? (
                <p>No hay materiales disponibles para mostrar.</p>
              ) : (
                <div className="tabla-responsive">
                  <table className="tabla-materiales">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Cantidad para compra</th>
                        <th>Precio unitario</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {detalleResultado.map((material, index) => {
                        const nombreMaterial = obtenerNombreMaterial(material);
                        const unidad = obtenerUnidadComercial(nombreMaterial);
                        const cantidadCompra = obtenerCantidadCompra(
                          material.cantidad
                        );

                        return (
                          <tr key={`${nombreMaterial}_${index}`}>
                            <td>
                              <strong>{nombreMaterial}</strong>
                            </td>
                            <td>
                              {cantidadCompra} {unidad}
                            </td>
                            <td>{formatCLP(material.precioUnitario)}</td>
                            <td>{formatCLP(calcularSubtotalCompra(material))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <p className="nota-redondeo">
                    Las cantidades se redondean hacia arriba porque los
                    materiales se compran en unidades comerciales completas.
                  </p>
                </div>
              )}

              <p className="costo-total">
                <strong>
                  Total estimado de compra:{" "}
                  {formatCLP(calcularTotalCompra(detalleResultado))}
                </strong>
              </p>
            </div>
          </div>
        )}

        {vistaActiva === "inicio" && resultado && detalleResultado.length > 0 && (
          <div className="comparador-inline-box">
            <h3>Comparar cotizaciones en ferreterías</h3>

            <p>
              Estas cotizaciones se calculan usando los materiales del
              presupuesto generado y los precios disponibles en cada ferretería.
            </p>

            <ComparadorCotizaciones
              materiales={detalleResultado.map((item) => ({
                nombre: obtenerNombreMaterial(item),
                cantidad: obtenerCantidadCompra(item.cantidad),
                precioUnitario: item.precioUnitario,
                subtotal: calcularSubtotalCompra(item),
              }))}
            />
          </div>
        )}
      </section>
    </>
  );
}