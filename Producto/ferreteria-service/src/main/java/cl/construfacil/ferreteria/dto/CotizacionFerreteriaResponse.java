package cl.construfacil.ferreteria.dto;

import java.math.BigDecimal;
import java.util.List;

public class CotizacionFerreteriaResponse {

    private String codigoFerreteria;
    private String nombreFerreteria;
    private String comuna;
    private String direccion;
    private BigDecimal costoDespacho;
    private BigDecimal totalProductos;
    private BigDecimal totalCotizacion;
    private Boolean masConveniente;
    private List<DetalleCotizacionResponse> detalle;

    public CotizacionFerreteriaResponse() {
    }

    public CotizacionFerreteriaResponse(
            String codigoFerreteria,
            String nombreFerreteria,
            String comuna,
            String direccion,
            BigDecimal costoDespacho,
            BigDecimal totalProductos,
            BigDecimal totalCotizacion,
            Boolean masConveniente,
            List<DetalleCotizacionResponse> detalle
    ) {
        this.codigoFerreteria = codigoFerreteria;
        this.nombreFerreteria = nombreFerreteria;
        this.comuna = comuna;
        this.direccion = direccion;
        this.costoDespacho = costoDespacho;
        this.totalProductos = totalProductos;
        this.totalCotizacion = totalCotizacion;
        this.masConveniente = masConveniente;
        this.detalle = detalle;
    }

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

    public BigDecimal getTotalProductos() {
        return totalProductos;
    }

    public void setTotalProductos(BigDecimal totalProductos) {
        this.totalProductos = totalProductos;
    }

    public BigDecimal getTotalCotizacion() {
        return totalCotizacion;
    }

    public void setTotalCotizacion(BigDecimal totalCotizacion) {
        this.totalCotizacion = totalCotizacion;
    }

    public Boolean getMasConveniente() {
        return masConveniente;
    }

    public void setMasConveniente(Boolean masConveniente) {
        this.masConveniente = masConveniente;
    }

    public List<DetalleCotizacionResponse> getDetalle() {
        return detalle;
    }

    public void setDetalle(List<DetalleCotizacionResponse> detalle) {
        this.detalle = detalle;
    }
}