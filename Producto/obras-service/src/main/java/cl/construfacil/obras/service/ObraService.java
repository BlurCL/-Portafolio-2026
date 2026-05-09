package cl.construfacil.obras.service;

import cl.construfacil.obras.dto.CrearObraRequest;
import cl.construfacil.obras.dto.ObraResponse;
import cl.construfacil.obras.repository.ObraRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ObraService {

    private final ObraRepository obraRepository;

    public ObraService(ObraRepository obraRepository) {
        this.obraRepository = obraRepository;
    }

    public ObraResponse crearObra(CrearObraRequest request) {
        validarObra(request);

        Integer idTipoObra = obraRepository.obtenerIdTipoObra(request.getTipo());

        Integer idObra = obraRepository.insertarObra(request, idTipoObra);

        guardarMedidas(idObra, request);

        return obtenerObra(idObra);
    }

    public ObraResponse obtenerObra(Integer id) {
        Map<String, Object> obraDb = obraRepository.obtenerObra(id);
        Map<String, Object> medidasDb = obraRepository.obtenerMedidas(id);

        Integer idObra = ((Number) obraDb.get("id_obra")).intValue();
        String tipo = (String) obraDb.get("nombre_tipo_obra");

        return new ObraResponse(idObra, tipo, medidasDb);
    }

    private void guardarMedidas(Integer idObra, CrearObraRequest request) {
        Map<String, Object> medidas = request.getMedidas();

        if (medidas.containsKey("largo")) {
            insertarMedidaSiCorresponde(idObra, "Largo", medidas.get("largo"));
        }

        if (medidas.containsKey("ancho")) {
            insertarMedidaSiCorresponde(idObra, "Ancho", medidas.get("ancho"));
        }

        if (medidas.containsKey("alto")) {
            if ("Radier".equalsIgnoreCase(request.getTipo())) {
                insertarMedidaSiCorresponde(idObra, "Espesor", medidas.get("alto"));
            } else if ("Tabique".equalsIgnoreCase(request.getTipo())) {
                insertarMedidaSiCorresponde(idObra, "Alto", medidas.get("alto"));
            }
        }
    }

    private void insertarMedidaSiCorresponde(Integer idObra, String nombreMedida, Object valor) {
        if (valor == null) {
            return;
        }

        Double valorDouble = convertirADouble(valor);

        if (valorDouble <= 0) {
            return;
        }

        Integer idTipoMedida = obraRepository.obtenerIdTipoMedida(nombreMedida);
        obraRepository.insertarMedida(idObra, idTipoMedida, valorDouble);
    }

    private void validarObra(CrearObraRequest request) {
        if (request == null) {
            throw new RuntimeException("La solicitud no puede venir vacía.");
        }

        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la obra es obligatorio.");
        }

        if (request.getTipo() == null || request.getTipo().trim().isEmpty()) {
            throw new RuntimeException("El tipo de obra es obligatorio.");
        }

        if (request.getMedidas() == null) {
            throw new RuntimeException("Las medidas son obligatorias.");
        }

        if (!request.getMedidas().containsKey("largo")) {
            throw new RuntimeException("El largo es obligatorio.");
        }

        if (!request.getMedidas().containsKey("ancho")) {
            throw new RuntimeException("El ancho es obligatorio.");
        }
    }

    private Double convertirADouble(Object valor) {
        if (valor == null) {
            return 0.0;
        }

        try {
            return Double.parseDouble(valor.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}