package cl.construfacil.ferreteria.dto;

import java.math.BigDecimal;

public class DetalleCotizacionResponse {

    private String materialSolicitado;
    private String productoEncontrado;
    private String unidadVenta;
    private BigDecimal cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private Integer stock;
    private Boolean stockSuficiente;

    public DetalleCotizacionResponse() {
    }

    public DetalleCotizacionResponse(
            String materialSolicitado,
            String productoEncontrado,
            String unidadVenta,
            BigDecimal cantidad,
            BigDecimal precioUnitario,
            BigDecimal subtotal,
            Integer stock,
            Boolean stockSuficiente
    ) {
        this.materialSolicitado = materialSolicitado;
        this.productoEncontrado = productoEncontrado;
        this.unidadVenta = unidadVenta;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
        this.stock = stock;
        this.stockSuficiente = stockSuficiente;
    }

    public String getMaterialSolicitado() {
        return materialSolicitado;
    }

    public void setMaterialSolicitado(String materialSolicitado) {
        this.materialSolicitado = materialSolicitado;
    }

    public String getProductoEncontrado() {
        return productoEncontrado;
    }

    public void setProductoEncontrado(String productoEncontrado) {
        this.productoEncontrado = productoEncontrado;
    }

    public String getUnidadVenta() {
        return unidadVenta;
    }

    public void setUnidadVenta(String unidadVenta) {
        this.unidadVenta = unidadVenta;
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

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getStockSuficiente() {
        return stockSuficiente;
    }

    public void setStockSuficiente(Boolean stockSuficiente) {
        this.stockSuficiente = stockSuficiente;
    }
}