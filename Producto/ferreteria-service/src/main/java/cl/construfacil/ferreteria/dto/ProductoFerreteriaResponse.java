package cl.construfacil.ferreteria.dto;

import java.math.BigDecimal;

public class ProductoFerreteriaResponse {

    private Integer idProducto;
    private String codigoFerreteria;
    private String nombreFerreteria;
    private String nombreProducto;
    private String descripcionProducto;
    private String unidadVenta;
    private BigDecimal precioUnitario;
    private Integer stock;
    private Boolean activo;

    public ProductoFerreteriaResponse(
            Integer idProducto,
            String codigoFerreteria,
            String nombreFerreteria,
            String nombreProducto,
            String descripcionProducto,
            String unidadVenta,
            BigDecimal precioUnitario,
            Integer stock,
            Boolean activo
    ) {
        this.idProducto = idProducto;
        this.codigoFerreteria = codigoFerreteria;
        this.nombreFerreteria = nombreFerreteria;
        this.nombreProducto = nombreProducto;
        this.descripcionProducto = descripcionProducto;
        this.unidadVenta = unidadVenta;
        this.precioUnitario = precioUnitario;
        this.stock = stock;
        this.activo = activo;
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public String getCodigoFerreteria() {
        return codigoFerreteria;
    }

    public String getNombreFerreteria() {
        return nombreFerreteria;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public String getDescripcionProducto() {
        return descripcionProducto;
    }

    public String getUnidadVenta() {
        return unidadVenta;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public Integer getStock() {
        return stock;
    }

    public Boolean getActivo() {
        return activo;
    }
}