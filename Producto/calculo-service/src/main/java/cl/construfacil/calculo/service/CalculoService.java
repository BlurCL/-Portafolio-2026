package cl.construfacil.calculo.service;

import cl.construfacil.calculo.dto.CalculoObraResponse;
import cl.construfacil.calculo.dto.DetalleCalculoResponse;
import cl.construfacil.calculo.dto.PresupuestoGuardadoResponse;
import cl.construfacil.calculo.dto.PresupuestoResumenResponse;
import cl.construfacil.calculo.repository.CalculoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CalculoService {

    private final CalculoRepository calculoRepository;
    private final RestTemplate restTemplate;

    @Value("${obras.service.url:http://localhost:8082}")
    private String obrasServiceUrl;

    public CalculoService(CalculoRepository calculoRepository, RestTemplate restTemplate) {
        this.calculoRepository = calculoRepository;
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> obtenerObraDesdeServicio(Integer id) {
        String url = obrasServiceUrl + "/api/obras/" + id;
        Map<String, Object> obra = restTemplate.getForObject(url, Map.class);
        
        System.out.println("🔥 URL obras-service usada: " + url);
        System.out.println("🔥 Obra recibida desde obras-service: " + obra);
        
        return obra != null ? obra : new HashMap<>();
    }

    public CalculoObraResponse calcularObra(Integer idObra) {
        Map<String, Object> obraServicio = obtenerObraDesdeServicio(idObra);

        String tipoObra = obtenerTipoObra(obraServicio);
        Map<String, Double> medidas = obtenerMedidasDesdeObraService(obraServicio);

        List<Map<String, Object>> reglas = calculoRepository.obtenerReglasPorTipoObra(tipoObra);

        double largo = medidas.getOrDefault("largo", 0.0);
        double ancho = medidas.getOrDefault("ancho", 0.0);
        double espesor = medidas.getOrDefault("espesor", medidas.getOrDefault("alto", 0.0));
        double alto = medidas.getOrDefault("alto", 0.0);

        List<DetalleCalculoResponse> detalle = new ArrayList<>();
        double total = 0;

        for (Map<String, Object> regla : reglas) {
            String material = (String) regla.get("nombre_material");
            String unidadCalculo = (String) regla.get("unidad_calculo");
            double factor = ((Number) regla.get("factor_calculo")).doubleValue();
            double precio = ((Number) regla.get("precio_referencial")).doubleValue();

            double cantidad = calcularCantidad(
                    tipoObra,
                    material,
                    unidadCalculo,
                    largo,
                    ancho,
                    espesor,
                    alto,
                    factor
            );

            double subtotal = cantidad * precio;
            total += subtotal;

            detalle.add(new DetalleCalculoResponse(
                    material,
                    cantidad, // La cantidad ya viene redondeada por la logica de negocio
                    redondear(precio),
                    redondear(subtotal)
            ));
        }

        return new CalculoObraResponse(idObra, tipoObra, detalle, redondear(total));
    }

    public PresupuestoGuardadoResponse guardarPresupuesto(Integer idObra) {
        Map<String, Object> obraServicio = obtenerObraDesdeServicio(idObra);

        String tipoObra = obtenerTipoObra(obraServicio);
        Map<String, Double> medidas = obtenerMedidasDesdeObraService(obraServicio);

        List<Map<String, Object>> reglas = calculoRepository.obtenerReglasPorTipoObra(tipoObra);

        double largo = medidas.getOrDefault("largo", 0.0);
        double ancho = medidas.getOrDefault("ancho", 0.0);
        double espesor = medidas.getOrDefault("espesor", medidas.getOrDefault("alto", 0.0));
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

            double cantidad = calcularCantidad(
                    tipoObra,
                    material,
                    unidadCalculo,
                    largo,
                    ancho,
                    espesor,
                    alto,
                    factor
            );

            double subtotal = cantidad * precio;
            total += subtotal;

            filasParaGuardar.add(Map.of(
                    "idMaterial", idMaterial,
                    "cantidad", cantidad, // Redondeado constructivamente
                    "subtotal", redondear(subtotal)
            ));

            detalle.add(new DetalleCalculoResponse(
                    material,
                    cantidad,
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
                    cantidad,
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

    public List<PresupuestoResumenResponse> listarPresupuestos() {
        return mapearListaPresupuestos(calculoRepository.listarPresupuestos());
    }

    public List<PresupuestoResumenResponse> listarPresupuestosPorCliente(Integer idCliente) {
        return mapearListaPresupuestos(calculoRepository.listarPresupuestosPorCliente(idCliente));
    }

    public List<PresupuestoResumenResponse> listarPresupuestosPorUsuario(Integer idUsuario) {
        return mapearListaPresupuestos(calculoRepository.listarPresupuestosPorUsuario(idUsuario));
    }

    // Método auxiliar para evitar código duplicado en las listas
    private List<PresupuestoResumenResponse> mapearListaPresupuestos(List<Map<String, Object>> filas) {
        List<PresupuestoResumenResponse> presupuestos = new ArrayList<>();
        for (Map<String, Object> fila : filas) {
            Date fechaSql = (Date) fila.get("fecha_creacion");
            presupuestos.add(new PresupuestoResumenResponse(
                    ((Number) fila.get("id_presupuesto")).intValue(),
                    ((Number) fila.get("id_obra")).intValue(),
                    (String) fila.get("nombre_obra"),
                    (String) fila.get("nombre_tipo_obra"),
                    fechaSql != null ? fechaSql.toLocalDate() : null,
                    redondear(((Number) fila.get("total_presupuesto")).doubleValue())
            ));
        }
        return presupuestos;
    }

    private String obtenerTipoObra(Map<String, Object> obraServicio) {
        Object tipo = obraServicio.get("tipo");
        if (tipo == null || tipo.toString().trim().isEmpty()) {
            throw new RuntimeException("La obra recibida desde obras-service no tiene tipo.");
        }
        return tipo.toString();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Double> obtenerMedidasDesdeObraService(Map<String, Object> obraServicio) {
        Object medidasObj = obraServicio.get("medidas");
        if (!(medidasObj instanceof Map)) {
            throw new RuntimeException("La obra recibida desde obras-service no tiene medidas válidas.");
        }

        Map<String, Object> medidasOriginales = (Map<String, Object>) medidasObj;
        Map<String, Double> medidas = new HashMap<>();

        for (Map.Entry<String, Object> entry : medidasOriginales.entrySet()) {
            if (entry.getValue() != null) {
                medidas.put(entry.getKey().toLowerCase(), convertirADouble(entry.getValue()));
            }
        }
        return medidas;
    }

    // --- CORAZÓN MATEMÁTICO REFACTORIZADO ---
    private double calcularCantidad(
            String tipoObra,
            String material,
            String unidadCalculo,
            double largo,
            double ancho,
            double espesor,
            double alto,
            double factor
    ) {
        // 1. Calcular la Superficie Base de la obra (m2)
        double superficie = 0.0;
        if (tipoObra != null && tipoObra.toLowerCase().contains("tabique")) {
            superficie = largo * alto; // El tabique es vertical
        } else {
            superficie = largo * ancho; // Radier y Techumbre son horizontales
        }

        if (superficie <= 0) return 0.0;

        String mat = material != null ? material.toLowerCase() : "";
        String uni = unidadCalculo != null ? unidadCalculo.toLowerCase() : "";

        // 2. Regla especial Malla ACMA (Aprox 13 m2 de cobertura por malla)
        if (mat.contains("malla")) {
            return Math.ceil(superficie / 13.0);
        }

        // 3. Materiales Volumétricos a granel (m3) - Radier / Hormigón
        if (uni.equals("m3") || uni.equals("metro cubico")) {
            double volumen = superficie * (espesor > 0 ? espesor : 1.0);
            return redondear(volumen * factor); // Permite despachar decimales (Ej: 0.5 m3 de arena)
        }

        // 4. Materiales por peso o fraccionables (kg, litros)
        if (uni.equals("kg") || uni.equals("kilo") || uni.equals("lt") || uni.equals("litro")) {
            return redondear(superficie * factor); // Permite vender 2.5 kg de clavos
        }

        // 5. Unidades Comerciales Indivisibles (Cajas, Planchas, Tiras de Metalcon, Sacos, Unidades)
        double cantidadCalculada = superficie * factor;

        // SIEMPRE redondeamos hacia arriba porque no se vende "media plancha" ni "medio montante"
        return Math.ceil(cantidadCalculada);
    }

    private double convertirADouble(Object valor) {
        if (valor == null) return 0.0;
        try {
            return Double.parseDouble(valor.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}