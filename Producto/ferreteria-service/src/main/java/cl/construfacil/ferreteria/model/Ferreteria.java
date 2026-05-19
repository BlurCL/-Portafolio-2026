package cl.construfacil.ferreteria.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ferreterias")
public class Ferreteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ferreteria")
    private Integer idFerreteria;

    @Column(name = "codigo_ferreteria", nullable = false, unique = true, length = 50)
    private String codigoFerreteria;

    @Column(name = "nombre_ferreteria", nullable = false, length = 100)
    private String nombreFerreteria;

    @Column(name = "comuna", nullable = false, length = 100)
    private String comuna;

    @Column(name = "direccion", length = 150)
    private String direccion;

    @Column(name = "costo_despacho")
    private BigDecimal costoDespacho;

    @Column(name = "activa")
    private Boolean activa;

    public Integer getIdFerreteria() {
        return idFerreteria;
    }

    public void setIdFerreteria(Integer idFerreteria) {
        this.idFerreteria = idFerreteria;
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

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }
}