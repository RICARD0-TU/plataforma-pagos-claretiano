package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Deuda;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class DeudaEntityTest {

    @Test
    void testActualizarSaldoPagoCompleto() {
        Deuda deuda = new Deuda();
        deuda.setMontoTotal(new BigDecimal("450.00"));
        deuda.setEstado("PENDIENTE");

        deuda.actualizarSaldo(new BigDecimal("450.00"));

        assertEquals(0, BigDecimal.ZERO.compareTo(deuda.getSaldoPendiente()));
        assertEquals("PAGADO", deuda.getEstado());
    }

    @Test
    void testActualizarSaldoPagoParcial() {
        Deuda deuda = new Deuda();
        deuda.setMontoTotal(new BigDecimal("450.00"));
        deuda.setEstado("PENDIENTE");

        deuda.actualizarSaldo(new BigDecimal("200.00"));

        assertEquals(0, new BigDecimal("250.00").compareTo(deuda.getSaldoPendiente()));
        assertEquals(0, new BigDecimal("200.00").compareTo(deuda.getMontoPagado()));
        assertEquals("PARCIAL", deuda.getEstado());
    }

    @Test
    void testActualizarSaldoVencido() {
        Deuda deuda = new Deuda();
        deuda.setMontoTotal(new BigDecimal("450.00"));
        deuda.setEstado("PENDIENTE");
        deuda.setFechaVencimiento(LocalDate.now().minusDays(60));

        deuda.actualizarSaldo(new BigDecimal("100.00"));

        assertEquals("VENCIDO", deuda.getEstado());
    }

    @Test
    void testSetMontoTotalInicializaSaldo() {
        Deuda deuda = new Deuda();
        deuda.setMontoTotal(new BigDecimal("500.00"));

        assertEquals(0, new BigDecimal("500.00").compareTo(deuda.getSaldoPendiente()));
    }

    @Test
    void testConstructorInicializaValores() {
        Deuda deuda = new Deuda();

        assertEquals(0, BigDecimal.ZERO.compareTo(deuda.getMontoPagado()));
        assertEquals("PENDIENTE", deuda.getEstado());
    }
}
