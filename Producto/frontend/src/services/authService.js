const USUARIO_API_URL = import.meta.env.VITE_USUARIO_API_URL || "http://localhost:8084/api";

export const authService = {
  async login(email, password) {
    const response = await fetch(`${USUARIO_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: email, password: password }),
    });
    if (!response.ok) throw new Error("Correo o contraseña incorrectos.");
    return response.json();
  },

  async register(nombre, email, password, confirm) {
    const response = await fetch(`${USUARIO_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo: email, password, confirmarPassword: confirm }),
    });
    if (!response.ok) {
      let mensajeError = "No se pudo registrar el usuario.";
      try {
        const errorData = await response.json();
        mensajeError = errorData.error || mensajeError;
      } catch (e) {}
      throw new Error(mensajeError);
    }
    return response.json();
  }
};