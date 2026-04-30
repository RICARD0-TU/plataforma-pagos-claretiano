package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.dto.ReporteEstadoCuentaDTO;
import Procesos.software.gestion_pagos_educativos.dto.ReportePagosDTO;
import Procesos.software.gestion_pagos_educativos.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = "*")
@Component  // Agrega esta línea
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/test")
    public String test() {
        return "ReporteController funcionando";
    }

    @GetMapping("/estado-cuenta/{estudianteId}")
    public ResponseEntity<ReporteEstadoCuentaDTO> obtenerEstadoCuenta(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(reporteService.obtenerEstadoCuenta(estudianteId));
    }

    @GetMapping("/pagos")
    public ResponseEntity<List<ReportePagosDTO>> obtenerReportePagos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(reporteService.obtenerReportePagosPorPeriodo(inicio, fin));
    }

    @GetMapping("/deudas-morosas")
    public ResponseEntity<List<Procesos.software.gestion_pagos_educativos.model.entity.Deuda>> obtenerDeudasMorosas() {
        return ResponseEntity.ok(reporteService.obtenerDeudasMorosas());
    }
}