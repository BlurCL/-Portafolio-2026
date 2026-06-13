import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("initial");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const correo = localStorage.getItem("correo");
    if (token && correo) {
      setUser({
        idUsuario: localStorage.getItem("idUsuario"),
        idCliente: localStorage.getItem("idCliente"),
        nombre: localStorage.getItem("nombreUsuario"),
        correo: correo,
        rol: localStorage.getItem("rol"),
        token: token,
      });
      setAuthView("dashboard");
    }
  }, []);

  const handleLogin = (loginData) => {
    setUser({ ...loginData });
    setAuthView("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAuthView("initial");
  };

  return { user, authView, setAuthView, handleLogin, handleLogout };
}