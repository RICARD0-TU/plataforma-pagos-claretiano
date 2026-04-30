package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.Pago;
import Procesos.software.gestion_pagos_educativos.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @PostMapping("/realizar")
    public ResponseEntity<?> realizarPago(@RequestBody Map<String, Object> pagoRequest) {
        try {
            Long deudaId = Long.valueOf(pagoRequest.get("deudaId").toString());
            Double monto = Double.valueOf(pagoRequest.get("monto").toString());
            String metodoPago = pagoRequest.get("metodoPago").toString();
            String referencia = pagoRequest.getOrDefault("referencia", "").toString();

            Pago pago = pagoService.realizarPago(
                    deudaId,
                    java.math.BigDecimal.valueOf(monto),
                    metodoPago,
                    referencia);

            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Pago realizado exitosamente");
            response.put("pago", pago);
            response.put("numeroRecibo", pago.getRecibo().getNumeroRecibo());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/deuda/{deudaId}")
    public ResponseEntity<List<Pago>> listarPagosPorDeuda(@PathVariable Long deudaId) {
        return ResponseEntity.ok(pagoService.listarPagosPorDeuda(deudaId));
    }

    @GetMapping("/reporte/fechas")
    public ResponseEntity<?> reportePorFechas(
            @RequestParam String inicio,
            @RequestParam String fin) {

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime fechaInicio = LocalDateTime.parse(inicio + "T00:00:00", formatter);
        LocalDateTime fechaFin = LocalDateTime.parse(fin + "T23:59:59", formatter);

        List<Pago> pagos = pagoService.listarPagosPorRangoFechas(fechaInicio, fechaFin);
        java.math.BigDecimal total = pagoService.obtenerTotalRecaudadoPorPeriodo(fechaInicio, fechaFin);

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("periodo", Map.of("inicio", inicio, "fin", fin));
        reporte.put("totalRecaudado", total);
        reporte.put("cantidadPagos", pagos.size());
        reporte.put("pagos", pagos);

        return ResponseEntity.ok(reporte);
    }
}
