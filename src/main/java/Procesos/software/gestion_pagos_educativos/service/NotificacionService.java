package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Notificacion;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.NotificacionRepository;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Notificacion crearNotificacion(Long usuarioId, String titulo, String mensaje, String tipo) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(usuario);
        notificacion.setTitulo(titulo);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);
        notificacion.setFechaEnvio(LocalDateTime.now());
        notificacion.setLeida(false);

        // Simular envío (aquí se integraría con email/SMS real)
        System.out.println("📧 [SIMULACIÓN] Enviando notificación a: " + usuario.getEmail());
        System.out.println("   Título: " + titulo);
        System.out.println("   Mensaje: " + mensaje);

        return notificacionRepository.save(notificacion);
    }

    @Transactional(readOnly = true)
    public List<Notificacion> listarNoLeidas(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidaFalse(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Notificacion> listarTodasPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }

    @Transactional
    public void marcarComoLeida(Long notificacionId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    @Transactional
    public void notificarVencimientoDeudas() {
        // Aquí se implementaría la lógica para notificar deudas próximas a vencer
        System.out.println("🔔 [SIMULACIÓN] Verificando deudas por vencer...");
    }
}
