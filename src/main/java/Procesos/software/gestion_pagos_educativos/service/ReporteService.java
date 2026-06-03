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
import java.util.*;
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
                .map(d -> d.getMontoPagado() != null ? d.getMontoPagado() : BigDecimal.ZERO)
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
        dto.setId(deuda.getId());
        dto.setConcepto(deuda.getConceptoPago() != null ? deuda.getConceptoPago().getNombre() : "Sin concepto");
        dto.setMontoTotal(deuda.getMontoTotal());
        dto.setMontoPagado(deuda.getMontoPagado() != null ? deuda.getMontoPagado() : BigDecimal.ZERO);
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
            dto.setId(pago.getId());
            dto.setFechaPago(pago.getFechaPago());
            dto.setEstudiante(pago.getDeuda().getEstudiante().getNombreCompleto());
            dto.setConcepto(pago.getDeuda().getConceptoPago().getNombre());
            dto.setMonto(pago.getMontoPagado());
            dto.setMetodoPago(pago.getMetodoPago());
            dto.setNumeroRecibo(pago.getRecibo() != null ? pago.getRecibo().getNumeroRecibo() : "-");
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Deuda> obtenerDeudasMorosas() {
        LocalDate hace30Dias = LocalDateTime.now().minusDays(30).toLocalDate();
        return deudaRepository.findAll().stream()
                .filter(d -> "PENDIENTE".equals(d.getEstado()) || "PARCIAL".equals(d.getEstado()))
                .filter(d -> d.getFechaVencimiento().isBefore(hace30Dias))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerResumenDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        List<Deuda> todasLasDeudas = deudaRepository.findAll();
        List<Deuda> deudasPendientes = todasLasDeudas.stream()
                .filter(d -> !"PAGADO".equals(d.getEstado()))
                .collect(Collectors.toList());
        List<Pago> todosLosPagos = pagoRepository.findAll();

        BigDecimal totalRecaudado = todosLosPagos.stream()
                .map(Pago::getMontoPagado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeuda = todasLasDeudas.stream()
                .map(Deuda::getMontoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPendiente = deudasPendientes.stream()
                .map(Deuda::getSaldoPendiente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long deudasMorosasCount = obtenerDeudasMorosas().size();

        double morosidad = totalDeuda.compareTo(BigDecimal.ZERO) > 0
                ? (totalPendiente.doubleValue() / totalDeuda.doubleValue()) * 100
                : 0;

        // Pagos por mes (últimos 12 meses)
        Map<String, BigDecimal> pagosPorMes = new LinkedHashMap<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 11; i >= 0; i--) {
            LocalDateTime mesInicio = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime mesFin = mesInicio.plusMonths(1).minusSeconds(1);
            String label = mesInicio.getMonth().toString().substring(0, 3) + " " + mesInicio.getYear();

            BigDecimal totalMes = todosLosPagos.stream()
                    .filter(p -> !p.getFechaPago().isBefore(mesInicio) && !p.getFechaPago().isAfter(mesFin))
                    .map(Pago::getMontoPagado)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            pagosPorMes.put(label, totalMes);
        }

        // Deudas por estado
        Map<String, Long> deudasPorEstado = todasLasDeudas.stream()
                .collect(Collectors.groupingBy(Deuda::getEstado, Collectors.counting()));

        dashboard.put("totalRecaudado", totalRecaudado);
        dashboard.put("totalDeuda", totalDeuda);
        dashboard.put("totalPendiente", totalPendiente);
        dashboard.put("deudasPendientes", deudasPendientes.size());
        dashboard.put("deudasMorosas", deudasMorosasCount);
        dashboard.put("morosidad", Math.round(morosidad * 100.0) / 100.0);
        dashboard.put("pagosPorMes", pagosPorMes);
        dashboard.put("deudasPorEstado", deudasPorEstado);
        dashboard.put("totalPagos", todosLosPagos.size());
        dashboard.put("totalEstudiantes", estudianteRepository.findAll().size());

        return dashboard;
    }
}
