package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.*;
import Procesos.software.gestion_pagos_educativos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private DeudaRepository deudaRepository;

    @Autowired
    private ReciboRepository reciboRepository;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private LogService logService;

    @Transactional
    public Pago realizarPago(Long deudaId, BigDecimal monto, String metodoPago, String referencia) {

        // 1. Validar que la deuda existe
        Deuda deuda = deudaRepository.findById(deudaId)
                .orElseThrow(() -> new RuntimeException("Deuda no encontrada"));

        // 2. Validar que no esté pagada
        if ("PAGADO".equals(deuda.getEstado())) {
            throw new RuntimeException("Esta deuda ya está completamente pagada");
        }

        // 3. Validar que el monto no exceda el saldo pendiente
        if (monto.compareTo(deuda.getSaldoPendiente()) > 0) {
            throw new RuntimeException("El monto a pagar excede el saldo pendiente");
        }

        // 4. Crear el pago
        Pago pago = new Pago();
        pago.setDeuda(deuda);
        pago.setMontoPagado(monto);
        pago.setMetodoPago(metodoPago);
        pago.setReferenciaPago(referencia);
        pago.setFechaPago(LocalDateTime.now());

        Pago pagoGuardado = pagoRepository.save(pago);

        // 5. Actualizar el saldo de la deuda
        deuda.actualizarSaldo(monto);
        deudaRepository.save(deuda);

        // 6. Generar recibo
        Recibo recibo = new Recibo();
        recibo.setPago(pagoGuardado);
        recibo.setNumeroRecibo(Recibo.generarNumeroRecibo());
        recibo.setMontoTotal(monto);

        // Validar que el número de recibo sea único
        while (reciboRepository.existsByNumeroRecibo(recibo.getNumeroRecibo())) {
            recibo.setNumeroRecibo(Recibo.generarNumeroRecibo());
        }

        reciboRepository.save(recibo);
        pagoGuardado.setRecibo(recibo);

        // 7. Crear notificación
        String nombreEstudiante = deuda.getEstudiante().getNombreCompleto();
        String mensajeNotificacion = String.format(
                "Se ha registrado un pago de S/ %.2f para %s. Recibo: %s",
                monto, nombreEstudiante, recibo.getNumeroRecibo());

        notificacionService.crearNotificacion(
                deuda.getEstudiante().getUsuario().getId(),
                "Pago Registrado",
                mensajeNotificacion,
                "PAGO");

        // 8. Registrar en log
        logService.registrarLog(
                "REALIZAR_PAGO",
                "Pago",
                pagoGuardado.getId(),
                String.format("Monto: %.2f, Método: %s, Deuda: %d", monto, metodoPago, deudaId));

        return pagoGuardado;
    }

    @Transactional(readOnly = true)
    public List<Pago> listarPagosPorDeuda(Long deudaId) {
        return pagoRepository.findByDeudaId(deudaId);
    }

    @Transactional(readOnly = true)
    public List<Pago> listarPagosPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        return pagoRepository.findByFechaPagoBetween(inicio, fin);
    }

    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalRecaudadoPorPeriodo(LocalDateTime inicio, LocalDateTime fin) {
        List<Pago> pagos = pagoRepository.findByFechaPagoBetween(inicio, fin);
        return pagos.stream()
                .map(Pago::getMontoPagado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
