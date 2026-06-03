package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.Log;
import Procesos.software.gestion_pagos_educativos.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logs")
@CrossOrigin(origins = "*")
public class LogController {

    @Autowired
    private LogRepository logRepository;

    @GetMapping
    public ResponseEntity<List<Log>> listarTodos() {
        return ResponseEntity.ok(logRepository.findAll());
    }

    @GetMapping("/accion/{accion}")
    public ResponseEntity<List<Log>> listarPorAccion(@PathVariable String accion) {
        return ResponseEntity.ok(logRepository.findAll().stream()
                .filter(l -> l.getAccion().equalsIgnoreCase(accion))
                .toList());
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<Log>> listarRecientes() {
        List<Log> logs = logRepository.findAll();
        logs.sort((a, b) -> b.getFechaHora().compareTo(a.getFechaHora()));
        return ResponseEntity.ok(logs.size() > 50 ? logs.subList(0, 50) : logs);
    }
}
