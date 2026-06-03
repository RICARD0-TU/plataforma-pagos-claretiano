package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Estudiante;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.EstudianteRepository;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<Estudiante> listarTodos() {
        return estudianteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Estudiante> buscarPorId(Long id) {
        return estudianteRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Estudiante> listarPorUsuario(Long usuarioId) {
        return estudianteRepository.findByUsuarioId(usuarioId);
    }

    @Transactional
    public Estudiante guardar(Estudiante estudiante) {
        if (estudiante.getUsuario() != null && estudiante.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(estudiante.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            estudiante.setUsuario(usuario);
        }

        if (estudiante.getCodigoEstudiante() != null) {
            estudianteRepository.findByCodigoEstudiante(estudiante.getCodigoEstudiante())
                    .ifPresent(e -> {
                        throw new RuntimeException("Ya existe un estudiante con ese código");
                    });
        }

        return estudianteRepository.save(estudiante);
    }

    @Transactional
    public Estudiante actualizar(Long id, Estudiante estudianteActualizado) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        estudiante.setNombreCompleto(estudianteActualizado.getNombreCompleto());
        estudiante.setGrado(estudianteActualizado.getGrado());
        estudiante.setSeccion(estudianteActualizado.getSeccion());

        if (estudianteActualizado.getCodigoEstudiante() != null) {
            estudiante.setCodigoEstudiante(estudianteActualizado.getCodigoEstudiante());
        }

        return estudianteRepository.save(estudiante);
    }

    @Transactional
    public void eliminar(Long id) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        estudiante.setActivo(false);
        estudianteRepository.save(estudiante);
    }
}
