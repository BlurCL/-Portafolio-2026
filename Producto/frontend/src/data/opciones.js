export const tiposObra = [
  "Radier",
  "Tabiquería",
  "Techumbre"
];

export const opcionesPorTipo = {
  "Radier": [
    "Radier simple",
    "Radier armado",
    "Radier con malla ACMA"
  ],
  "Tabiquería": [
    "Tabique madera",
    "Tabique metalcon",
    "Tabique con yeso cartón"
  ],
  "Techumbre": [
    "1 agua",
    "2 aguas",
    "Techumbre metálica"
  ]
};

export const datosConstruccion = {
  "Radier": {
    "Radier simple": {
      materiales: [
        { nombre: "Cemento (sacos)", rendimiento: 0.25, precio: 5000 },
        { nombre: "Arena (m3)", rendimiento: 0.45, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.45, precio: 18000 }
      ]
    },

    "Radier armado": {
      materiales: [
        { nombre: "Cemento (sacos)", rendimiento: 0.3, precio: 5000 },
        { nombre: "Arena (m3)", rendimiento: 0.5, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.5, precio: 18000 },
        { nombre: "Malla ACMA (m2)", rendimiento: 1, precio: 25000 }
      ]
    },

    "Radier con malla ACMA": {
      materiales: [
        { nombre: "Cemento (sacos)", rendimiento: 0.28, precio: 5000 },
        { nombre: "Arena (m3)", rendimiento: 0.48, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.48, precio: 18000 },
        { nombre: "Malla ACMA (m2)", rendimiento: 1.2, precio: 25000 }
      ]
    }
  },

  "Tabiquería": {
    "Tabique madera": {
      materiales: [
        { nombre: "Madera (listones)", rendimiento: 1.8, precio: 3000 },
        { nombre: "Clavos (kg)", rendimiento: 0.08, precio: 2500 },
        { nombre: "Plancha OSB (m2)", rendimiento: 1.2, precio: 15000 }
      ]
    },

    "Tabique metalcon": {
      materiales: [
        { nombre: "Perfil metalcon (m)", rendimiento: 1.8, precio: 4000 },
        { nombre: "Tornillos (unidades)", rendimiento: 15, precio: 3000 },
        { nombre: "Yeso cartón (m2)", rendimiento: 1.8, precio: 8000 }
      ]
    },

    "Tabique con yeso cartón": {
      materiales: [
        { nombre: "Perfil metálico (m)", rendimiento: 2.2, precio: 3500 },
        { nombre: "Tornillos (unidades)", rendimiento: 20, precio: 3000 },
        { nombre: "Yeso cartón (m2)", rendimiento: 2.4, precio: 8000 },
        { nombre: "Masilla (kg)", rendimiento: 0.15, precio: 4000 }
      ]
    }
  },

  "Techumbre": {
    "1 agua": {
      materiales: [
        { nombre: "Cerchas (unidades)", rendimiento: 0.8, precio: 35000 },
        { nombre: "Zinc (m2)", rendimiento: 1.1, precio: 12000 },
        { nombre: "Clavos (kg)", rendimiento: 0.06, precio: 2500 }
      ]
    },

    "2 aguas": {
      materiales: [
        { nombre: "Cerchas (unidades)", rendimiento: 1.2, precio: 35000 },
        { nombre: "Zinc (m2)", rendimiento: 1.3, precio: 12000 },
        { nombre: "Clavos (kg)", rendimiento: 0.08, precio: 2500 }
      ]
    },

    "Techumbre metálica": {
      materiales: [
        { nombre: "Perfiles metálicos (m)", rendimiento: 1.8, precio: 6000 },
        { nombre: "Planchas metálicas (m2)", rendimiento: 1.1, precio: 15000 },
        { nombre: "Tornillos (unidades)", rendimiento: 18, precio: 3000 }
      ]
    }
  }
};