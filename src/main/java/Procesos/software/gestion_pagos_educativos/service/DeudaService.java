package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.*;
import Procesos.software.gestion_pagos_educativos.repository.*;
import Procesos.software.gestion_pagos_educativos.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList; // 👈 AGREGADO
import java.util.List;

@Service
public class DeudaService {

    @Autowired
    private DeudaRepository deudaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private ConceptoPagoRepository conceptoPagoRepository;

    @Autowired
    private NotificacionService notificacionService;

    @Transactional(readOnly = true)
    public List<Deuda> listarTodas() {
        return deudaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Deuda> listarPorEstudiante(Long estudianteId) {
        return deudaRepository.findByEstudianteId(estudianteId);
    }

    @Transactional(readOnly = true)
    public List<Deuda> listarDeudasPendientes() {
        return deudaRepository.findByEstado("PENDIENTE");
    }

    // ✅ NUEVO MÉTODO AGREGADO
    @Transactional(readOnly = true)
    public List<DeudaResponseDTO> listarDeudasPendientesConDetalles() {

        List<Deuda> deudas = deudaRepository.findByEstado("PENDIENTE");
        List<DeudaResponseDTO> resultado = new ArrayList<>();

        for (Deuda deuda : deudas) {
            DeudaResponseDTO dto = new DeudaResponseDTO();
            dto.setId(deuda.getId());
            dto.setMontoTotal(deuda.getMontoTotal());
            dto.setMontoPagado(deuda.getMontoPagado());
            dto.setSaldoPendiente(deuda.getSaldoPendiente());
            dto.setFechaVencimiento(deuda.getFechaVencimiento());
            dto.setEstado(deuda.getEstado());
            dto.setAnioAcademico(deuda.getAnioAcademico());
            dto.setMesCorrespondiente(deuda.getMesCorrespondiente());

            // Estudiante
            if (deuda.getEstudiante() != null) {
                dto.setEstudianteId(deuda.getEstudiante().getId());
                dto.setEstudianteNombre(deuda.getEstudiante().getNombreCompleto());
            }

            // Concepto
            if (deuda.getConceptoPago() != null) {
                dto.setConceptoId(deuda.getConceptoPago().getId());
                dto.setConceptoNombre(deuda.getConceptoPago().getNombre());
            }

            resultado.add(dto);
        }

        return resultado;
    }

    @Transactional
    public Deuda registrarDeuda(Long estudianteId, Long conceptoId, BigDecimal monto,
            LocalDate fechaVencimiento, Integer anioAcademico,
            Integer mesCorrespondiente) {

        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        ConceptoPago concepto = conceptoPagoRepository.findById(conceptoId)
                .orElseThrow(() -> new RuntimeException("Concepto de pago no encontrado"));

        Deuda deuda = new Deuda();
        deuda.setEstudiante(estudiante);
        deuda.setConceptoPago(concepto);
        deuda.setMontoTotal(monto);
        deuda.setSaldoPendiente(monto);
        deuda.setFechaVencimiento(fechaVencimiento);
        deuda.setAnioAcademico(anioAcademico);
        deuda.setMesCorrespondiente(mesCorrespondiente);
        deuda.setEstado("PENDIENTE");

        Deuda deudaGuardada = deudaRepository.save(deuda);

        String mensaje = String.format(
                "Se ha registrado una nueva deuda de S/ %.2f para %s. Vence: %s",
                monto, estudiante.getNombreCompleto(), fechaVencimiento);

        notificacionService.crearNotificacion(
                estudiante.getUsuario().getId(),
                "Nueva Deuda Registrada",
                mensaje,
                "PAGO");

        return deudaGuardada;
    }

    @Transactional(readOnly = true)
    public BigDecimal obtenerDeudaTotalPorEstudiante(Long estudianteId) {
        BigDecimal total = deudaRepository.sumSaldoPendienteByEstudiante(estudianteId);
        return total != null ? total : BigDecimal.ZERO;
    }
}