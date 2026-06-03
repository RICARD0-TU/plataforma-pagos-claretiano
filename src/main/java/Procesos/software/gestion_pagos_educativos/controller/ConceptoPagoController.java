package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.ConceptoPago;
import Procesos.software.gestion_pagos_educativos.service.ConceptoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/conceptos-pago")
@CrossOrigin(origins = "*")
public class ConceptoPagoController {

    @Autowired
    private ConceptoPagoService service;

    @GetMapping
    public ResponseEntity<List<ConceptoPago>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ConceptoPago concepto) {
        try {
            return ResponseEntity.ok(service.guardar(concepto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ConceptoPago concepto) {
        try {
            ConceptoPago existente = service.buscarPorId(id)
                    .orElseThrow(() -> new RuntimeException("Concepto no encontrado"));
            existente.setNombre(concepto.getNombre());
            existente.setDescripcion(concepto.getDescripcion());
            existente.setMontoBase(concepto.getMontoBase());
            existente.setPeriodicidad(concepto.getPeriodicidad());
            return ResponseEntity.ok(service.guardar(existente));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            ConceptoPago concepto = service.buscarPorId(id)
                    .orElseThrow(() -> new RuntimeException("Concepto no encontrado"));
            concepto.setActivo(false);
            service.guardar(concepto);
            return ResponseEntity.ok(Map.of("mensaje", "Concepto eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
