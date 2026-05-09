export const tiposObra = [
  "Radier",
  "Tabique",
  "Techumbre"
];

export const opcionesPorTipo = {
  Radier: [
    "Radier para patio",
    "Radier para entrada vehicular",
    "Radier con malla ACMA"
  ],

  Tabique: [
    "Tabique interior metalcon",
    "Tabique interior madera",
    "Tabique yeso cartón"
  ],

  Techumbre: [
    "Techumbre metálica",
    "Techumbre zinc",
    "Techumbre madera"
  ]
};

export const datosConstruccion = {
  Radier: {
    "Radier para patio": {
      materiales: [
        { nombre: "Cemento (sacos)", rendimiento: 0.25, precio: 5000 },
        { nombre: "Arena (m3)", rendimiento: 0.45, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.45, precio: 18000 }
      ]
    },

    "Radier para entrada vehicular": {
      materiales: [
        { nombre: "Cemento (sacos)", rendimiento: 0.3, precio: 5000 },
        { nombre: "Arena (m3)", rendimiento: 0.5, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.5, precio: 18000 },
        { nombre: "Malla ACMA (unidad)", rendimiento: 1, precio: 21430 }
      ]
    },

    "Radier con malla ACMA": {
      materiales: [
        { nombre: "Cemento (sacos)", rendimiento: 0.28, precio: 5000 },
        { nombre: "Arena (m3)", rendimiento: 0.48, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.48, precio: 18000 },
        { nombre: "Malla ACMA (unidad)", rendimiento: 1, precio: 21430 }
      ]
    }
  },

  Tabique: {
    "Tabique interior metalcon": {
      materiales: [
        { nombre: "Perfil metalcon (m)", rendimiento: 1.8, precio: 4000 },
        { nombre: "Tornillos (unidades)", rendimiento: 15, precio: 3000 },
        { nombre: "Yeso cartón (m2)", rendimiento: 1.8, precio: 8000 }
      ]
    },

    "Tabique interior madera": {
      materiales: [
        { nombre: "Madera (listones)", rendimiento: 1.8, precio: 3000 },
        { nombre: "Clavos (kg)", rendimiento: 0.08, precio: 2500 },
        { nombre: "Plancha OSB (m2)", rendimiento: 1.2, precio: 15000 }
      ]
    },

    "Tabique yeso cartón": {
      materiales: [
        { nombre: "Perfil metálico (m)", rendimiento: 2.2, precio: 3500 },
        { nombre: "Tornillos (unidades)", rendimiento: 20, precio: 3000 },
        { nombre: "Yeso cartón (m2)", rendimiento: 2.4, precio: 8000 },
        { nombre: "Masilla (kg)", rendimiento: 0.15, precio: 4000 }
      ]
    }
  },

  Techumbre: {
    "Techumbre metálica": {
      materiales: [
        { nombre: "Costanera (ml)", rendimiento: 0.8, precio: 15000 },
        { nombre: "Plancha Zinc (m2)", rendimiento: 1.1, precio: 18000 },
        { nombre: "Tornillos", rendimiento: 0.15, precio: 4500 }
      ]
    },

    "Techumbre zinc": {
      materiales: [
        { nombre: "Costanera (ml)", rendimiento: 0.8, precio: 15000 },
        { nombre: "Plancha Zinc (m2)", rendimiento: 1.1, precio: 18000 },
        { nombre: "Tornillos", rendimiento: 0.15, precio: 4500 }
      ]
    },

    "Techumbre madera": {
      materiales: [
        { nombre: "Madera estructural", rendimiento: 1.2, precio: 12000 },
        { nombre: "Plancha Zinc (m2)", rendimiento: 1.1, precio: 18000 },
        { nombre: "Tornillos", rendimiento: 0.15, precio: 4500 }
      ]
    }
  }
};