package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.ConceptoPago;
import Procesos.software.gestion_pagos_educativos.repository.ConceptoPagoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConceptoPagoServiceTest {

    @Mock
    private ConceptoPagoRepository conceptoPagoRepository;

    @InjectMocks
    private ConceptoPagoService conceptoPagoService;

    private ConceptoPago concepto;

    @BeforeEach
    void setUp() {
        concepto = new ConceptoPago();
        concepto.setId(1L);
        concepto.setNombre("Pensión Mensual");
        concepto.setMontoBase(new BigDecimal("450.00"));
        concepto.setActivo(true);
    }

    @Test
    void testListarTodos() {
        when(conceptoPagoRepository.findByActivoTrue()).thenReturn(List.of(concepto));
        assertEquals(1, conceptoPagoService.listarTodos().size());
    }

    @Test
    void testBuscarPorId() {
        when(conceptoPagoRepository.findById(1L)).thenReturn(Optional.of(concepto));
        Optional<ConceptoPago> result = conceptoPagoService.buscarPorId(1L);
        assertTrue(result.isPresent());
        assertEquals("Pensión Mensual", result.get().getNombre());
    }

    @Test
    void testGuardar() {
        when(conceptoPagoRepository.save(any(ConceptoPago.class))).thenReturn(concepto);
        ConceptoPago result = conceptoPagoService.guardar(concepto);
        assertNotNull(result);
        assertEquals("Pensión Mensual", result.getNombre());
    }
}
