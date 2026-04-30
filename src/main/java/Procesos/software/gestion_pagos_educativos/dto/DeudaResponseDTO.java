package Procesos.software.gestion_pagos_educativos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DeudaResponseDTO {
    private Long id;
    private Long estudianteId;
    private String estudianteNombre;
    private Long conceptoId;
    private String conceptoNombre;
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private BigDecimal saldoPendiente;
    private LocalDate fechaVencimiento;
    private String estado;
    private Integer anioAcademico;
    private Integer mesCorrespondiente;

    // Constructores
    public DeudaResponseDTO() {
    }

    public DeudaResponseDTO(Long id, Long estudianteId, String estudianteNombre,
            Long conceptoId, String conceptoNombre, BigDecimal montoTotal,
            BigDecimal montoPagado, BigDecimal saldoPendiente,
            LocalDate fechaVencimiento, String estado,
            Integer anioAcademico, Integer mesCorrespondiente) {
        this.id = id;
        this.estudianteId = estudianteId;
        this.estudianteNombre = estudianteNombre;
        this.conceptoId = conceptoId;
        this.conceptoNombre = conceptoNombre;
        this.montoTotal = montoTotal;
        this.montoPagado = montoPagado;
        this.saldoPendiente = saldoPendiente;
        this.fechaVencimiento = fechaVencimiento;
        this.estado = estado;
        this.anioAcademico = anioAcademico;
        this.mesCorrespondiente = mesCorrespondiente;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEstudianteId() {
        return estudianteId;
    }

    public void setEstudianteId(Long estudianteId) {
        this.estudianteId = estudianteId;
    }

    public String getEstudianteNombre() {
        return estudianteNombre;
    }

    public void setEstudianteNombre(String estudianteNombre) {
        this.estudianteNombre = estudianteNombre;
    }

    public Long getConceptoId() {
        return conceptoId;
    }

    public void setConceptoId(Long conceptoId) {
        this.conceptoId = conceptoId;
    }

    public String getConceptoNombre() {
        return conceptoNombre;
    }

    public void setConceptoNombre(String conceptoNombre) {
        this.conceptoNombre = conceptoNombre;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
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
}