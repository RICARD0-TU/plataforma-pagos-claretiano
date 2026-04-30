package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.Deuda;
import Procesos.software.gestion_pagos_educativos.dto.DeudaResponseDTO;
import Procesos.software.gestion_pagos_educativos.service.DeudaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/deudas")
@CrossOrigin(origins = "*")
public class DeudaController {

    @Autowired
    private DeudaService deudaService;

    @GetMapping
    public ResponseEntity<List<Deuda>> listarTodas() {
        return ResponseEntity.ok(deudaService.listarTodas());
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Deuda>> listarPendientes() {
        return ResponseEntity.ok(deudaService.listarDeudasPendientes());
    }

    // ✅ NUEVO ENDPOINT AGREGADO
    @GetMapping("/pendientes-con-detalles")
    public ResponseEntity<List<DeudaResponseDTO>> listarPendientesConDetalles() {
        return ResponseEntity.ok(deudaService.listarDeudasPendientesConDetalles());
    }

    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<Deuda>> listarPorEstudiante(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(deudaService.listarPorEstudiante(estudianteId));
    }

    @GetMapping("/total-estudiante/{estudianteId}")
    public ResponseEntity<?> obtenerTotalDeuda(@PathVariable Long estudianteId) {
        BigDecimal total = deudaService.obtenerDeudaTotalPorEstudiante(estudianteId);
        return ResponseEntity.ok(Map.of(
                "estudianteId", estudianteId,
                "totalDeuda", total));
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarDeuda(@RequestBody Map<String, Object> deudaRequest) {
        try {
            Long estudianteId = Long.valueOf(deudaRequest.get("estudianteId").toString());
            Long conceptoId = Long.valueOf(deudaRequest.get("conceptoId").toString());
            BigDecimal monto = BigDecimal.valueOf(Double.valueOf(deudaRequest.get("monto").toString()));
            LocalDate fechaVencimiento = LocalDate.parse(deudaRequest.get("fechaVencimiento").toString());
            Integer anioAcademico = Integer.valueOf(deudaRequest.get("anioAcademico").toString());
            Integer mesCorrespondiente = Integer.valueOf(deudaRequest.get("mesCorrespondiente").toString());

            Deuda nuevaDeuda = deudaService.registrarDeuda(
                    estudianteId,
                    conceptoId,
                    monto,
                    fechaVencimiento,
                    anioAcademico,
                    mesCorrespondiente);

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDeuda);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}