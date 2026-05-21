package com.users.Usuario_service.auth;

public class AuthResponse {

    private String token;
    private Integer idUsuario;
    private Integer idCliente;
    private String nombreUsuario;
    private String correo;
    private String rol;

    public AuthResponse(
            String token,
            Integer idUsuario,
            Integer idCliente,
            String nombreUsuario,
            String correo,
            String rol
    ) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.idCliente = idCliente;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.rol = rol;
    }

    public String getToken() {
        return token;
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
}