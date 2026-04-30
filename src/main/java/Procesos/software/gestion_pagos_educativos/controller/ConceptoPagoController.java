package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.ConceptoPago;
import Procesos.software.gestion_pagos_educativos.service.ConceptoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/conceptos-pago")
@CrossOrigin(origins = "*")
public class ConceptoPagoController {

    @Autowired
    private ConceptoPagoService conceptoPagoService;

    @GetMapping
    public ResponseEntity<List<ConceptoPago>> listarTodos() {
        return ResponseEntity.ok(conceptoPagoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            ConceptoPago concepto = conceptoPagoService.buscarPorId(id);
            return ResponseEntity.ok(concepto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crearConcepto(@RequestBody ConceptoPago concepto) {
        try {
            ConceptoPago nuevo = conceptoPagoService.guardar(concepto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}