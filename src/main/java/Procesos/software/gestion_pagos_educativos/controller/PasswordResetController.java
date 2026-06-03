package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.PasswordResetToken;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.PasswordResetTokenRepository;
import Procesos.software.gestion_pagos_educativos.repository.UsuarioRepository;
import Procesos.software.gestion_pagos_educativos.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/password-reset")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LogService logService;

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El correo es obligatorio"));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("mensaje", "Si el correo existe, recibirás un enlace de recuperación"));
        }

        Usuario usuario = usuarioOpt.get();
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario.getId(), 30);

        tokenRepository.save(resetToken);

        logService.registrarLog("SOLICITAR_RESET_PASSWORD", "Usuario", usuario.getId(),
                "Solicitud de recuperación de contraseña");

        // En producción enviar por email
        System.out.println("=== ENLACE DE RECUPERACIÓN ===");
        System.out.println("Token: " + token);
        System.out.println("Link: http://localhost:8080/reset-password?token=" + token);
        System.out.println("================================");

        return ResponseEntity.ok(Map.of(
                "mensaje", "Si el correo existe, recibirás un enlace de recuperación",
                "token", token
        ));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<?> restablecer(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String nuevaPassword = body.get("nuevaPassword");

        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token requerido"));
        }
        if (nuevaPassword == null || nuevaPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 8 caracteres"));
        }

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token inválido"));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isExpired()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El token ha expirado"));
        }
        if (resetToken.isUsed()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El token ya ha sido usado"));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(resetToken.getUsuarioId());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        logService.registrarLog("RESTABLECER_PASSWORD", "Usuario", usuario.getId(),
                "Contraseña restablecida exitosamente");

        return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida exitosamente"));
    }
}
