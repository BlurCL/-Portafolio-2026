package cl.construfacil.obras.dto;

import java.util.Map;

public class ObraResponse {

    private Integer id;
    private String tipo;
    private Map<String, Object> medidas;

    public ObraResponse(Integer id, String tipo, Map<String, Object> medidas) {
        this.id = id;
        this.tipo = tipo;
        this.medidas = medidas;
    }

    public Integer getId() {
        return id;
    }

    public String getTipo() {
        return tipo;
    }

    public Map<String, Object> getMedidas() {
        return medidas;
    }
}