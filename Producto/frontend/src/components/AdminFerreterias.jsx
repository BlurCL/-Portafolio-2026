import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";

export default function AdminFerreterias({ user }) {
  const [ferreterias, setFerreterias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guardandoId, setGuardandoId] = useState(null);
  const [error, setError] = useState("");

  const esAdmin = String(user?.rol || "").toUpperCase() === "ADMIN";

  const cargarFerreterias = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminService.listarFerreterias();
      setFerreterias(data);
    } catch (err) {
      setError(err.message || "Error al cargar ferreterías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (esAdmin) {
      cargarFerreterias();
    }
  }, [esAdmin]);