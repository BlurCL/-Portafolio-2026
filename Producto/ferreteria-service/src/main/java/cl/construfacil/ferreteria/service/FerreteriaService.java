package cl.construfacil.ferreteria.service;

import cl.construfacil.ferreteria.dto.FerreteriaResponse;
import cl.construfacil.ferreteria.dto.ProductoFerreteriaResponse;
import cl.construfacil.ferreteria.model.Ferreteria;
import cl.construfacil.ferreteria.model.ProductoFerreteria;
import cl.construfacil.ferreteria.repository.FerreteriaRepository;
import cl.construfacil.ferreteria.repository.ProductoFerreteriaRepository;
import org.springframework.stereotype.Service;

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

    public List<FerreteriaResponse> listarFerreterias() {
        return ferreteriaRepository.findByActivaTrueOrderByIdFerreteriaAsc()
                .stream()
                .map(this::mapearFerreteria)
                .toList();
    }

    public List<ProductoFerreteriaResponse> listarMateriales() {
        return productoFerreteriaRepository.findByActivoTrueOrderByIdProductoAsc()
                .stream()
                .map(this::mapearProducto)
                .toList();
    }

    public ProductoFerreteriaResponse obtenerMaterialPorId(Integer idProducto) {
        ProductoFerreteria producto = productoFerreteriaRepository.findById(idProducto)
                .filter(p -> Boolean.TRUE.equals(p.getActivo()))
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + idProducto));

        return mapearProducto(producto);
    }

    public List<ProductoFerreteriaResponse> listarProductosPorFerreteria(String codigoFerreteria) {
        return productoFerreteriaRepository
                .findByFerreteria_CodigoFerreteriaAndActivoTrueOrderByIdProductoAsc(codigoFerreteria)
                .stream()
                .map(this::mapearProducto)
                .toList();
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