package com.users.Usuario_service.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.users.Usuario_service.dto.UsuarioResponse;
import com.users.Usuario_service.model.Usuario;
import com.users.Usuario_service.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> obtenerTodosLosUsuarios() {
        List<UsuarioResponse> usuarios = usuarioRepository.findByActivoTrueOrderByIdUsuarioAsc()
                .stream()
                .map(this::mapearUsuario)
                .toList();

        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Integer idUsuario) {
        Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);

        if (usuario.isPresent() && Boolean.TRUE.equals(usuario.get().getActivo())) {
            return ResponseEntity.ok(mapearUsuario(usuario.get()));
        }

        return ResponseEntity.notFound().build();
    }

    private UsuarioResponse mapearUsuario(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getIdCliente(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getRol(),
                usuario.getActivo(),
                usuario.getFechaCreacion()
        );
    }
}