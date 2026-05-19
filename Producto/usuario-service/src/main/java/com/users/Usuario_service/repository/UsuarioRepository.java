package com.users.Usuario_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.users.Usuario_service.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    List<Usuario> findByActivoTrueOrderByIdUsuarioAsc();

    Optional<Usuario> findByCorreo(String correo);

    Optional<Usuario> findByCorreoAndActivoTrue(String correo);
}