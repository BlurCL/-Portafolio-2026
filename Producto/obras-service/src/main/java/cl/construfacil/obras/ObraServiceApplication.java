package cl.construfacil.obras;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



import cl.construfacil.obras.dto.ObraResponse;
import cl.construfacil.obras.service.ObraService;

@SpringBootApplication
public class ObraServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ObraServiceApplication.class, args);
    }
}