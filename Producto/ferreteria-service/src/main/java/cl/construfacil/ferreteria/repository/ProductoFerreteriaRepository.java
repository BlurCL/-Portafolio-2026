package cl.construfacil.ferreteria.repository;

import cl.construfacil.ferreteria.model.ProductoFerreteria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoFerreteriaRepository extends JpaRepository<ProductoFerreteria, Integer> {

    List<ProductoFerreteria> findByActivoTrueOrderByIdProductoAsc();

    List<ProductoFerreteria> findByFerreteria_CodigoFerreteriaAndActivoTrueOrderByIdProductoAsc(String codigoFerreteria);
}