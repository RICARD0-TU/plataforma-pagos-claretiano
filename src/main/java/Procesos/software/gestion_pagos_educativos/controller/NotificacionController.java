package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.Notificacion;
import Procesos.software.gestion_pagos_educativos.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notificaciones")
@CrossOrigin(origins = "*")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.listarTodasPorUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public ResponseEntity<List<Notificacion>> listarNoLeidas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.listarNoLeidas(usuarioId));
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearNotificacion(@RequestBody Map<String, Object> notificacionRequest) {
        Long usuarioId = Long.valueOf(notificacionRequest.get("usuarioId").toString());
        String titulo = notificacionRequest.get("titulo").toString();
        String mensaje = notificacionRequest.get("mensaje").toString();
        String tipo = notificacionRequest.getOrDefault("tipo", "INFO").toString();

        Notificacion notificacion = notificacionService.crearNotificacion(usuarioId, titulo, mensaje, tipo);
        return ResponseEntity.ok(notificacion);
    }

    @PutMapping("/marcar-leida/{id}")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok(Map.of("mensaje", "Notificación marcada como leída"));
    }
}
