package cl.construfacil.calculo.controller;

import cl.construfacil.calculo.dto.CalculoObraResponse;
import cl.construfacil.calculo.dto.PresupuestoGuardadoResponse;
import cl.construfacil.calculo.service.CalculoService;
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

    @PostMapping("/obra/{idObra}/guardar")
    public PresupuestoGuardadoResponse guardarPresupuesto(@PathVariable Integer idObra) {
        return calculoService.guardarPresupuesto(idObra);
    }

    @GetMapping("/presupuesto/{idPresupuesto}")
    public PresupuestoGuardadoResponse obtenerPresupuesto(@PathVariable Integer idPresupuesto) {
        return calculoService.obtenerPresupuesto(idPresupuesto);
    }
}