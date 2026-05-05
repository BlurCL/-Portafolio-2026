package cl.construfacil.backend.dto;

import java.util.List;

public class CalculoObraResponse {

    private Integer obraId;
    private String tipoObra;
    private List<DetalleCalculoResponse> detalle;
    private double total;

    public CalculoObraResponse() {
    }

    public CalculoObraResponse(Integer obraId, String tipoObra, List<DetalleCalculoResponse> detalle, double total) {
        this.obraId = obraId;
        this.tipoObra = tipoObra;
        this.detalle = detalle;
        this.total = total;
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