package cl.construfacil.ferreteria.service;

import cl.construfacil.ferreteria.dto.CotizacionFerreteriaResponse;
import cl.construfacil.ferreteria.dto.CotizacionRequest;
import cl.construfacil.ferreteria.dto.DetalleCotizacionResponse;
import cl.construfacil.ferreteria.dto.FerreteriaResponse;
import cl.construfacil.ferreteria.dto.MaterialCotizacionRequest;
import cl.construfacil.ferreteria.dto.ProductoFerreteriaResponse;
import cl.construfacil.ferreteria.model.Ferreteria;
import cl.construfacil.ferreteria.model.ProductoFerreteria;
import cl.construfacil.ferreteria.repository.FerreteriaRepository;
import cl.construfacil.ferreteria.repository.ProductoFerreteriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class FerreteriaService {

    private final FerreteriaRepository ferreteriaRepository;
    private final ProductoFerreteriaRepository productoFerreteriaRepository;

    public FerreteriaService(
            FerreteriaRepository ferreteriaRepository,
            ProductoFerreteriaRepository productoFerreteriaRepository
    ) {
        this.ferreteriaRepository = ferreteriaRepository;
        this.productoFerreteriaRepository = productoFerreteriaRepository;
    }

    @Transactional(readOnly = true)
    public List<FerreteriaResponse> listarFerreterias() {
        return ferreteriaRepository.findByActivaTrueOrderByIdFerreteriaAsc()
                .stream()
                .map(this::mapearFerreteria)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FerreteriaResponse> listarFerreteriasAdmin() {
        return ferreteriaRepository.findAllByOrderByIdFerreteriaAsc()
                .stream()
                .map(this::mapearFerreteria)
                .toList();
    }

    @Transactional
    public FerreteriaResponse cambiarEstadoFerreteria(Integer idFerreteria, Boolean activa) {
        Ferreteria ferreteria = ferreteriaRepository.findById(idFerreteria)
                .orElseThrow(() -> new RuntimeException("Ferretería no encontrada con ID: " + idFerreteria));

        ferreteria.setActiva(Boolean.TRUE.equals(activa));
        Ferreteria actualizada = ferreteriaRepository.save(ferreteria);

        return mapearFerreteria(actualizada);
    }

    @Transactional(readOnly = true)
    public List<ProductoFerreteriaResponse> listarMateriales() {
        return productoFerreteriaRepository.findByActivoTrueOrderByIdProductoAsc()
                .stream()
                .filter(producto -> producto.getFerreteria() != null)
                .filter(producto -> Boolean.TRUE.equals(producto.getFerreteria().getActiva()))
                .map(this::mapearProducto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoFerreteriaResponse obtenerMaterialPorId(Integer idProducto) {
        ProductoFerreteria producto = productoFerreteriaRepository.findById(idProducto)
                .filter(p -> Boolean.TRUE.equals(p.getActivo()))
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + idProducto));

        return mapearProducto(producto);
    }

    @Transactional(readOnly = true)
    public List<ProductoFerreteriaResponse> listarProductosPorFerreteria(String codigoFerreteria) {
        return productoFerreteriaRepository
                .findByFerreteria_CodigoFerreteriaAndActivoTrueOrderByIdProductoAsc(codigoFerreteria)
                .stream()
                .map(this::mapearProducto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CotizacionFerreteriaResponse> cotizarMateriales(CotizacionRequest request) {
        validarCotizacion(request);

        List<Ferreteria> ferreterias = ferreteriaRepository.findByActivaTrueOrderByIdFerreteriaAsc();

        if (ferreterias.isEmpty()) {
            throw new RuntimeException("No existen ferreterías activas para cotizar.");
        }

        List<ProductoFerreteria> productosActivos = productoFerreteriaRepository
                .findByActivoTrueOrderByIdProductoAsc()
                .stream()
                .filter(producto -> producto.getFerreteria() != null)
                .filter(producto -> Boolean.TRUE.equals(producto.getFerreteria().getActiva()))
                .toList();

        List<CotizacionFerreteriaResponse> cotizaciones = new ArrayList<>();

        for (Ferreteria ferreteria : ferreterias) {
            List<ProductoFerreteria> productosFerreteria = productosActivos
                    .stream()
                    .filter(producto -> producto.getFerreteria().getIdFerreteria().equals(ferreteria.getIdFerreteria()))
                    .toList();

            CotizacionFerreteriaResponse cotizacion = construirCotizacionFerreteria(
                    ferreteria,
                    productosFerreteria,
                    request.getMateriales()
            );

            cotizaciones.add(cotizacion);
        }

        cotizaciones.sort(Comparator.comparing(CotizacionFerreteriaResponse::getTotalCotizacion));

        if (!cotizaciones.isEmpty()) {
            cotizaciones.get(0).setMasConveniente(true);
        }

        return cotizaciones;
    }

    private CotizacionFerreteriaResponse construirCotizacionFerreteria(
            Ferreteria ferreteria,
            List<ProductoFerreteria> productosFerreteria,
            List<MaterialCotizacionRequest> materialesSolicitados
    ) {
        List<DetalleCotizacionResponse> detalle = new ArrayList<>();
        BigDecimal totalProductos = BigDecimal.ZERO;

        for (MaterialCotizacionRequest materialSolicitado : materialesSolicitados) {
            ProductoFerreteria productoEncontrado = buscarProductoCompatible(
                    productosFerreteria,
                    materialSolicitado.getNombre()
            );

            BigDecimal cantidad = materialSolicitado.getCantidad() != null
                    ? materialSolicitado.getCantidad()
                    : BigDecimal.ZERO;

            if (productoEncontrado == null) {
                detalle.add(new DetalleCotizacionResponse(
                        materialSolicitado.getNombre(),
                        "No encontrado",
                        "-",
                        cantidad,
                        BigDecimal.ZERO,
                        BigDecimal.ZERO,
                        0,
                        false
                ));

                continue;
            }

            BigDecimal precioUnitario = productoEncontrado.getPrecioUnitario() != null
                    ? productoEncontrado.getPrecioUnitario()
                    : BigDecimal.ZERO;

            BigDecimal subtotal = precioUnitario.multiply(cantidad);
            totalProductos = totalProductos.add(subtotal);

            Integer stock = productoEncontrado.getStock() != null
                    ? productoEncontrado.getStock()
                    : 0;

            boolean stockSuficiente = stock >= cantidad.doubleValue();

            detalle.add(new DetalleCotizacionResponse(
                    materialSolicitado.getNombre(),
                    productoEncontrado.getNombreProducto(),
                    productoEncontrado.getUnidadVenta(),
                    cantidad,
                    precioUnitario,
                    subtotal,
                    stock,
                    stockSuficiente
            ));
        }

        BigDecimal costoDespacho = ferreteria.getCostoDespacho() != null
                ? ferreteria.getCostoDespacho()
                : BigDecimal.ZERO;

        BigDecimal totalCotizacion = totalProductos.add(costoDespacho);

        return new CotizacionFerreteriaResponse(
                ferreteria.getCodigoFerreteria(),
                ferreteria.getNombreFerreteria(),
                ferreteria.getComuna(),
                ferreteria.getDireccion(),
                costoDespacho,
                totalProductos,
                totalCotizacion,
                false,
                detalle
        );
    }

    private ProductoFerreteria buscarProductoCompatible(
            List<ProductoFerreteria> productos,
            String nombreMaterial
    ) {
        if (nombreMaterial == null || nombreMaterial.trim().isEmpty()) {
            return null;
        }

        String materialNormalizado = normalizarTexto(nombreMaterial);

        /*
         * Búsquedas prioritarias.
         * Esto evita que "Tornillo Yeso Cartón" caiga como "Plancha Yeso Cartón"
         * solo porque ambos textos contienen "yeso" y "cartón".
         */

        if (materialNormalizado.contains("tornillo")) {
            ProductoFerreteria producto = null;

            if (materialNormalizado.contains("policarbonato")) {
                producto = buscarProductoConTodasLasPalabras(
                        productos,
                        "tornillo",
                        "policarbonato"
                );
            }

            if (producto == null && materialNormalizado.contains("yeso")) {
                producto = buscarProductoConTodasLasPalabras(
                        productos,
                        "tornillo",
                        "yeso"
                );
            }

            if (producto == null && materialNormalizado.contains("techo")) {
                producto = buscarProductoConTodasLasPalabras(
                        productos,
                        "tornillo",
                        "techo"
                );
            }

            if (producto == null) {
                producto = buscarProductoConTodasLasPalabras(
                        productos,
                        "tornillo"
                );
            }

            return producto;
        }

        if (materialNormalizado.contains("clavo")) {
            return buscarProductoConTodasLasPalabras(productos, "clavo");
        }

        if (materialNormalizado.contains("cinta")) {
            return buscarProductoConTodasLasPalabras(productos, "cinta");
        }

        if (materialNormalizado.contains("fieltro")) {
            return buscarProductoConTodasLasPalabras(productos, "fieltro");
        }

        if (materialNormalizado.contains("osb")) {
            return buscarProductoConTodasLasPalabras(productos, "osb");
        }

        if (materialNormalizado.contains("teja")) {
            return buscarProductoConTodasLasPalabras(productos, "teja");
        }

        if (materialNormalizado.contains("policarbonato")) {
            return buscarProductoConTodasLasPalabras(productos, "policarbonato");
        }

        if (materialNormalizado.contains("yeso") || materialNormalizado.contains("carton")) {
            ProductoFerreteria producto = buscarProductoConTodasLasPalabras(
                    productos,
                    "plancha",
                    "yeso"
            );

            if (producto == null) {
                producto = buscarProductoConTodasLasPalabras(productos, "yeso");
            }

            return producto;
        }

        if (
                materialNormalizado.contains("metalcon") ||
                materialNormalizado.contains("canal") ||
                materialNormalizado.contains("montante") ||
                materialNormalizado.contains("perfil")
        ) {
            ProductoFerreteria producto = null;

            if (materialNormalizado.contains("omega")) {
                producto = buscarProductoConTodasLasPalabras(productos, "omega");
            }

            if (producto == null) {
                producto = buscarProductoConTodasLasPalabras(
                        productos,
                        "perfil",
                        "metalcon"
                );
            }

            if (producto == null) {
                producto = buscarProductoConTodasLasPalabras(productos, "metalcon");
            }

            return producto;
        }

        if (materialNormalizado.contains("zinc")) {
            return buscarProductoConTodasLasPalabras(productos, "zinc");
        }

        if (
                materialNormalizado.contains("pino") ||
                materialNormalizado.contains("madera") ||
                materialNormalizado.contains("costanera")
        ) {
            ProductoFerreteria producto = buscarProductoConTodasLasPalabras(productos, "pino");

            if (producto == null) {
                producto = buscarProductoConTodasLasPalabras(productos, "madera");
            }

            if (producto == null) {
                producto = buscarProductoConTodasLasPalabras(productos, "costanera");
            }

            return producto;
        }

        /*
         * Búsqueda general para materiales simples:
         * cemento, arena, grava, malla, etc.
         */
        return productos.stream()
                .filter(producto -> producto.getNombreProducto() != null)
                .filter(producto -> {
                    String productoNormalizado = normalizarTexto(producto.getNombreProducto());

                    return productoNormalizado.contains(materialNormalizado)
                            || materialNormalizado.contains(productoNormalizado)
                            || coincidePorPalabraClave(materialNormalizado, productoNormalizado);
                })
                .findFirst()
                .orElse(null);
    }

    private ProductoFerreteria buscarProductoConTodasLasPalabras(
            List<ProductoFerreteria> productos,
            String... palabras
    ) {
        for (ProductoFerreteria producto : productos) {
            if (producto.getNombreProducto() == null) {
                continue;
            }

            String productoNormalizado = normalizarTexto(producto.getNombreProducto());
            boolean coincide = true;

            for (String palabra : palabras) {
                if (!productoNormalizado.contains(normalizarTexto(palabra))) {
                    coincide = false;
                    break;
                }
            }

            if (coincide) {
                return producto;
            }
        }

        return null;
    }

    private boolean coincidePorPalabraClave(String material, String producto) {
        if (material.contains("tornillo")) {
            return producto.contains("tornillo");
        }

        if (material.contains("clavo")) {
            return producto.contains("clavo");
        }

        if (material.contains("cinta")) {
            return producto.contains("cinta");
        }

        if (material.contains("fieltro")) {
            return producto.contains("fieltro");
        }

        if (material.contains("osb")) {
            return producto.contains("osb");
        }

        if (material.contains("teja")) {
            return producto.contains("teja");
        }

        if (material.contains("policarbonato")) {
            return producto.contains("policarbonato");
        }

        if (material.contains("cemento") && producto.contains("cemento")) return true;
        if (material.contains("arena") && producto.contains("arena")) return true;
        if (material.contains("grava") && producto.contains("grava")) return true;
        if (material.contains("malla") && producto.contains("malla")) return true;
        if (material.contains("acma") && producto.contains("acma")) return true;
        if (material.contains("perfil") && producto.contains("perfil")) return true;
        if (material.contains("metalcon") && producto.contains("metalcon")) return true;
        if (material.contains("yeso") && producto.contains("yeso")) return true;
        if (material.contains("carton") && producto.contains("carton")) return true;
        if (material.contains("zinc") && producto.contains("zinc")) return true;
        if (material.contains("costanera") && producto.contains("costanera")) return true;
        if (material.contains("pino") && producto.contains("pino")) return true;
        if (material.contains("madera") && producto.contains("madera")) return true;

        return false;
    }

    private String normalizarTexto(String texto) {
        if (texto == null) {
            return "";
        }

        String normalizado = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        return normalizado
                .toLowerCase()
                .trim();
    }

    private void validarCotizacion(CotizacionRequest request) {
        if (request == null) {
            throw new RuntimeException("La solicitud de cotización no puede venir vacía.");
        }

        if (request.getMateriales() == null || request.getMateriales().isEmpty()) {
            throw new RuntimeException("Debe enviar materiales para cotizar.");
        }

        for (MaterialCotizacionRequest material : request.getMateriales()) {
            if (material.getNombre() == null || material.getNombre().trim().isEmpty()) {
                throw new RuntimeException("Todos los materiales deben tener nombre.");
            }

            if (material.getCantidad() == null || material.getCantidad().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Todos los materiales deben tener cantidad mayor a cero.");
            }
        }
    }

    private FerreteriaResponse mapearFerreteria(Ferreteria ferreteria) {
        return new FerreteriaResponse(
                ferreteria.getIdFerreteria(),
                ferreteria.getCodigoFerreteria(),
                ferreteria.getNombreFerreteria(),
                ferreteria.getComuna(),
                ferreteria.getDireccion(),
                ferreteria.getCostoDespacho(),
                ferreteria.getActiva()
        );
    }

    private ProductoFerreteriaResponse mapearProducto(ProductoFerreteria producto) {
        Ferreteria ferreteria = producto.getFerreteria();

        return new ProductoFerreteriaResponse(
                producto.getIdProducto(),
                ferreteria.getCodigoFerreteria(),
                ferreteria.getNombreFerreteria(),
                producto.getNombreProducto(),
                producto.getDescripcionProducto(),
                producto.getUnidadVenta(),
                producto.getPrecioUnitario(),
                producto.getStock(),
                producto.getActivo()
        );
    }
}