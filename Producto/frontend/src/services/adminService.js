const FERRETERIA_API_URL =
  import.meta.env.VITE_FERRETERIA_API_URL || "http://localhost:8083/api";

export const adminService = {
  async listarFerreterias() {
    const response = await fetch(`${FERRETERIA_API_URL}/admin/ferreterias`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las ferreterías.");
    }

    return response.json();
  },

  async crearFerreteria(data) {
    const response = await fetch(`${FERRETERIA_API_URL}/admin/ferreterias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear la ferretería.");
    }

    return response.json();
  },

  async cambiarEstadoFerreteria(idFerreteria, activa) {
    const response = await fetch(
      `${FERRETERIA_API_URL}/admin/ferreterias/${idFerreteria}/estado?activa=${activa}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo actualizar el estado de la ferretería.");
    }

    return response.json();
  },
};