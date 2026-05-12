package cl.construfacil.calculo.dto;

import java.time.LocalDate;

public class PresupuestoResumenResponse {

    private Integer idPresupuesto;
    private Integer idObra;
    private String nombreObra;
    private String tipoObra;
    private LocalDate fechaCreacion;
    private Double totalPresupuesto;

    public PresupuestoResumenResponse() {
    }

    public PresupuestoResumenResponse(
            Integer idPresupuesto,
            Integer idObra,
            String nombreObra,
            String tipoObra,
            LocalDate fechaCreacion,
            Double totalPresupuesto
    ) {
        this.idPresupuesto = idPresupuesto;
        this.idObra = idObra;
        this.nombreObra = nombreObra;
        this.tipoObra = tipoObra;
        this.fechaCreacion = fechaCreacion;
        this.totalPresupuesto = totalPresupuesto;
    }

    public Integer getIdPresupuesto() {
        return idPresupuesto;
    }

    public void setIdPresupuesto(Integer idPresupuesto) {
        this.idPresupuesto = idPresupuesto;
    }

    public Integer getIdObra() {
        return idObra;
    }

    public void setIdObra(Integer idObra) {
        this.idObra = idObra;
    }

    public String getNombreObra() {
        return nombreObra;
    }

    public void setNombreObra(String nombreObra) {
        this.nombreObra = nombreObra;
    }

    public String getTipoObra() {
        return tipoObra;
    }

    public void setTipoObra(String tipoObra) {
        this.tipoObra = tipoObra;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Double getTotalPresupuesto() {
        return totalPresupuesto;
    }

    public void setTotalPresupuesto(Double totalPresupuesto) {
        this.totalPresupuesto = totalPresupuesto;
    }
}