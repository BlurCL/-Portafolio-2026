package cl.construfacil.obras.service;

import cl.construfacil.obras.dto.ObraResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ObraService {

    public ObraResponse obtenerObra(Integer id) {

        Map<String, Object> medidas = new HashMap<>();
        medidas.put("largo", 2);
        medidas.put("ancho", 1);
        medidas.put("alto", 0.1);

        return new ObraResponse(id, "Radier", medidas);
    }
}