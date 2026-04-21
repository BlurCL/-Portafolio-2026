import React from "react";
import FormularioProyecto from "./components/FormularioProyecto";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>ConstruFácil</h1>
        <p>Calcula la superficie de tu proyecto y elige el tipo de obra con más opciones disponibles.</p>
      </header>
      <main>
        <FormularioProyecto />
      </main>
    </div>
  );
}

export default App;