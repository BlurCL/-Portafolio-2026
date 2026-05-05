package cl.construfacil.backend.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CalculoRepository {

    private final JdbcTemplate jdbcTemplate;

    public CalculoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> obtenerObra(Integer idObra) {
        String sql = """
            SELECT o.id_obra, t.nombre_tipo_obra
            FROM obras o
            JOIN tipos_de_obra t ON o.id_tipo_obra = t.id_tipo_obra
            WHERE o.id_obra = ?
        """;
        return jdbcTemplate.queryForMap(sql, idObra);
    }

    public List<Map<String, Object>> obtenerMedidas(Integer idObra) {
        String sql = """
            SELECT tm.nombre_tipo_medida, om.valor_medida
            FROM obras_medidas om
            JOIN tipos_de_medida tm ON om.id_tipo_medida = tm.id_tipo_medida
            WHERE om.id_obra = ?
        """;
        return jdbcTemplate.queryForList(sql, idObra);
    }

    public List<Map<String, Object>> obtenerReglas(Integer idObra) {
        String sql = """
            SELECT
                t.nombre_tipo_obra,
                m.nombre_material,
                m.precio_referencial,
                rc.unidad_calculo,
                rc.factor_calculo
            FROM obras o
            JOIN tipos_de_obra t ON o.id_tipo_obra = t.id_tipo_obra
            JOIN reglas_de_calculo rc ON rc.id_tipo_obra = t.id_tipo_obra
            JOIN materiales m ON rc.id_material = m.id_material
            WHERE o.id_obra = ?
        """;
        return jdbcTemplate.queryForList(sql, idObra);
    }
}