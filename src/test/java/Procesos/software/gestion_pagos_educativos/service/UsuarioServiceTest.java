package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private LogService logService;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombreCompleto("Test User");
        usuario.setEmail("test@email.com");
        usuario.setPassword("password123");
        usuario.setRol("parent");
    }

    @Test
    void testGuardarUsuario() {
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario result = usuarioService.guardar(usuario);

        assertNotNull(result);
        assertEquals("test@email.com", result.getEmail());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void testGuardarUsuarioEmailDuplicado() {
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> usuarioService.guardar(usuario));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void testBuscarPorId() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<Usuario> result = usuarioService.buscarPorId(1L);

        assertTrue(result.isPresent());
        assertEquals("Test User", result.get().getNombreCompleto());
    }

    @Test
    void testBuscarPorEmail() {
        when(usuarioRepository.findByEmail("test@email.com")).thenReturn(Optional.of(usuario));

        Optional<Usuario> result = usuarioService.buscarPorEmail("test@email.com");

        assertTrue(result.isPresent());
        assertEquals("test@email.com", result.get().getEmail());
    }

    @Test
    void testEliminarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        usuarioService.eliminar(1L);

        assertFalse(usuario.getActivo());
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void testCambiarPasswordExitoso() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("oldPass", "password123")).thenReturn(true);
        when(passwordEncoder.encode("newPass123")).thenReturn("hashedNewPass");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        assertDoesNotThrow(() -> usuarioService.cambiarPassword(1L, "oldPass", "newPass123"));
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void testCambiarPasswordIncorrecta() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("wrongPass", "password123")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> usuarioService.cambiarPassword(1L, "wrongPass", "newPass123"));
    }

    @Test
    void testCambiarPasswordCorta() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("oldPass", "password123")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> usuarioService.cambiarPassword(1L, "oldPass", "123"));
    }
}
