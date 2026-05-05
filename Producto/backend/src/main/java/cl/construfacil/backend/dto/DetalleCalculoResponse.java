package cl.construfacil.backend.dto;

public class DetalleCalculoResponse {

    private String material;
    private double cantidad;
    private double precioUnitario;
    private double subtotal;

    public DetalleCalculoResponse() {
    }

    public DetalleCalculoResponse(String material, double cantidad, double precioUnitario, double subtotal) {
        this.material = material;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public double getCantidad() {
        return cantidad;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }
}