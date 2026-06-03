package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Estudiante;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.EstudianteRepository;
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
class EstudianteServiceTest {

    @Mock
    private EstudianteRepository estudianteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private EstudianteService estudianteService;

    private Estudiante estudiante;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombreCompleto("Padre Test");

        estudiante = new Estudiante();
        estudiante.setId(1L);
        estudiante.setNombreCompleto("Estudiante Test");
        estudiante.setUsuario(usuario);
        estudiante.setGrado("5to");
        estudiante.setSeccion("A");
    }

    @Test
    void testListarTodos() {
        when(estudianteRepository.findAll()).thenReturn(List.of(estudiante));
        assertEquals(1, estudianteService.listarTodos().size());
    }

    @Test
    void testBuscarPorId() {
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        Optional<Estudiante> result = estudianteService.buscarPorId(1L);
        assertTrue(result.isPresent());
        assertEquals("Estudiante Test", result.get().getNombreCompleto());
    }

    @Test
    void testListarPorUsuario() {
        when(estudianteRepository.findByUsuarioId(1L)).thenReturn(List.of(estudiante));
        assertEquals(1, estudianteService.listarPorUsuario(1L).size());
    }

    @Test
    void testGuardar() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(estudianteRepository.save(any(Estudiante.class))).thenReturn(estudiante);
        Estudiante result = estudianteService.guardar(estudiante);
        assertNotNull(result);
        assertEquals("Estudiante Test", result.getNombreCompleto());
    }

    @Test
    void testEliminar() {
        when(estudianteRepository.findById(1L)).thenReturn(Optional.of(estudiante));
        when(estudianteRepository.save(any(Estudiante.class))).thenReturn(estudiante);
        estudianteService.eliminar(1L);
        assertFalse(estudiante.getActivo());
        verify(estudianteRepository).save(estudiante);
    }

    @Test
    void testEliminarNotFound() {
        when(estudianteRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> estudianteService.eliminar(999L));
    }
}
