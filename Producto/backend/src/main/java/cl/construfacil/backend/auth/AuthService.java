package cl.construfacil.backend.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import cl.construfacil.backend.model.Usuario;
import cl.construfacil.backend.repository.UsuarioRepository;
import cl.construfacil.backend.security.JwtService;

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
        // Encriptamos la contraseña antes de guardar
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