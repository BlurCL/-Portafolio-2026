const CALCULO_API_URL = import.meta.env.VITE_CALCULO_API_URL || "http://localhost:8081/api";
const OBRAS_API_URL = import.meta.env.VITE_OBRAS_API_URL || "http://localhost:8082/api";

const obtenerMensajeBackend = async (response) => {
  try { return (await response.text()) || "Sin detalle del backend."; } 
  catch { return "No se pudo leer el detalle del error."; }
};

export const proyectoService = {
  async obtenerHistorial(idUsuario) {
    const response = await fetch(`${CALCULO_API_URL}/calculos/presupuestos/usuario/${idUsuario}`);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    return response.json();
  },

  async obtenerDetallePresupuesto(idPresupuesto) {
    const response = await fetch(`${CALCULO_API_URL}/calculos/presupuesto/${idPresupuesto}`);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    return response.json();
  },

  async crearObra(payloadObra) {
    const response = await fetch(`${OBRAS_API_URL}/obras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadObra),
    });
    if (!response.ok) throw new Error(`Código HTTP: ${response.status}`);
    return response.json();
  },

  async calcularPresupuesto(obraId) {
    const response = await fetch(`${CALCULO_API_URL}/calculos/obra/${obraId}/guardar`, {
      method: "POST",
    });
    if (!response.ok) throw new Error(`Código HTTP: ${response.status}`);
    return response.json();
  }
};