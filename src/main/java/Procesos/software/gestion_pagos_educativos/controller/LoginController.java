package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.config.JwtUtil;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "El correo es obligatorio"));
        }
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "La contraseña es obligatoria"));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            if (!usuario.getActivo()) {
                return ResponseEntity.status(401).body(Map.of("success", false, "error", "Usuario inactivo"));
            }

            boolean passwordMatch = passwordEncoder.matches(password, usuario.getPassword());
            // Fallback for legacy plain-text passwords
            if (!passwordMatch) {
                passwordMatch = usuario.getPassword().equals(password);
                if (passwordMatch) {
                    usuario.setPassword(passwordEncoder.encode(password));
                    usuarioRepository.save(usuario);
                }
            }

            if (passwordMatch) {
                String token = jwtUtil.generateToken(usuario.getId(), usuario.getEmail(), usuario.getRol());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("id", usuario.getId());
                response.put("nombre", usuario.getNombreCompleto());
                response.put("email", usuario.getEmail());
                response.put("rol", usuario.getRol());
                response.put("token", token);

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body(Map.of("success", false, "error", "Credenciales inválidas"));
    }
}
