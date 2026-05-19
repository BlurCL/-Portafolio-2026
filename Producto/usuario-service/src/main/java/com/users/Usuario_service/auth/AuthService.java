package com.users.Usuario_service.auth;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.users.Usuario_service.model.Usuario;
import com.users.Usuario_service.repository.UsuarioRepository;
import com.users.Usuario_service.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public Map<String, String> register(RegisterRequest request) {

        if (!request.getPassword().equals(request.getConfirmarPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        if (repository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con ese correo");
        }

        Usuario usuario = new Usuario();

        /*
         * IMPORTANTE:
         * La tabla usuarios real tiene:
         * id_usuario, id_cliente, nombre_usuario, correo,
         * password_hash, rol, activo, fecha_creacion.
         *
         * Los datos como rut, teléfono, dirección y comuna pertenecen
         * a la tabla clientes, no a usuarios.
         */

        usuario.setIdCliente(1); // Temporal: cliente existente de prueba
        usuario.setNombreUsuario(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol("CLIENTE");
        usuario.setActivo(true);
        usuario.setFechaCreacion(LocalDateTime.now());

        repository.save(usuario);

        String token = jwtService.generateToken(usuario);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }

    public Map<String, String> login(String correo, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correo, password)
        );

        Usuario usuario = repository.findByCorreoAndActivoTrue(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado o inactivo"));

        String token = jwtService.generateToken(usuario);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}