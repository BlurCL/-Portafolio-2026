import React, { useEffect, useMemo, useState } from "react";
import { tiposObra, opcionesPorTipo } from "../data/opciones";
import ComparadorCotizaciones from "./ComparadorCotizaciones";
import { proyectoService } from "../services/proyectoService";
import { formatCLP, formatFecha } from "../utils/formatters";

export default function FormularioProyecto({
  user,
  vistaActiva,
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
  const [error, setError] = useState("");

  const userKey = user?.email || "invitado";
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

  // TABIQUE
  if (tipo === "Tabique") {
    if (!valorAncho || valorAncho <= 0) return 0;
    if (!valorAlto || valorAlto <= 0) return 0;

    return valorAncho * valorAlto;
  }

  // RADIER Y OTROS
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

  const cargarVistaHistorial = async () => {
  if (historial.length === 0) {
    await cargarHistorialBD();
  }
};
useEffect(() => {
  if (vistaActiva === "historial") {
    cargarVistaHistorial();
  }
}, [vistaActiva]);

  const verDetallePresupuesto = async (itemHistorial) => {
    setLoading(true);
    setError("");

    try {
      const data = await proyectoService.obtenerDetallePresupuesto(
        itemHistorial.idPresupuesto
      );

      setResultado({
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
      });

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
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
    if (tipo !== "Tabique" && (!largo || Number(largo) <= 0))
    return "Debes ingresar un largo válido.";
    if (!ancho || Number(ancho) <= 0) return "Debes ingresar un ancho válido.";

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
        // --- AQUÍ ESTÁ LA CORRECCIÓN ---
        tipoObra: subtipo ? subtipo : tipo,
        tipo_obra: subtipo ? subtipo : tipo,

        subtipo,

        largo: Number(largo),
        ancho: Number(ancho),
        alto: altoMapeado,
        superficie,

        medidas: {
          largo: Number(largo),
          ancho: Number(ancho),
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
        ancho: dataPresupuesto.ancho || Number(ancho),
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
    setError("");
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

  return (
  <>
    <section className="card">


      {vistaActiva === "inicio" && (
        <>
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

        {tipo !== "Tabique" && (
          <label>
            Largo en metros
            <input
              type="number"
              name="largo"
              min="0"
              step="0.01"
              value={largo}
              onChange={handleInputChange}
            />
          </label>
        )}

        <label>
        {tipo === "Tabique"
          ? "Ancho en metros"
          : "Ancho en metros"}
        <input
          type="number"
          name="ancho"
          min="0"
          step="0.01"
          value={ancho}
          onChange={handleInputChange}
        />
      </label>

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
              (tipo !== "Tabique" && !largo) ||
                !ancho ||
              (requiereAlto && !alto)
            }
          >
            {loading ? "Generando presupuesto..." : "Calcular presupuesto"}
          </button>

          {resultado && (
            <button type="button" onClick={guardarBorrador}>
              Guardar borrador
            </button>
          )}

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
                  <span>
                    {" "}
                    | Fecha:{" "}
                    {formatFecha(item.fechaCreacion || item.fechaCreation)}
                  </span>

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

      {vistaActiva === "borradores" && (
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
                    <button
                      type="button"
                      onClick={() => cargarBorrador(borrador)}
                    >
                      Cargar
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

    {vistaActiva === "inicio" && resultado && (        <div className="result-box">
          <h3>Presupuesto generado</h3>

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
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "12px",
                    fontSize: "0.95rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Material
                      </th>
                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Cantidad para compra
                      </th>
                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Precio unitario
                      </th>
                      <th style={{ textAlign: "left", padding: "10px" }}>
                        Subtotal
                      </th>
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
                          <td
                            style={{
                              padding: "10px",
                              borderTop: "1px solid #cbd5e1",
                            }}
                          >
                            <strong>{nombreMaterial}</strong>
                          </td>

                          <td
                            style={{
                              padding: "10px",
                              borderTop: "1px solid #cbd5e1",
                            }}
                          >
                            {cantidadCompra} {unidad}
                          </td>

                          <td
                            style={{
                              padding: "10px",
                              borderTop: "1px solid #cbd5e1",
                            }}
                          >
                            {formatCLP(material.precioUnitario)}
                          </td>

                          <td
                            style={{
                              padding: "10px",
                              borderTop: "1px solid #cbd5e1",
                            }}
                          >
                            {formatCLP(calcularSubtotalCompra(material))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "0.9rem",
                  }}
                >
                  Las cantidades se redondean hacia arriba porque los materiales
                  se compran en unidades comerciales completas.
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

      {vistaActiva === "comparador" && (
  !resultado ? (
    <div className="result-box">
      <h3>Comparador de cotizaciones</h3>

      <p>
        Primero debes generar un presupuesto desde la opción
        <strong> Inicio</strong> para poder comparar cotizaciones.
      </p>

      <p style={{ marginTop: "10px", color: "#64748b" }}>
        Una vez generado el presupuesto, podrás revisar y comparar los
        materiales calculados automáticamente por el sistema.
      </p>
    </div>
  ) : (
    <ComparadorCotizaciones
      materiales={detalleResultado.map((item) => ({
        nombre: obtenerNombreMaterial(item),
        cantidad: obtenerCantidadCompra(item.cantidad),
        precioUnitario: item.precioUnitario,
        subtotal: calcularSubtotalCompra(item),
      }))}
    />
  )
)}

    </section>
  </>
);
}