package cl.construfacil.ferreteria.controller;

import cl.construfacil.ferreteria.dto.CotizacionFerreteriaResponse;
import cl.construfacil.ferreteria.dto.CotizacionRequest;
import cl.construfacil.ferreteria.dto.FerreteriaResponse;
import cl.construfacil.ferreteria.dto.ProductoFerreteriaResponse;
import cl.construfacil.ferreteria.service.FerreteriaService;
import org.springframework.web.bind.annotation.*;
import cl.construfacil.ferreteria.dto.CrearFerreteriaRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FerreteriaController {

    private final FerreteriaService ferreteriaService;

    public FerreteriaController(FerreteriaService ferreteriaService) {
        this.ferreteriaService = ferreteriaService;
    }

    @GetMapping("/ferreterias")
    public List<FerreteriaResponse> listarFerreterias() {
        return ferreteriaService.listarFerreterias();
    }

    @GetMapping("/admin/ferreterias")
    public List<FerreteriaResponse> listarFerreteriasAdmin() {
        return ferreteriaService.listarFerreteriasAdmin();
    }

    @PostMapping("/admin/ferreterias")
    public ResponseEntity<FerreteriaResponse> crearFerreteria(
            @RequestBody CrearFerreteriaRequest request
    ) {
        FerreteriaResponse nuevaFerreteria = ferreteriaService.crearFerreteria(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaFerreteria);
    }

    @PatchMapping("/admin/ferreterias/{idFerreteria}/estado")
    public FerreteriaResponse cambiarEstadoFerreteria(
            @PathVariable Integer idFerreteria,
            @RequestParam Boolean activa
    ) {
        return ferreteriaService.cambiarEstadoFerreteria(idFerreteria, activa);
    }

    @GetMapping("/ferreterias/{codigoFerreteria}/productos")
    public List<ProductoFerreteriaResponse> listarProductosPorFerreteria(
            @PathVariable String codigoFerreteria
    ) {
        return ferreteriaService.listarProductosPorFerreteria(codigoFerreteria);
    }

    @GetMapping("/materiales")
    public List<ProductoFerreteriaResponse> listarMateriales() {
        return ferreteriaService.listarMateriales();
    }

    @GetMapping("/materiales/{idProducto}")
    public ProductoFerreteriaResponse obtenerMaterialPorId(@PathVariable Integer idProducto) {
        return ferreteriaService.obtenerMaterialPorId(idProducto);
    }

    @PostMapping("/ferreterias/cotizar")
    public List<CotizacionFerreteriaResponse> cotizarMateriales(
            @RequestBody CotizacionRequest request
    ) {
        return ferreteriaService.cotizarMateriales(request);
    }
}