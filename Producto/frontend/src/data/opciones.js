export const tiposObra = [
  "Radier",
  "Tabique",
  "Techumbre"
];

export const opcionesPorTipo = {
  Radier: [
    "Radier Tránsito Peatonal (Patio/Interior)",
    "Radier Tránsito Vehicular (Entrada de Auto)"
  ],

  Tabique: [
    "Tabique Divisorio Metalcon (38mm) con Yeso Cartón",
    "Tabique Estructural Metalcon (60mm) con Yeso Cartón",
    "Tabique Madera (Pino 2x2) con Yeso Cartón"
  ],

  Techumbre: [
    "Techumbre Zinc (Estructura Madera)",
    "Techumbre Zinc (Estructura Metalcon)",
    "Techumbre Teja Asfáltica",
    "Techumbre Policarbonato Alveolar"
  ]
};

export const datosConstruccion = {
  Radier: {
    // Calculado para 1 m2 con espesor de 10 cm (0.1 m3)
    "Radier Tránsito Peatonal (Patio/Interior)": {
      materiales: [
        { nombre: "Cemento (Saco 25kg)", rendimiento: 0.6, precio: 5000 }, 
        { nombre: "Arena (m3)", rendimiento: 0.05, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.05, precio: 18000 },
        { nombre: "Malla ACMA C-92 (2.6x5m)", rendimiento: 0.08, precio: 15000 } // Rinde aprox 12.5 m2 traslapada
      ]
    },

    // Calculado para 1 m2 con espesor de 15 cm (0.15 m3)
    "Radier Tránsito Vehicular (Entrada de Auto)": {
      materiales: [
        { nombre: "Cemento (Saco 25kg)", rendimiento: 0.9, precio: 5000 },
        { nombre: "Arena (m3)", rendimiento: 0.08, precio: 20000 },
        { nombre: "Grava (m3)", rendimiento: 0.08, precio: 18000 },
        { nombre: "Malla ACMA C-139 (2.6x5m)", rendimiento: 0.08, precio: 22000 } 
      ]
    }
  },

  Tabique: {
    // Revestido por ambas caras. Montantes cada 40cm.
    "Tabique Divisorio Metalcon (38mm) con Yeso Cartón": {
      materiales: [
        { nombre: "Montante Metalcon 38mm (Tira 2.4m)", rendimiento: 1.2, precio: 2500 }, // Aprox 1.2 tiras por m2
        { nombre: "Canal Metalcon 40mm (Tira 3m)", rendimiento: 0.4, precio: 2800 },    // Aprox 0.4 tiras por m2
        { nombre: "Plancha Yeso Cartón 15mm (1.2x2.4m)", rendimiento: 0.7, precio: 8500 }, // Rinde 2.88 m2. Necesitamos cubrir ambas caras (2 m2 por m2 de muro)
        { nombre: "Tornillo Yeso Cartón (Caja 100un)", rendimiento: 0.25, precio: 3000 }  // Aprox 25 tornillos por m2 (por ambas caras)
      ]
    },

    // Revestido por ambas caras. Montantes cada 40cm.
    "Tabique Estructural Metalcon (60mm) con Yeso Cartón": {
      materiales: [
        { nombre: "Montante Metalcon 60mm (Tira 2.4m)", rendimiento: 1.2, precio: 3500 },
        { nombre: "Canal Metalcon 62mm (Tira 3m)", rendimiento: 0.4, precio: 3800 },
        { nombre: "Plancha Yeso Cartón 15mm (1.2x2.4m)", rendimiento: 0.7, precio: 8500 },
        { nombre: "Tornillo Yeso Cartón (Caja 100un)", rendimiento: 0.25, precio: 3000 }
      ]
    },

    // Revestido por ambas caras. Pie derecho cada 40cm.
    "Tabique Madera (Pino 2x2) con Yeso Cartón": {
      materiales: [
        { nombre: "Pino Bruto 2x2 (Listón 3.2m)", rendimiento: 1.2, precio: 1800 }, // Estructura y soleras
        { nombre: "Clavo Madera 3 (Kg)", rendimiento: 0.05, precio: 2500 },
        { nombre: "Plancha Yeso Cartón 15mm (1.2x2.4m)", rendimiento: 0.7, precio: 8500 },
        { nombre: "Tornillo Yeso Cartón (Caja 100un)", rendimiento: 0.25, precio: 3000 }
      ]
    }
  },

  Techumbre: {
    "Techumbre Zinc (Estructura Madera)": {
      materiales: [
        { nombre: "Costanera Pino Bruto 2x2 (ml)", rendimiento: 2.5, precio: 1500 }, 
        { nombre: "Plancha Zinc Acanalado 0.35mm x 3.66m", rendimiento: 0.4, precio: 18000 }, 
        { nombre: "Tornillo Techo Madera 2 1/2 (Caja 100un)", rendimiento: 0.05, precio: 4500 } 
      ]
    },

    "Techumbre Zinc (Estructura Metalcon)": {
      materiales: [
        { nombre: "Perfil Omega Metalcon 0.85mm x 6m", rendimiento: 0.42, precio: 6500 }, 
        { nombre: "Plancha Zinc Acanalado 0.35mm x 3.66m", rendimiento: 0.4, precio: 18000 }, 
        { nombre: "Tornillo Hexagonal Punta Broca (Caja 100un)", rendimiento: 0.05, precio: 5200 } 
      ]
    },

    "Techumbre Teja Asfáltica": {
      materiales: [
        { nombre: "Placa OSB Estructural 11.1mm (1.22x2.44m)", rendimiento: 0.34, precio: 15000 }, 
        { nombre: "Teja Asfáltica (Paquete rinde 3.1 m2)", rendimiento: 0.33, precio: 22000 },
        { nombre: "Clavo Techo Teja Asfáltica (Caja 1kg)", rendimiento: 0.03, precio: 3500 },
        { nombre: "Fieltro Asfáltico 15 lbs (Rollo 40m2)", rendimiento: 0.025, precio: 12000 }
      ]
    },

    "Techumbre Policarbonato Alveolar": {
      materiales: [
        { nombre: "Policarbonato Alveolar 6mm (2.10x2.90m)", rendimiento: 0.16, precio: 35000 }, 
        { nombre: "Perfil H Policarbonato (Tira 6m)", rendimiento: 0.1, precio: 8000 },
        { nombre: "Cinta Aluminio (Rollo)", rendimiento: 0.05, precio: 6000 },
        { nombre: "Tornillo Policarbonato (Bolsa 100un)", rendimiento: 0.06, precio: 7500 }
      ]
    }
  }
};