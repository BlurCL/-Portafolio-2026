package cl.construfacil.obras.controller;

import cl.construfacil.obras.dto.ObraResponse;
import cl.construfacil.obras.service.ObraService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/obras")
@CrossOrigin(origins = "*")
public class ObraController {

    private final ObraService obrasService;

    public ObraController(ObraService obrasService) {
        this.obrasService = obrasService;
    }

    @GetMapping
    public String test() {
        return "Obras service funcionando 🚀";
    }

    @GetMapping("/{id}")
    public ObraResponse obtenerObra(@PathVariable Integer id) {
        return obrasService.obtenerObra(id);
    }
}