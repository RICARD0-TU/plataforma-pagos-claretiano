package Procesos.software.gestion_pagos_educativos.dto;

import java.math.BigDecimal;
import java.util.List;

public class ReporteEstadoCuentaDTO {
    private String estudianteNombre;
    private String grado;
    private BigDecimal totalDeuda;
    private BigDecimal totalPagado;
    private BigDecimal saldoPendiente;
    private List<DetalleDeudaDTO> deudas;

    // Constructores
    public ReporteEstadoCuentaDTO() {
    }

    // Getters y Setters
    public String getEstudianteNombre() {
        return estudianteNombre;
    }

    public void setEstudianteNombre(String estudianteNombre) {
        this.estudianteNombre = estudianteNombre;
    }

    public String getGrado() {
        return grado;
    }

    public void setGrado(String grado) {
        this.grado = grado;
    }

    public BigDecimal getTotalDeuda() {
        return totalDeuda;
    }

    public void setTotalDeuda(BigDecimal totalDeuda) {
        this.totalDeuda = totalDeuda;
    }

    public BigDecimal getTotalPagado() {
        return totalPagado;
    }

    public void setTotalPagado(BigDecimal totalPagado) {
        this.totalPagado = totalPagado;
    }

    public BigDecimal getSaldoPendiente() {
        return saldoPendiente;
    }

    public void setSaldoPendiente(BigDecimal saldoPendiente) {
        this.saldoPendiente = saldoPendiente;
    }

    public List<DetalleDeudaDTO> getDeudas() {
        return deudas;
    }

    public void setDeudas(List<DetalleDeudaDTO> deudas) {
        this.deudas = deudas;
    }
}
