package cl.construfacil.ferreteria.dto;

import java.math.BigDecimal;

public class CrearFerreteriaRequest {

    private String codigoFerreteria;
    private String nombreFerreteria;
    private String comuna;
    private String direccion;
    private BigDecimal costoDespacho;

    public String getCodigoFerreteria() {
        return codigoFerreteria;
    }

    public void setCodigoFerreteria(String codigoFerreteria) {
        this.codigoFerreteria = codigoFerreteria;
    }

    public String getNombreFerreteria() {
        return nombreFerreteria;
    }

    public void setNombreFerreteria(String nombreFerreteria) {
        this.nombreFerreteria = nombreFerreteria;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public BigDecimal getCostoDespacho() {
        return costoDespacho;
    }

    public void setCostoDespacho(BigDecimal costoDespacho) {
        this.costoDespacho = costoDespacho;
    }
}