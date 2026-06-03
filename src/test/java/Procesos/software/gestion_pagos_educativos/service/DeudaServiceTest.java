package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.ConceptoPago;
import Procesos.software.gestion_pagos_educativos.model.entity.Deuda;
import Procesos.software.gestion_pagos_educativos.model.entity.Estudiante;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.ConceptoPagoRepository;
import Procesos.software.gestion_pagos_educativos.repository.DeudaRepository;
import Procesos.software.gestion_pagos_educativos.repository.EstudianteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeudaServiceTest {

    @Mock
    private DeudaRepository deudaRepository;

    @Mock
    private EstudianteRepository estudianteRepository;

    @Mock
    private ConceptoPagoRepository conceptoPagoRepository;

    @Mock
    private NotificacionService notificacionService;

    @InjectMocks
    private DeudaService deudaService;

    private Estudiante estudiante;
    private ConceptoPago concepto;

    @BeforeEach
    void setUp() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);

        estudiante = new Estudiante();
        estudiante.setId(1L);
        estudiante.setNombreCompleto("Estudiante Test");
        estudiante.setUsuario(usuario);

        concepto = new ConceptoPago();
        concepto.setId(1L);
        concepto.setNombre("Pensión");
        concepto.setMontoBase(new BigDecimal("450.00"));
    }

    @Test
    void testListarTodas() {
        when(deudaRepository.findAll()).thenReturn(List.of(new Deuda(), new Deuda()));
        assertEquals(2, deudaService.listarTodas().size());
    }

    @Test
    void testListarPorEstudiante() {
        when(deudaRepository.findByEstudianteId(1L)).thenReturn(List.of(new Deuda()));
        assertEquals(1, deudaService.listarPorEstudiante(1L).size());
    }

    @Test
    void testObtenerDeudaTotalPorEstudiante() {
        when(deudaRepository.sumSaldoPendienteByEstudiante(1L)).thenReturn(new BigDecimal("500.00"));
        BigDecimal total = deudaService.obtenerDeudaTotalPorEstudiante(1L);
        assertEquals(0, new BigDecimal("500.00").compareTo(total));
    }

    @Test
    void testObtenerDeudaTotalPorEstudianteNull() {
        when(deudaRepository.sumSaldoPendienteByEstudiante(1L)).thenReturn(null);
        BigDecimal total = deudaService.obtenerDeudaTotalPorEstudiante(1L);
        assertEquals(BigDecimal.ZERO, total);
    }

    @Test
    void testRegistrarDeuda() {
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(conceptoPagoRepository.findById(1L)).thenReturn(Optional.of(concepto));
        when(deudaRepository.save(any(Deuda.class))).thenAnswer(i -> i.getArgument(0));

        Deuda deuda = deudaService.registrarDeuda(1L, 1L, new BigDecimal("450.00"), LocalDate.now(), 2024, 3);

        assertNotNull(deuda);
        assertEquals("PENDIENTE", deuda.getEstado());
        assertEquals(0, new BigDecimal("450.00").compareTo(deuda.getSaldoPendiente()));
        verify(deudaRepository).save(any(Deuda.class));
    }

    @Test
    void testRegistrarDeudaEstudianteNotFound() {
        when(estudianteRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () ->
            deudaService.registrarDeuda(999L, 1L, new BigDecimal("100"), LocalDate.now(), 2024, 1));
    }

    @Test
    void testListarDeudasPendientes() {
        Deuda d1 = new Deuda();
        d1.setEstado("PENDIENTE");
        Deuda d2 = new Deuda();
        d2.setEstado("PARCIAL");
        when(deudaRepository.findByEstado("PENDIENTE")).thenReturn(List.of(d1));
        assertEquals(1, deudaService.listarDeudasPendientes().size());
    }
}
