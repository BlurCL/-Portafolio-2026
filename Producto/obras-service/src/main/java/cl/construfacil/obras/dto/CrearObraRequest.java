package cl.construfacil.obras.dto;

import java.util.Map;

public class CrearObraRequest {

    private String nombre;
    private String tipo;
    private String subtipo;
    private Map<String, Object> medidas;

    public CrearObraRequest() {
    }

    public CrearObraRequest(String nombre, String tipo, String subtipo, Map<String, Object> medidas) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.subtipo = subtipo;
        this.medidas = medidas;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getSubtipo() {
        return subtipo;
    }

    public void setSubtipo(String subtipo) {
        this.subtipo = subtipo;
    }

    public Map<String, Object> getMedidas() {
        return medidas;
    }

    public void setMedidas(Map<String, Object> medidas) {
        this.medidas = medidas;
    }
}