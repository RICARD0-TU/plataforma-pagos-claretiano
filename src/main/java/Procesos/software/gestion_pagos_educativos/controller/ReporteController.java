package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.dto.ReporteEstadoCuentaDTO;
import Procesos.software.gestion_pagos_educativos.dto.ReportePagosDTO;
import Procesos.software.gestion_pagos_educativos.model.entity.Deuda;
import Procesos.software.gestion_pagos_educativos.service.ExcelService;
import Procesos.software.gestion_pagos_educativos.service.LogService;
import Procesos.software.gestion_pagos_educativos.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private LogService logService;

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
    public ResponseEntity<List<Deuda>> obtenerDeudasMorosas() {
        return ResponseEntity.ok(reporteService.obtenerDeudasMorosas());
    }

    // Exportar reporte de pagos a Excel
    @GetMapping("/exportar/pagos")
    public ResponseEntity<byte[]> exportarPagosExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<ReportePagosDTO> pagos = reporteService.obtenerReportePagosPorPeriodo(inicio, fin);
        byte[] excelBytes = excelService.exportarReportePagos(pagos);

        logService.registrarLog("EXPORTAR_EXCEL", "ReportePagos", null,
                "Exportación de reporte de pagos");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte_pagos.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    // Exportar estado de cuenta a Excel
    @GetMapping("/exportar/estado-cuenta/{estudianteId}")
    public ResponseEntity<byte[]> exportarEstadoCuentaExcel(@PathVariable Long estudianteId) {
        ReporteEstadoCuentaDTO estadoCuenta = reporteService.obtenerEstadoCuenta(estudianteId);
        byte[] excelBytes = excelService.exportarEstadoCuenta(estadoCuenta);

        logService.registrarLog("EXPORTAR_EXCEL", "EstadoCuenta", estudianteId,
                "Exportación de estado de cuenta");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=estado_cuenta.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    // Exportar deudas morosas a Excel
    @GetMapping("/exportar/deudas-morosas")
    public ResponseEntity<byte[]> exportarDeudasMorosasExcel() {
        List<Deuda> deudas = reporteService.obtenerDeudasMorosas();
        byte[] excelBytes = excelService.exportarDeudasMorosas(deudas);

        logService.registrarLog("EXPORTAR_EXCEL", "DeudasMorosas", null,
                "Exportación de deudas morosas");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=deudas_morosas.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    // Dashboard con resumen financiero
    @GetMapping("/dashboard")
    public ResponseEntity<?> obtenerDashboard() {
        return ResponseEntity.ok(reporteService.obtenerResumenDashboard());
    }
}
