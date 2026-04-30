package Procesos.software.gestion_pagos_educativos.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "recibos")
public class Recibo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pago_id", unique = true, nullable = false)
    @JsonIgnore
    private Pago pago;

    @Column(name = "numero_recibo", unique = true, nullable = false)
    private String numeroRecibo;

    @Column(name = "fecha_emision")
    private LocalDateTime fechaEmision;

    @Column(name = "monto_total")
    private BigDecimal montoTotal;

    private String estado = "EMITIDO";

    @Column(name = "pdf_generado")
    private Boolean pdfGenerado = false;

    public Recibo() {
        this.fechaEmision = LocalDateTime.now();
    }

    // Generar número de recibo automático
    public static String generarNumeroRecibo() {
        return "REC-" + System.currentTimeMillis() + "-" +
                String.format("%04d", (int) (Math.random() * 10000));
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pago getPago() {
        return pago;
    }

    public void setPago(Pago pago) {
        this.pago = pago;
    }

    public String getNumeroRecibo() {
        return numeroRecibo;
    }

    public void setNumeroRecibo(String numeroRecibo) {
        this.numeroRecibo = numeroRecibo;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Boolean getPdfGenerado() {
        return pdfGenerado;
    }

    public void setPdfGenerado(Boolean pdfGenerado) {
        this.pdfGenerado = pdfGenerado;
    }
}
