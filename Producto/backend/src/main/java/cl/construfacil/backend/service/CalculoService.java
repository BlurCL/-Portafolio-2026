package cl.construfacil.backend.service;

import cl.construfacil.backend.dto.CalculoObraResponse;
import cl.construfacil.backend.dto.DetalleCalculoResponse;
import cl.construfacil.backend.repository.CalculoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CalculoService {

    private final CalculoRepository calculoRepository;

    public CalculoService(CalculoRepository calculoRepository) {
        this.calculoRepository = calculoRepository;
    }

    public CalculoObraResponse calcularObra(Integer idObra) {
        Map<String, Object> obra = calculoRepository.obtenerObra(idObra);
        List<Map<String, Object>> medidasDb = calculoRepository.obtenerMedidas(idObra);
        List<Map<String, Object>> reglas = calculoRepository.obtenerReglas(idObra);

        String tipoObra = (String) obra.get("nombre_tipo_obra");

        Map<String, Double> medidas = new HashMap<>();
        for (Map<String, Object> fila : medidasDb) {
            String nombre = ((String) fila.get("nombre_tipo_medida")).toLowerCase();
            Double valor = ((Number) fila.get("valor_medida")).doubleValue();
            medidas.put(nombre, valor);
        }

        double largo = medidas.getOrDefault("largo", 0.0);
        double ancho = medidas.getOrDefault("ancho", 0.0);
        double espesor = medidas.getOrDefault("espesor", 0.0);
        double alto = medidas.getOrDefault("alto", 0.0);

        List<DetalleCalculoResponse> detalle = new ArrayList<>();
        double total = 0;

        for (Map<String, Object> regla : reglas) {
            String material = (String) regla.get("nombre_material");
            String unidadCalculo = (String) regla.get("unidad_calculo");
            double factor = ((Number) regla.get("factor_calculo")).doubleValue();
            double precio = ((Number) regla.get("precio_referencial")).doubleValue();

            double cantidad = 0;

            if ("m3".equalsIgnoreCase(unidadCalculo)) {
                cantidad = largo * ancho * espesor * factor;
            } else if ("m2".equalsIgnoreCase(unidadCalculo)) {
                if ("Tabique".equalsIgnoreCase(tipoObra)) {
                    cantidad = alto * ancho * factor;
                } else {
                    cantidad = largo * ancho * factor;
                }
            } else if ("ml".equalsIgnoreCase(unidadCalculo)) {
                cantidad = largo * factor;
            }

            double subtotal = cantidad * precio;
            total += subtotal;

            detalle.add(new DetalleCalculoResponse(
                    material,
                    redondear(cantidad),
                    redondear(precio),
                    redondear(subtotal)
            ));
        }

        return new CalculoObraResponse(idObra, tipoObra, detalle, redondear(total));
    }

    private double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}