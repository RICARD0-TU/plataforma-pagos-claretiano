package Procesos.software.gestion_pagos_educativos.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deudas")
public class Deuda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    @JsonIgnore
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "concepto_pago_id", nullable = false)
    @JsonIgnore
    private ConceptoPago conceptoPago;

    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;

    @Column(name = "monto_pagado")
    private BigDecimal montoPagado = BigDecimal.ZERO;

    @Column(name = "saldo_pendiente", nullable = false)
    private BigDecimal saldoPendiente;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    private String estado;

    @Column(name = "anio_academico")
    private Integer anioAcademico;

    @Column(name = "mes_correspondiente")
    private Integer mesCorrespondiente;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @JsonIgnore
    @OneToMany(mappedBy = "deuda", cascade = CascadeType.ALL)
    private List<Pago> pagos = new ArrayList<>();

    // Constructor
    public Deuda() {
        this.montoPagado = BigDecimal.ZERO;
        this.fechaCreacion = LocalDateTime.now();
        this.estado = "PENDIENTE";
    }

    // 🔽 AGREGA ESTE MÉTODO AQUÍ 🔽
    public void actualizarSaldo(BigDecimal montoPago) {
        this.montoPagado = this.montoPagado.add(montoPago);
        this.saldoPendiente = this.montoTotal.subtract(this.montoPagado);

        if (this.saldoPendiente.compareTo(BigDecimal.ZERO) == 0) {
            this.estado = "PAGADO";
        } else if (this.montoPagado.compareTo(BigDecimal.ZERO) > 0) {
            this.estado = "PARCIAL";
        }

        // Verificar si está vencido
        if (LocalDate.now().isAfter(this.fechaVencimiento) &&
                this.saldoPendiente.compareTo(BigDecimal.ZERO) > 0) {
            this.estado = "VENCIDO";
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public ConceptoPago getConceptoPago() {
        return conceptoPago;
    }

    public void setConceptoPago(ConceptoPago conceptoPago) {
        this.conceptoPago = conceptoPago;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
        this.saldoPendiente = montoTotal;
    }

    public BigDecimal getMontoPagado() {
        return montoPagado;
    }

    public void setMontoPagado(BigDecimal montoPagado) {
        this.montoPagado = montoPagado;
    }

    public BigDecimal getSaldoPendiente() {
        return saldoPendiente;
    }

    public void setSaldoPendiente(BigDecimal saldoPendiente) {
        this.saldoPendiente = saldoPendiente;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getAnioAcademico() {
        return anioAcademico;
    }

    public void setAnioAcademico(Integer anioAcademico) {
        this.anioAcademico = anioAcademico;
    }

    public Integer getMesCorrespondiente() {
        return mesCorrespondiente;
    }

    public void setMesCorrespondiente(Integer mesCorrespondiente) {
        this.mesCorrespondiente = mesCorrespondiente;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public List<Pago> getPagos() {
        return pagos;
    }

    public void setPagos(List<Pago> pagos) {
        this.pagos = pagos;
    }
}