package cl.construfacil.ferreteria.repository;

import cl.construfacil.ferreteria.model.Ferreteria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FerreteriaRepository extends JpaRepository<Ferreteria, Integer> {

    List<Ferreteria> findByActivaTrueOrderByIdFerreteriaAsc();

    Optional<Ferreteria> findByCodigoFerreteriaAndActivaTrue(String codigoFerreteria);
}