package cl.construfacil.ferreteria.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "productos_ferreteria")
public class ProductoFerreteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ferreteria", nullable = false)
    private Ferreteria ferreteria;

    @Column(name = "nombre_producto", nullable = false, length = 150)
    private String nombreProducto;

    @Column(name = "descripcion_producto", length = 255)
    private String descripcionProducto;

    @Column(name = "unidad_venta", nullable = false, length = 50)
    private String unidadVenta;

    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "activo")
    private Boolean activo;

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public Ferreteria getFerreteria() {
        return ferreteria;
    }

    public void setFerreteria(Ferreteria ferreteria) {
        this.ferreteria = ferreteria;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getDescripcionProducto() {
        return descripcionProducto;
    }

    public void setDescripcionProducto(String descripcionProducto) {
        this.descripcionProducto = descripcionProducto;
    }

    public String getUnidadVenta() {
        return unidadVenta;
    }

    public void setUnidadVenta(String unidadVenta) {
        this.unidadVenta = unidadVenta;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}