package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LogService logService;

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional
    public Usuario guardar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }
        if (usuario.getPassword() != null && !usuario.getPassword().startsWith("$2a$")) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        usuario.setRol(usuario.getRol() != null ? usuario.getRol() : "parent");
        Usuario saved = usuarioRepository.save(usuario);
        logService.registrarLog("CREAR", "Usuario", saved.getId(), "Creación de usuario: " + saved.getEmail());
        return saved;
    }

    @Transactional
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombreCompleto(usuarioActualizado.getNombreCompleto());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setDireccion(usuarioActualizado.getDireccion());

        if (usuarioActualizado.getEmail() != null
                && !usuarioActualizado.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(usuarioActualizado.getEmail())) {
                throw new RuntimeException("Ya existe un usuario con ese email");
            }
            usuario.setEmail(usuarioActualizado.getEmail());
        }

        Usuario saved = usuarioRepository.save(usuario);
        logService.registrarLog("EDITAR", "Usuario", id, "Actualización de datos");
        return saved;
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
        logService.registrarLog("ELIMINAR", "Usuario", id, "Desactivación de usuario");
    }

    @Transactional
    public void cambiarPassword(Long id, String passwordActual, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }

        if (nuevaPassword == null || nuevaPassword.length() < 8) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 8 caracteres");
        }

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
        logService.registrarLog("CAMBIAR_PASSWORD", "Usuario", id, "Cambio de contraseña");
    }
}
