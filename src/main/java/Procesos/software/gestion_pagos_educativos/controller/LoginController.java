// LoginController.java
package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // ✅ VERIFICAR LA CONTRASEÑA
            if (usuario.getActivo() && usuario.getPassword() != null && usuario.getPassword().equals(password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("id", usuario.getId());
                response.put("nombre", usuario.getNombreCompleto());
                response.put("email", usuario.getEmail());
                response.put("rol", usuario.getRol());
                response.put("token", generarTokenSimple(usuario));
                response.put("password", usuario.getPassword()); // solo para debug

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body(Map.of("success", false, "error", "Credenciales inválidas"));
    }

    private String generarTokenSimple(Usuario usuario) {
        return java.util.Base64.getEncoder().encodeToString(
                (usuario.getId() + ":" + usuario.getEmail() + ":" + System.currentTimeMillis()).getBytes());
    }
}