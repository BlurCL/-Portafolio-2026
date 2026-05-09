package com.users.Usuario_service.controller;

import java.util.List;
import java.util.Optional; // Importante agregar este import

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // Importante agregar este import
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.users.Usuario_service.model.Usuario;
import com.users.Usuario_service.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get()); 
        } else {
            return ResponseEntity.notFound().build(); 
        }
    }
}