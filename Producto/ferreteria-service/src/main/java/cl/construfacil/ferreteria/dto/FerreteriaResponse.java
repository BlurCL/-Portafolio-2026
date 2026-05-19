package cl.construfacil.ferreteria.dto;

import java.math.BigDecimal;

public class FerreteriaResponse {

    private Integer idFerreteria;
    private String codigoFerreteria;
    private String nombreFerreteria;
    private String comuna;
    private String direccion;
    private BigDecimal costoDespacho;
    private Boolean activa;

    public FerreteriaResponse(
            Integer idFerreteria,
            String codigoFerreteria,
            String nombreFerreteria,
            String comuna,
            String direccion,
            BigDecimal costoDespacho,
            Boolean activa
    ) {
        this.idFerreteria = idFerreteria;
        this.codigoFerreteria = codigoFerreteria;
        this.nombreFerreteria = nombreFerreteria;
        this.comuna = comuna;
        this.direccion = direccion;
        this.costoDespacho = costoDespacho;
        this.activa = activa;
    }

    public Integer getIdFerreteria() {
        return idFerreteria;
    }

    public String getCodigoFerreteria() {
        return codigoFerreteria;
    }

    public String getNombreFerreteria() {
        return nombreFerreteria;
    }

    public String getComuna() {
        return comuna;
    }

    public String getDireccion() {
        return direccion;
    }

    public BigDecimal getCostoDespacho() {
        return costoDespacho;
    }

    public Boolean getActiva() {
        return activa;
    }
}