package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.Pago;
import Procesos.software.gestion_pagos_educativos.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping
    public ResponseEntity<List<Pago>> listarTodos() {
        return ResponseEntity.ok(pagoService.listarTodos());
    }

    @PostMapping("/realizar")
    public ResponseEntity<?> realizarPago(@RequestBody Map<String, Object> body) {
        try {
            Long deudaId = Long.parseLong(body.get("deudaId").toString());
            Double montoDouble = Double.parseDouble(body.get("monto").toString());
            String metodoPago = (String) body.getOrDefault("metodoPago", "EFECTIVO");
            String referencia = (String) body.getOrDefault("referencia", "");

            if (montoDouble <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "El monto debe ser mayor a cero"));
            }

            Pago pago = pagoService.realizarPago(deudaId,
                    java.math.BigDecimal.valueOf(montoDouble), metodoPago, referencia);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", pago.getId());
            response.put("monto", pago.getMontoPagado());
            response.put("fecha", pago.getFechaPago().toString());
            response.put("reciboId", pago.getRecibo() != null ? pago.getRecibo().getId() : null);
            response.put("numeroRecibo", pago.getRecibo() != null ? pago.getRecibo().getNumeroRecibo() : null);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/deuda/{deudaId}")
    public ResponseEntity<List<Pago>> listarPorDeuda(@PathVariable Long deudaId) {
        return ResponseEntity.ok(pagoService.listarPagosPorDeuda(deudaId));
    }

    @GetMapping("/reporte/fechas")
    public ResponseEntity<?> listarPorRangoFechas(
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fin) {
        try {
            java.time.LocalDateTime inicioDt = inicio != null ?
                    java.time.LocalDateTime.parse(inicio) :
                    java.time.LocalDateTime.of(2020, 1, 1, 0, 0);
            java.time.LocalDateTime finDt = fin != null ?
                    java.time.LocalDateTime.parse(fin) :
                    java.time.LocalDateTime.now();

            return ResponseEntity.ok(pagoService.listarPagosPorRangoFechas(inicioDt, finDt));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de fecha inválido"));
        }
    }
}
