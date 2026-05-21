package cl.construfacil.obras.dto;

import java.util.Map;

public class CrearObraRequest {

    private String nombre;
    private String tipo;
    private String subtipo;
    private Map<String, Object> medidas;

    private Integer idUsuario;
    private Integer id_usuario;

    private Integer idCliente;
    private Integer id_cliente;

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

    public Integer getIdUsuario() {
        if (idUsuario != null) {
            return idUsuario;
        }

        return id_usuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Integer getIdCliente() {
        if (idCliente != null) {
            return idCliente;
        }

        return id_cliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(Integer id_cliente) {
        this.id_cliente = id_cliente;
    }
}