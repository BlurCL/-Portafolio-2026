package com.users.Usuario_service.auth;

import java.time.LocalDateTime;

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

    public AuthResponse register(RegisterRequest request) {

        if (request.getPassword() == null || request.getConfirmarPassword() == null) {
            throw new RuntimeException("Debe ingresar contraseña y confirmación");
        }

        if (!request.getPassword().equals(request.getConfirmarPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        if (repository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con ese correo");
        }

        Usuario usuario = new Usuario();

        usuario.setIdCliente(1); // Temporal: cliente existente de prueba
        usuario.setNombreUsuario(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol("CLIENTE");
        usuario.setActivo(true);
        usuario.setFechaCreacion(LocalDateTime.now());

        repository.save(usuario);

        String token = jwtService.generateToken(usuario);

        return mapearAuthResponse(usuario, token);
    }

    public AuthResponse login(String correo, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correo, password)
        );

        Usuario usuario = repository.findByCorreoAndActivoTrue(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado o inactivo"));

        String token = jwtService.generateToken(usuario);

        return mapearAuthResponse(usuario, token);
    }

    private AuthResponse mapearAuthResponse(Usuario usuario, String token) {
        return new AuthResponse(
                token,
                usuario.getIdUsuario(),
                usuario.getIdCliente(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getRol()
        );
    }
}