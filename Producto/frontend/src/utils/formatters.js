

export const formatCLP = (valor) => {
  return Number(valor || 0).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
};

export const formatFecha = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleString("es-CL");
};