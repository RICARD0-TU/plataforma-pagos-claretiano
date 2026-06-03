package Procesos.software.gestion_pagos_educativos.service;

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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PagoServiceTest {

    @Mock
    private PagoRepository pagoRepository;

    @Mock
    private DeudaRepository deudaRepository;

    @Mock
    private ReciboRepository reciboRepository;

    @Mock
    private PdfService pdfService;

    @Mock
    private NotificacionService notificacionService;

    @Mock
    private EmailService emailService;

    @Mock
    private LogService logService;

    @InjectMocks
    private PagoService pagoService;

    private Deuda deuda;
    private Estudiante estudiante;
    private Usuario usuario;
    private ConceptoPago concepto;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("padre@email.com");

        estudiante = new Estudiante();
        estudiante.setId(1L);
        estudiante.setNombreCompleto("Estudiante Test");
        estudiante.setUsuario(usuario);

        concepto = new ConceptoPago();
        concepto.setId(1L);
        concepto.setNombre("Pensión Mensual");
        concepto.setMontoBase(new BigDecimal("450.00"));

        deuda = new Deuda();
        deuda.setId(1L);
        deuda.setEstudiante(estudiante);
        deuda.setConceptoPago(concepto);
        deuda.setMontoTotal(new BigDecimal("450.00"));
        deuda.setSaldoPendiente(new BigDecimal("450.00"));
        deuda.setEstado("PENDIENTE");
        deuda.setFechaVencimiento(LocalDate.now().plusDays(30));
    }

    @Test
    void testRealizarPagoExitoso() {
        when(deudaRepository.findById(1L)).thenReturn(Optional.of(deuda));
        when(pagoRepository.save(any(Pago.class))).thenAnswer(i -> i.getArgument(0));
        when(deudaRepository.save(any(Deuda.class))).thenReturn(deuda);
        when(reciboRepository.save(any(Recibo.class))).thenAnswer(i -> i.getArgument(0));
        when(reciboRepository.existsByNumeroRecibo(anyString())).thenReturn(false);

        Pago pago = pagoService.realizarPago(1L, new BigDecimal("450.00"), "EFECTIVO", "REF001");

        assertNotNull(pago);
        assertEquals(0, new BigDecimal("450.00").compareTo(pago.getMontoPagado()));
        verify(pagoRepository).save(any(Pago.class));
        verify(notificacionService).crearNotificacion(anyLong(), anyString(), anyString(), anyString());
    }

    @Test
    void testRealizarPagoDeudaPagada() {
        deuda.setEstado("PAGADO");
        deuda.setSaldoPendiente(BigDecimal.ZERO);

        when(deudaRepository.findById(1L)).thenReturn(Optional.of(deuda));

        assertThrows(RuntimeException.class, () ->
            pagoService.realizarPago(1L, new BigDecimal("100.00"), "EFECTIVO", "REF001"));
    }

    @Test
    void testRealizarPagoMontoExcedeSaldo() {
        when(deudaRepository.findById(1L)).thenReturn(Optional.of(deuda));

        assertThrows(RuntimeException.class, () ->
            pagoService.realizarPago(1L, new BigDecimal("999999.00"), "EFECTIVO", "REF001"));
    }

    @Test
    void testRealizarPagoMontoCero() {
        when(deudaRepository.findById(1L)).thenReturn(Optional.of(deuda));

        assertThrows(RuntimeException.class, () ->
            pagoService.realizarPago(1L, BigDecimal.ZERO, "EFECTIVO", "REF001"));
    }

    @Test
    void testRealizarPagoMontoNegativo() {
        when(deudaRepository.findById(1L)).thenReturn(Optional.of(deuda));

        assertThrows(RuntimeException.class, () ->
            pagoService.realizarPago(1L, new BigDecimal("-100.00"), "EFECTIVO", "REF001"));
    }
}
