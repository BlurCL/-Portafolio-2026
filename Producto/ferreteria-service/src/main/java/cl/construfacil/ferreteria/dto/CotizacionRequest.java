package cl.construfacil.ferreteria.dto;

import java.util.List;

public class CotizacionRequest {

    private String comunaDestino;
    private List<MaterialCotizacionRequest> materiales;

    public CotizacionRequest() {
    }

    public CotizacionRequest(String comunaDestino, List<MaterialCotizacionRequest> materiales) {
        this.comunaDestino = comunaDestino;
        this.materiales = materiales;
    }

    public String getComunaDestino() {
        return comunaDestino;
    }

    public void setComunaDestino(String comunaDestino) {
        this.comunaDestino = comunaDestino;
    }

    public List<MaterialCotizacionRequest> getMateriales() {
        return materiales;
    }

    public void setMateriales(List<MaterialCotizacionRequest> materiales) {
        this.materiales = materiales;
    }
}