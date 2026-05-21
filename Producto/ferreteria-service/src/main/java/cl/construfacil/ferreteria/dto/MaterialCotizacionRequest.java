package cl.construfacil.ferreteria.dto;

import java.math.BigDecimal;

public class MaterialCotizacionRequest {

    private String nombre;
    private BigDecimal cantidad;
    private BigDecimal precioUnitario;

    public MaterialCotizacionRequest() {
    }

    public MaterialCotizacionRequest(String nombre, BigDecimal cantidad, BigDecimal precioUnitario) {
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}