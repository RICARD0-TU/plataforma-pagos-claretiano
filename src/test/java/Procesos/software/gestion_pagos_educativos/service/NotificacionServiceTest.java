package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Notificacion;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.NotificacionRepository;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private NotificacionService notificacionService;

    private Usuario usuario;
    private Notificacion notificacion;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("test@email.com");
        usuario.setNombreCompleto("Test User");

        notificacion = new Notificacion();
        notificacion.setId(1L);
        notificacion.setUsuario(usuario);
        notificacion.setTitulo("Test");
        notificacion.setMensaje("Mensaje de prueba");
        notificacion.setTipo("INFO");
        notificacion.setLeida(false);
    }

    @Test
    void testCrearNotificacion() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(notificacion);

        Notificacion result = notificacionService.crearNotificacion(1L, "Test", "Mensaje", "INFO");

        assertNotNull(result);
        assertEquals("Test", result.getTitulo());
        verify(notificacionRepository).save(any(Notificacion.class));
        verify(emailService).enviarEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testListarNoLeidas() {
        when(notificacionRepository.findByUsuarioIdAndLeidaFalse(1L)).thenReturn(List.of(notificacion));

        List<Notificacion> result = notificacionService.listarNoLeidas(1L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    void testMarcarComoLeida() {
        when(notificacionRepository.findById(1L)).thenReturn(Optional.of(notificacion));
        when(notificacionRepository.save(any(Notificacion.class))).thenReturn(notificacion);

        notificacionService.marcarComoLeida(1L);

        assertTrue(notificacion.getLeida());
        verify(notificacionRepository).save(notificacion);
    }
}
