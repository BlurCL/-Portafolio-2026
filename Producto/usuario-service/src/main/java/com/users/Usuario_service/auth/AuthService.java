//AuthService.java
package com.users.Usuario_service.auth; 

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

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder, 
                      JwtService jwtService, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public Map<String, String> register(Usuario request) {
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());

        // Encripta la contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        
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
        
        Usuario usuario = repository.findByCorreo(correo).orElseThrow();
        String token = jwtService.generateToken(usuario);
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}