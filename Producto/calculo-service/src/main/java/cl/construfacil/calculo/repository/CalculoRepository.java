package cl.construfacil.calculo.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class CalculoRepository {

    private final JdbcTemplate jdbcTemplate;
    private final SimpleJdbcInsert presupuestoInsert;
    private final SimpleJdbcInsert detallePresupuestoInsert;

    public CalculoRepository(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;

        this.presupuestoInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("presupuestos")
                .usingGeneratedKeyColumns("id_presupuesto");

        this.detallePresupuestoInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("detalle_presupuesto")
                .usingGeneratedKeyColumns("id_detalle_presupuesto");
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
                m.id_material,
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

    public Integer insertarPresupuesto(Integer idObra, double total) {
    String sql = """
        INSERT INTO presupuestos (id_obra, fecha_creacion, total_presupuesto)
        VALUES (?, CURRENT_DATE, ?)
        RETURNING id_presupuesto
    """;

    return jdbcTemplate.queryForObject(sql, Integer.class, idObra, total);
    }

    public void insertarDetallePresupuesto(Integer idPresupuesto, Integer idMaterial,
                                           Double cantidad, Double subtotal) {
        Map<String, Object> params = new HashMap<>();
        params.put("id_presupuesto", idPresupuesto);
        params.put("id_material", idMaterial);
        params.put("cantidad_material", cantidad);
        params.put("subtotal_material", subtotal);

        detallePresupuestoInsert.execute(params);
    }

    public Map<String, Object> obtenerPresupuestoCabecera(Integer idPresupuesto) {
        String sql = """
            SELECT
                p.id_presupuesto,
                p.id_obra,
                p.fecha_creacion,
                p.total_presupuesto,
                t.nombre_tipo_obra
            FROM presupuestos p
            JOIN obras o ON p.id_obra = o.id_obra
            JOIN tipos_de_obra t ON o.id_tipo_obra = t.id_tipo_obra
            WHERE p.id_presupuesto = ?
        """;
        return jdbcTemplate.queryForMap(sql, idPresupuesto);
    }

    public List<Map<String, Object>> obtenerDetallePresupuesto(Integer idPresupuesto) {
        String sql = """
            SELECT
                m.nombre_material,
                m.precio_referencial,
                dp.cantidad_material,
                dp.subtotal_material
            FROM detalle_presupuesto dp
            JOIN materiales m ON dp.id_material = m.id_material
            WHERE dp.id_presupuesto = ?
            ORDER BY m.nombre_material
        """;
        return jdbcTemplate.queryForList(sql, idPresupuesto);
    }
}