package cl.construfacil.calculo.dto;

import java.util.List;

public class PresupuestoGuardadoResponse {

    private Integer idPresupuesto;
    private Integer obraId;
    private String tipoObra;
    private List<DetalleCalculoResponse> detalle;
    private double total;

    public PresupuestoGuardadoResponse() {
    }

    public PresupuestoGuardadoResponse(Integer idPresupuesto, Integer obraId, String tipoObra,
                                       List<DetalleCalculoResponse> detalle, double total) {
        this.idPresupuesto = idPresupuesto;
        this.obraId = obraId;
        this.tipoObra = tipoObra;
        this.detalle = detalle;
        this.total = total;
    }

    public Integer getIdPresupuesto() {
        return idPresupuesto;
    }

    public void setIdPresupuesto(Integer idPresupuesto) {
        this.idPresupuesto = idPresupuesto;
    }

    public Integer getObraId() {
        return obraId;
    }

    public void setObraId(Integer obraId) {
        this.obraId = obraId;
    }

    public String getTipoObra() {
        return tipoObra;
    }

    public void setTipoObra(String tipoObra) {
        this.tipoObra = tipoObra;
    }

    public List<DetalleCalculoResponse> getDetalle() {
        return detalle;
    }

    public void setDetalle(List<DetalleCalculoResponse> detalle) {
        this.detalle = detalle;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}