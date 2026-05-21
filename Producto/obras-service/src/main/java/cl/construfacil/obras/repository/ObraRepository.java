package cl.construfacil.obras.repository;

import cl.construfacil.obras.dto.CrearObraRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class ObraRepository {

    private final JdbcTemplate jdbcTemplate;

    public ObraRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer obtenerIdTipoObra(String tipo) {
        String sql = """
            SELECT id_tipo_obra
            FROM tipos_de_obra
            WHERE LOWER(nombre_tipo_obra) = LOWER(?)
        """;

        return jdbcTemplate.queryForObject(sql, Integer.class, tipo);
    }

    public Integer obtenerIdTipoMedida(String nombreMedida) {
        String sql = """
            SELECT id_tipo_medida
            FROM tipos_de_medida
            WHERE LOWER(nombre_tipo_medida) = LOWER(?)
        """;

        return jdbcTemplate.queryForObject(sql, Integer.class, nombreMedida);
    }

    public Integer insertarObra(CrearObraRequest request, Integer idTipoObra) {
        String sql = """
            INSERT INTO obras (
                id_cliente,
                id_usuario,
                id_tipo_obra,
                id_comuna,
                nombre_obra,
                descripcion_obra,
                fecha_creacion
            )
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE)
            RETURNING id_obra
        """;

        Integer idCliente = request.getIdCliente() != null ? request.getIdCliente() : 1;
        Integer idUsuario = request.getIdUsuario() != null ? request.getIdUsuario() : 1;
        Integer idComuna = 1;

        return jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                idCliente,
                idUsuario,
                idTipoObra,
                idComuna,
                request.getNombre(),
                request.getSubtipo()
        );
    }

    public void insertarMedida(Integer idObra, Integer idTipoMedida, Double valorMedida) {
        String sql = """
            INSERT INTO obras_medidas (
                id_obra,
                id_tipo_medida,
                valor_medida
            )
            VALUES (?, ?, ?)
        """;

        jdbcTemplate.update(sql, idObra, idTipoMedida, valorMedida);
    }

    public Map<String, Object> obtenerObra(Integer idObra) {
        String sql = """
            SELECT
                o.id_obra,
                t.nombre_tipo_obra
            FROM obras o
            JOIN tipos_de_obra t ON o.id_tipo_obra = t.id_tipo_obra
            WHERE o.id_obra = ?
        """;

        return jdbcTemplate.queryForMap(sql, idObra);
    }

    public Map<String, Object> obtenerMedidas(Integer idObra) {
        String sql = """
            SELECT
                LOWER(tm.nombre_tipo_medida) AS nombre_tipo_medida,
                om.valor_medida
            FROM obras_medidas om
            JOIN tipos_de_medida tm ON om.id_tipo_medida = tm.id_tipo_medida
            WHERE om.id_obra = ?
        """;

        Map<String, Object> medidas = new HashMap<>();

        jdbcTemplate.query(sql, rs -> {
            String nombre = rs.getString("nombre_tipo_medida");
            Double valor = rs.getDouble("valor_medida");

            if ("espesor".equalsIgnoreCase(nombre)) {
                medidas.put("alto", valor);
            } else {
                medidas.put(nombre.toLowerCase(), valor);
            }
        }, idObra);

        return medidas;
    }
}