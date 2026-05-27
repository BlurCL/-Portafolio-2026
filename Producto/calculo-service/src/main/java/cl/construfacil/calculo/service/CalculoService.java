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
                    redondear(cantidad),
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

    public List<PresupuestoResumenResponse> listarPresupuestos() {
        List<Map<String, Object>> filas = calculoRepository.listarPresupuestos();

        List<PresupuestoResumenResponse> presupuestos = new ArrayList<>();

        for (Map<String, Object> fila : filas) {
            Date fechaSql = (Date) fila.get("fecha_creacion");

            PresupuestoResumenResponse resumen = new PresupuestoResumenResponse(
                    ((Number) fila.get("id_presupuesto")).intValue(),
                    ((Number) fila.get("id_obra")).intValue(),
                    (String) fila.get("nombre_obra"),
                    (String) fila.get("nombre_tipo_obra"),
                    fechaSql != null ? fechaSql.toLocalDate() : null,
                    redondear(((Number) fila.get("total_presupuesto")).doubleValue())
            );

            presupuestos.add(resumen);
        }

        return presupuestos;
    }

    public List<PresupuestoResumenResponse> listarPresupuestosPorCliente(Integer idCliente) {
        List<Map<String, Object>> filas = calculoRepository.listarPresupuestosPorCliente(idCliente);

        List<PresupuestoResumenResponse> presupuestos = new ArrayList<>();

        for (Map<String, Object> fila : filas) {
            Date fechaSql = (Date) fila.get("fecha_creacion");

            PresupuestoResumenResponse resumen = new PresupuestoResumenResponse(
                    ((Number) fila.get("id_presupuesto")).intValue(),
                    ((Number) fila.get("id_obra")).intValue(),
                    (String) fila.get("nombre_obra"),
                    (String) fila.get("nombre_tipo_obra"),
                    fechaSql != null ? fechaSql.toLocalDate() : null,
                    redondear(((Number) fila.get("total_presupuesto")).doubleValue())
            );

            presupuestos.add(resumen);
        }

        return presupuestos;
    }

    public List<PresupuestoResumenResponse> listarPresupuestosPorUsuario(Integer idUsuario) {
        List<Map<String, Object>> filas = calculoRepository.listarPresupuestosPorUsuario(idUsuario);

        List<PresupuestoResumenResponse> presupuestos = new ArrayList<>();

        for (Map<String, Object> fila : filas) {
            Date fechaSql = (Date) fila.get("fecha_creacion");

            PresupuestoResumenResponse resumen = new PresupuestoResumenResponse(
                    ((Number) fila.get("id_presupuesto")).intValue(),
                    ((Number) fila.get("id_obra")).intValue(),
                    (String) fila.get("nombre_obra"),
                    (String) fila.get("nombre_tipo_obra"),
                    fechaSql != null ? fechaSql.toLocalDate() : null,
                    redondear(((Number) fila.get("total_presupuesto")).doubleValue())
            );

            presupuestos.add(resumen);
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
        /*
         * Malla ACMA:
         * Se vende por plancha/unidad.
         * Para el radier se calcula:
         * superficie obra / superficie plancha, redondeando hacia arriba.
         *
         * Plancha usada como referencia:
         * 5.0 m x 2.6 m = 13 m²
         */
        if (material != null && material.toLowerCase().contains("malla")) {
            double superficieObra = largo * ancho;

            double largoMalla = 5.0;
            double anchoMalla = 2.6;
            double superficieMalla = largoMalla * anchoMalla;

            if (superficieObra <= 0 || superficieMalla <= 0) {
                return 0;
            }

            return Math.ceil(superficieObra / superficieMalla);
        }

        /*
         * m3:
         * Principalmente Radier:
         * largo x ancho x espesor x factor
         */
        if ("m3".equalsIgnoreCase(unidadCalculo)) {
            return largo * ancho * espesor * factor;
        }

        /*
         * m2:
         * Radier/Techumbre: largo x ancho x factor
         * Tabique: largo x alto x factor
         */
        if ("m2".equalsIgnoreCase(unidadCalculo)) {
            if ("Tabique".equalsIgnoreCase(tipoObra)) {
                return largo * alto * factor;
            }

            return largo * ancho * factor;
        }

        /*
         * ml:
         * Por ahora se calcula con largo x factor.
         * Esto aplica, por ejemplo, para costaneras de techumbre.
         */
        if ("ml".equalsIgnoreCase(unidadCalculo)) {
            return largo * factor;
        }

        /*
         * unidad:
         * Se usa el factor como cantidad base.
         */
        if ("unidad".equalsIgnoreCase(unidadCalculo) || "un".equalsIgnoreCase(unidadCalculo)) {
            return factor;
        }

        return 0;
    }

    private double convertirADouble(Object valor) {
        if (valor == null) {
            return 0.0;
        }

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