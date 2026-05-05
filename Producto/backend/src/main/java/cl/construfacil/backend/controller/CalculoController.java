package cl.construfacil.backend.controller;

import cl.construfacil.backend.dto.CalculoObraResponse;
import cl.construfacil.backend.service.CalculoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculos")
@CrossOrigin(origins = "*")
public class CalculoController {

    private final CalculoService calculoService;

    public CalculoController(CalculoService calculoService) {
        this.calculoService = calculoService;
    }

    @GetMapping("/obra/{idObra}")
    public CalculoObraResponse calcularObra(@PathVariable Integer idObra) {
        return calculoService.calcularObra(idObra);
    }
}