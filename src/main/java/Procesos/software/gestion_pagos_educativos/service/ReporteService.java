package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.dto.*;
import Procesos.software.gestion_pagos_educativos.model.entity.*;
import Procesos.software.gestion_pagos_educativos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private DeudaRepository deudaRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ReciboRepository reciboRepository;

    @Transactional(readOnly = true)
    public ReporteEstadoCuentaDTO obtenerEstadoCuenta(Long estudianteId) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        List<Deuda> deudas = deudaRepository.findByEstudianteId(estudianteId);

        BigDecimal totalDeuda = deudas.stream()
                .map(Deuda::getMontoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPagado = deudas.stream()
                .map(Deuda::getMontoPagado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldoPendiente = totalDeuda.subtract(totalPagado);

        List<DetalleDeudaDTO> detalles = deudas.stream()
                .map(this::convertirADetalleDTO)
                .collect(Collectors.toList());

        ReporteEstadoCuentaDTO reporte = new ReporteEstadoCuentaDTO();
        reporte.setEstudianteNombre(estudiante.getNombreCompleto());
        reporte.setGrado(estudiante.getGrado() + " " + estudiante.getSeccion());
        reporte.setTotalDeuda(totalDeuda);
        reporte.setTotalPagado(totalPagado);
        reporte.setSaldoPendiente(saldoPendiente);
        reporte.setDeudas(detalles);

        return reporte;
    }

    private DetalleDeudaDTO convertirADetalleDTO(Deuda deuda) {
        DetalleDeudaDTO dto = new DetalleDeudaDTO();
        dto.setConcepto(deuda.getConceptoPago().getNombre());
        dto.setMontoTotal(deuda.getMontoTotal());
        dto.setMontoPagado(deuda.getMontoPagado());
        dto.setSaldo(deuda.getSaldoPendiente());
        dto.setFechaVencimiento(deuda.getFechaVencimiento());
        dto.setEstado(deuda.getEstado());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ReportePagosDTO> obtenerReportePagosPorPeriodo(LocalDateTime inicio, LocalDateTime fin) {
        List<Pago> pagos = pagoRepository.findByFechaPagoBetween(inicio, fin);

        return pagos.stream().map(pago -> {
            ReportePagosDTO dto = new ReportePagosDTO();
            dto.setFechaPago(pago.getFechaPago());
            dto.setEstudiante(pago.getDeuda().getEstudiante().getNombreCompleto());
            dto.setConcepto(pago.getDeuda().getConceptoPago().getNombre());
            dto.setMonto(pago.getMontoPagado());
            dto.setMetodoPago(pago.getMetodoPago());
            dto.setNumeroRecibo(pago.getRecibo().getNumeroRecibo());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Deuda> obtenerDeudasMorosas() {
        // Deudas con más de 30 días de vencimiento
        LocalDate hace30Dias = LocalDateTime.now().minusDays(30).toLocalDate();
        return deudaRepository.findAll().stream()
                .filter(d -> "PENDIENTE".equals(d.getEstado()) || "PARCIAL".equals(d.getEstado()))
                .filter(d -> d.getFechaVencimiento().isBefore(hace30Dias))
                .collect(Collectors.toList());
    }
}