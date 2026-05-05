package cl.construfacil.calculo.service;

import cl.construfacil.calculo.dto.CalculoObraResponse;
import cl.construfacil.calculo.dto.DetalleCalculoResponse;
import cl.construfacil.calculo.dto.PresupuestoGuardadoResponse;
import cl.construfacil.calculo.repository.CalculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CalculoService {

    private final CalculoRepository calculoRepository;
    private final RestTemplate restTemplate;

    public CalculoService(CalculoRepository calculoRepository, RestTemplate restTemplate) {
        this.calculoRepository = calculoRepository;
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> obtenerObraDesdeServicio(Integer id) {
        String url = "http://localhost:8082/api/obras/" + id;
        Map<String, Object> obra = restTemplate.getForObject(url, Map.class);

        System.out.println("🔥 Obra recibida desde obras-service: " + obra);

        return obra != null ? obra : new HashMap<>();
    }

    public CalculoObraResponse calcularObra(Integer idObra) {
        Map<String, Object> obraServicio = obtenerObraDesdeServicio(idObra);

        List<Map<String, Object>> medidasDb = calculoRepository.obtenerMedidas(idObra);
        List<Map<String, Object>> reglas = calculoRepository.obtenerReglas(idObra);

        String tipoObra = (String) obraServicio.getOrDefault("tipo", "Desconocido");

        Map<String, Double> medidas = construirMapaMedidas(medidasDb);

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

            double cantidad = calcularCantidad(tipoObra, unidadCalculo, largo, ancho, espesor, alto, factor);
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

    public PresupuestoGuardadoResponse guardarPresupuesto(Integer idObra) {
        Map<String, Object> obra = calculoRepository.obtenerObra(idObra);
        List<Map<String, Object>> medidasDb = calculoRepository.obtenerMedidas(idObra);
        List<Map<String, Object>> reglas = calculoRepository.obtenerReglas(idObra);

        String tipoObra = (String) obra.get("nombre_tipo_obra");
        Map<String, Double> medidas = construirMapaMedidas(medidasDb);

        double largo = medidas.getOrDefault("largo", 0.0);
        double ancho = medidas.getOrDefault("ancho", 0.0);
        double espesor = medidas.getOrDefault("espesor", 0.0);
        double alto = medidas.getOrDefault("alto", 0.0);

        List<DetalleCalculoResponse> detalle = new ArrayList<>();
        double total = 0;

        List<Map<String, Object>> filasParaGuardar = new ArrayList<>();

        for (Map<String, Object> regla : reglas) {
            Integer idMaterial = ((Number) regla.get("id_material")).intValue();
            String material = (String) regla.get("nombre_material");
            String unidadCalculo = (String) regla.get("unidad_calculo");
            double factor = ((Number) regla.get("factor_calculo")).doubleValue();
            double precio = ((Number) regla.get("precio_referencial")).doubleValue();

            double cantidad = calcularCantidad(tipoObra, unidadCalculo, largo, ancho, espesor, alto, factor);
            double subtotal = cantidad * precio;
            total += subtotal;

            filasParaGuardar.add(Map.of(
                    "idMaterial", idMaterial,
                    "cantidad", redondear(cantidad),
                    "subtotal", redondear(subtotal)
            ));

            detalle.add(new DetalleCalculoResponse(
                    material,
                    redondear(cantidad),
                    redondear(precio),
                    redondear(subtotal)
            ));
        }

        double totalRedondeado = redondear(total);
        Integer idPresupuesto = calculoRepository.insertarPresupuesto(idObra, totalRedondeado);

        for (Map<String, Object> fila : filasParaGuardar) {
            calculoRepository.insertarDetallePresupuesto(
                    idPresupuesto,
                    (Integer) fila.get("idMaterial"),
                    (Double) fila.get("cantidad"),
                    (Double) fila.get("subtotal")
            );
        }

        return new PresupuestoGuardadoResponse(
                idPresupuesto,
                idObra,
                tipoObra,
                detalle,
                totalRedondeado
        );
    }

    public PresupuestoGuardadoResponse obtenerPresupuesto(Integer idPresupuesto) {
        Map<String, Object> cabecera = calculoRepository.obtenerPresupuestoCabecera(idPresupuesto);
        List<Map<String, Object>> detalleDb = calculoRepository.obtenerDetallePresupuesto(idPresupuesto);

        List<DetalleCalculoResponse> detalle = new ArrayList<>();

        for (Map<String, Object> fila : detalleDb) {
            String material = (String) fila.get("nombre_material");
            double cantidad = ((Number) fila.get("cantidad_material")).doubleValue();
            double precio = ((Number) fila.get("precio_referencial")).doubleValue();
            double subtotal = ((Number) fila.get("subtotal_material")).doubleValue();

            detalle.add(new DetalleCalculoResponse(
                    material,
                    redondear(cantidad),
                    redondear(precio),
                    redondear(subtotal)
            ));
        }

        return new PresupuestoGuardadoResponse(
                ((Number) cabecera.get("id_presupuesto")).intValue(),
                ((Number) cabecera.get("id_obra")).intValue(),
                (String) cabecera.get("nombre_tipo_obra"),
                detalle,
                redondear(((Number) cabecera.get("total_presupuesto")).doubleValue())
        );
    }

    private Map<String, Double> construirMapaMedidas(List<Map<String, Object>> medidasDb) {
        Map<String, Double> medidas = new HashMap<>();

        for (Map<String, Object> fila : medidasDb) {
            String nombre = ((String) fila.get("nombre_tipo_medida")).toLowerCase();
            Double valor = ((Number) fila.get("valor_medida")).doubleValue();
            medidas.put(nombre, valor);
        }

        return medidas;
    }

    private double calcularCantidad(String tipoObra, String unidadCalculo,
                                    double largo, double ancho, double espesor,
                                    double alto, double factor) {

        if ("m3".equalsIgnoreCase(unidadCalculo)) {
            return largo * ancho * espesor * factor;
        }

        if ("m2".equalsIgnoreCase(unidadCalculo)) {
            if ("Tabique".equalsIgnoreCase(tipoObra)) {
                return alto * ancho * factor;
            }
            return largo * ancho * factor;
        }

        if ("ml".equalsIgnoreCase(unidadCalculo)) {
            return largo * factor;
        }

        return 0;
    }

    private double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}