package cl.construfacil.ferreteria.controller;

import cl.construfacil.ferreteria.dto.CotizacionFerreteriaResponse;
import cl.construfacil.ferreteria.dto.CotizacionRequest;
import cl.construfacil.ferreteria.dto.FerreteriaResponse;
import cl.construfacil.ferreteria.dto.ProductoFerreteriaResponse;
import cl.construfacil.ferreteria.service.FerreteriaService;
import org.springframework.web.bind.annotation.*;

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

    
}