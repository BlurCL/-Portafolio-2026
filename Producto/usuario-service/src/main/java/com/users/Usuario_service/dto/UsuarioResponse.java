package com.users.Usuario_service.dto;

import java.time.LocalDateTime;

public class UsuarioResponse {

    private Integer idUsuario;
    private Integer idCliente;
    private String nombreUsuario;
    private String correo;
    private String rol;
    private Boolean activo;
    private LocalDateTime fechaCreacion;

    public UsuarioResponse(
            Integer idUsuario,
            Integer idCliente,
            String nombreUsuario,
            String correo,
            String rol,
            Boolean activo,
            LocalDateTime fechaCreacion
    ) {
        this.idUsuario = idUsuario;
        this.idCliente = idCliente;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.rol = rol;
        this.activo = activo;
        this.fechaCreacion = fechaCreacion;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public String getRol() {
        return rol;
    }

    public Boolean getActivo() {
        return activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
}