package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.dto.ReporteEstadoCuentaDTO;
import Procesos.software.gestion_pagos_educativos.model.entity.*;
import Procesos.software.gestion_pagos_educativos.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReporteServiceTest {

    @Mock
    private EstudianteRepository estudianteRepository;

    @Mock
    private DeudaRepository deudaRepository;

    @Mock
    private PagoRepository pagoRepository;

    @Mock
    private ReciboRepository reciboRepository;

    @InjectMocks
    private ReporteService reporteService;

    private Estudiante estudiante;
    private Deuda deuda1;
    private Deuda deuda2;
    private ConceptoPago concepto;

    @BeforeEach
    void setUp() {
        concepto = new ConceptoPago();
        concepto.setId(1L);
        concepto.setNombre("Pensión Mensual");

        estudiante = new Estudiante();
        estudiante.setId(1L);
        estudiante.setNombreCompleto("Test Estudiante");
        estudiante.setGrado("5to");
        estudiante.setSeccion("A");

        deuda1 = new Deuda();
        deuda1.setId(1L);
        deuda1.setEstudiante(estudiante);
        deuda1.setConceptoPago(concepto);
        deuda1.setMontoTotal(new BigDecimal("450.00"));
        deuda1.setMontoPagado(new BigDecimal("200.00"));
        deuda1.setSaldoPendiente(new BigDecimal("250.00"));
        deuda1.setEstado("PARCIAL");
        deuda1.setFechaVencimiento(LocalDate.of(2024, 12, 31));

        deuda2 = new Deuda();
        deuda2.setId(2L);
        deuda2.setEstudiante(estudiante);
        deuda2.setConceptoPago(concepto);
        deuda2.setMontoTotal(new BigDecimal("200.00"));
        deuda2.setMontoPagado(new BigDecimal("0.00"));
        deuda2.setSaldoPendiente(new BigDecimal("200.00"));
        deuda2.setEstado("PENDIENTE");
        deuda2.setFechaVencimiento(LocalDate.of(2024, 12, 15));
    }

    @Test
    void testObtenerEstadoCuenta() {
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(deudaRepository.findByEstudianteId(1L)).thenReturn(List.of(deuda1, deuda2));

        ReporteEstadoCuentaDTO reporte = reporteService.obtenerEstadoCuenta(1L);

        assertNotNull(reporte);
        assertEquals("Test Estudiante", reporte.getEstudianteNombre());
        assertEquals(0, new BigDecimal("650.00").compareTo(reporte.getTotalDeuda()));
        assertEquals(0, new BigDecimal("200.00").compareTo(reporte.getTotalPagado()));
        assertEquals(2, reporte.getDeudas().size());
    }

    @Test
    void testObtenerResumenDashboard() {
        when(deudaRepository.findAll()).thenReturn(List.of(deuda1, deuda2));
        when(pagoRepository.findAll()).thenReturn(List.of());
        when(estudianteRepository.findAll()).thenReturn(List.of(estudiante));

        Map<String, Object> dashboard = reporteService.obtenerResumenDashboard();

        assertNotNull(dashboard);
        assertTrue(dashboard.containsKey("totalRecaudado"));
        assertTrue(dashboard.containsKey("totalDeuda"));
        assertTrue(dashboard.containsKey("morosidad"));
        assertTrue(dashboard.containsKey("pagosPorMes"));
        assertTrue(dashboard.containsKey("deudasPorEstado"));
        assertEquals(1, dashboard.get("totalEstudiantes"));
    }

    @Test
    void testObtenerDeudasMorosas() {
        Deuda deudaVencida = new Deuda();
        deudaVencida.setId(3L);
        deudaVencida.setEstudiante(estudiante);
        deudaVencida.setConceptoPago(concepto);
        deudaVencida.setSaldoPendiente(new BigDecimal("450.00"));
        deudaVencida.setEstado("PENDIENTE");
        deudaVencida.setFechaVencimiento(LocalDate.now().minusDays(60));

        when(deudaRepository.findAll()).thenReturn(List.of(deuda1, deuda2, deudaVencida));

        List<Deuda> morosas = reporteService.obtenerDeudasMorosas();

        assertNotNull(morosas);
        assertTrue(morosas.size() >= 1);
    }
}
