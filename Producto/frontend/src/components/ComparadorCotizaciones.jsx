import React, { useEffect, useMemo, useState } from "react";

const FERRETERIA_API_URL =
  import.meta.env.VITE_FERRETERIA_API_URL || "http://localhost:8083/api";

const FERRETERIA_UNO_FRONT_URL =
  import.meta.env.VITE_FERRETERIA_UNO_FRONT_URL || "";

const FERRETERIA_DOS_FRONT_URL =
  import.meta.env.VITE_FERRETERIA_DOS_FRONT_URL || "";

export default function ComparadorCotizaciones({ materiales = [] }) {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seleccionada, setSeleccionada] = useState(null);

  const formatCLP = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });
  };

  const obtenerNombreComercial = (cotizacion) => {
    if (cotizacion.codigoFerreteria === "FERRETERIA_UNO") {
      return "FerreMax Chile";
    }

    if (cotizacion.codigoFerreteria === "FERRETERIA_DOS") {
      return "ProFerr";
    }

    return cotizacion.nombreFerreteria || "Ferretería";
  };

  const obtenerUrlFerreteria = (cotizacion) => {
    if (cotizacion.codigoFerreteria === "FERRETERIA_UNO") {
      return FERRETERIA_UNO_FRONT_URL;
    }

    if (cotizacion.codigoFerreteria === "FERRETERIA_DOS") {
      return FERRETERIA_DOS_FRONT_URL;
    }

    return "";
  };

  const obtenerUnidadComercial = (nombre = "") => {
    const texto = nombre.toLowerCase();

    if (texto.includes("cemento")) return "sacos";
    if (texto.includes("malla")) return "unidades";
    if (texto.includes("tornillo")) return "unidades";
    if (texto.includes("arena")) return "m³";
    if (texto.includes("grava")) return "m³";
    if (texto.includes("zinc")) return "planchas";
    if (texto.includes("costanera")) return "unidades";
    if (texto.includes("perfil")) return "unidades";
    if (texto.includes("yeso")) return "planchas";

    return "unidades";
  };

  const obtenerCantidadComercial = (item) => {
    const nombre =
      item.productoEncontrado || item.materialSolicitado || item.nombre || "";

    const cantidadTecnica = Number(item.cantidad || 0);
    const unidad = obtenerUnidadComercial(nombre);
    const cantidadRecomendada = Math.ceil(cantidadTecnica);

    return {
      cantidadTecnica,
      cantidadRecomendada,
      unidad,
    };
  };

  const calcularSubtotalComercial = (item) => {
    const { cantidadRecomendada } = obtenerCantidadComercial(item);
    const precioUnitario = Number(item.precioUnitario || 0);

    return cantidadRecomendada * precioUnitario;
  };

  const calcularTotalProductosComercial = (cotizacion) => {
    if (!Array.isArray(cotizacion.detalle)) {
      return Number(cotizacion.totalProductos || 0);
    }

    return cotizacion.detalle.reduce((total, item) => {
      return total + calcularSubtotalComercial(item);
    }, 0);
  };

  const calcularTotalCotizacionComercial = (cotizacion) => {
    const totalProductos = calcularTotalProductosComercial(cotizacion);
    const despacho = Number(cotizacion.costoDespacho || 0);

    return totalProductos + despacho;
  };

  const totalBase = useMemo(() => {
    return materiales.reduce((total, material) => {
      const subtotal = Number(material.subtotal || 0);
      return total + subtotal;
    }, 0);
  }, [materiales]);

  useEffect(() => {
    const cotizarEnFerreterias = async () => {
      if (!materiales.length || totalBase <= 0) {
        setCotizaciones([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const payload = {
          comunaDestino: "Maipú",
          materiales: materiales.map((material) => ({
            nombre:
              material.nombre ||
              material.material ||
              material.nombreProducto ||
              "",
            cantidad: Number(material.cantidad || 0),
            precioUnitario: Number(material.precioUnitario || 0),
          })),
        };

        const response = await fetch(
          `${FERRETERIA_API_URL}/ferreterias/cotizar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const texto = await response.text();
          console.error("Error ferreteria-service:", texto);
          throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        setCotizaciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cotizando en ferreterías:", error);
        setCotizaciones([]);
        setError(
          "No se pudo conectar con ferreteria-service. Revisa que el servicio esté disponible."
        );
      } finally {
        setLoading(false);
      }
    };

    cotizarEnFerreterias();
  }, [materiales, totalBase]);

  const codificarCarrito = (cotizacion) => {
    const carrito = {
      codigoFerreteria: cotizacion.codigoFerreteria,
      nombreFerreteria: obtenerNombreComercial(cotizacion),
      comuna: cotizacion.comuna,
      direccion: cotizacion.direccion,
      costoDespacho: Number(cotizacion.costoDespacho || 0),
      totalProductos: calcularTotalProductosComercial(cotizacion),
      totalCotizacion: calcularTotalCotizacionComercial(cotizacion),
      productos: Array.isArray(cotizacion.detalle)
        ? cotizacion.detalle.map((item) => {
            const { cantidadRecomendada, unidad } =
              obtenerCantidadComercial(item);

            return {
              nombre: item.productoEncontrado || item.materialSolicitado,
              material: item.materialSolicitado,
              cantidad: cantidadRecomendada,
              unidadVenta: unidad,
              precioUnitario: Number(item.precioUnitario || 0),
              precio: Number(item.precioUnitario || 0),
              subtotal: calcularSubtotalComercial(item),
              stockSuficiente: item.stockSuficiente,
            };
          })
        : [],
    };

    return encodeURIComponent(
      btoa(unescape(encodeURIComponent(JSON.stringify(carrito))))
    );
  };

  const handlePago = (cotizacion) => {
    const nombreComercial = obtenerNombreComercial(cotizacion);
    setSeleccionada(nombreComercial);

    const urlFerreteria = obtenerUrlFerreteria(cotizacion);

    if (!urlFerreteria) {
      alert(`Falta configurar la URL de la ferretería para ${nombreComercial}.`);
      return;
    }

    const carritoCodificado = codificarCarrito(cotizacion);
    const urlLimpia = urlFerreteria.replace(/\/$/, "");

    window.location.href = `${urlLimpia}/?items=${carritoCodificado}`;
  };

  if (!materiales.length || totalBase <= 0) {
    return null;
  }

  return (
    <div className="comparador-section">
      <h3>Comparar cotizaciones en ferreterías</h3>

      <p>
        <strong>Comuna de destino:</strong> Maipú
      </p>

      <p>
        <strong>Total base del presupuesto técnico:</strong>{" "}
        {formatCLP(totalBase)}
      </p>

      {loading && <p>Cargando cotizaciones desde ferreteria-service...</p>}

      {error && <div className="alert-error">{error}</div>}

      {!loading && !error && cotizaciones.length === 0 && (
        <p>No hay cotizaciones disponibles para estos materiales.</p>
      )}

      {!loading && !error && cotizaciones.length > 0 && (
        <div className="cotizaciones-grid">
          {cotizaciones.map((cotizacion) => {
            const nombreComercial = obtenerNombreComercial(cotizacion);
            const totalProductosComercial =
              calcularTotalProductosComercial(cotizacion);
            const totalCotizacionComercial =
              calcularTotalCotizacionComercial(cotizacion);
            const cantidadProductos = Array.isArray(cotizacion.detalle)
              ? cotizacion.detalle.length
              : 0;

            return (
              <div
                key={cotizacion.codigoFerreteria}
                className={`cotizacion-card ${
                  cotizacion.masConveniente ? "mas-economica" : ""
                }`}
              >
                {cotizacion.masConveniente && (
                  <div className="badge-economica">Más conveniente</div>
                )}

                <h4 style={{ marginTop: 0 }}>{nombreComercial}</h4>

                <p>
                  <strong>Ubicación:</strong>{" "}
                  {cotizacion.comuna || "No informada"}
                </p>

                <p>
                  <strong>Dirección:</strong>{" "}
                  {cotizacion.direccion || "No informada"}
                </p>

                <p>
                  <strong>Productos cotizados:</strong> {cantidadProductos}
                </p>

                <p>
                  <strong>Total productos:</strong>{" "}
                  {formatCLP(totalProductosComercial)}
                </p>

                <p>
                  <strong>Despacho:</strong>{" "}
                  {formatCLP(cotizacion.costoDespacho)}
                </p>

                <p>
                  <strong>Total final:</strong>{" "}
                  {formatCLP(totalCotizacionComercial)}
                </p>

                <div style={{ marginTop: "18px" }}>
                  <button type="button" onClick={() => handlePago(cotizacion)}>
                    Ir al carrito
                  </button>
                </div>

                {seleccionada === nombreComercial && (
                  <p>Redirigiendo a: {nombreComercial}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}