package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping
    public ResponseEntity<?> obtenerDashboard() {
        return ResponseEntity.ok(reporteService.obtenerResumenDashboard());
    }
}
