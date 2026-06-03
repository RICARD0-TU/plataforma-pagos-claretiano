package Procesos.software.gestion_pagos_educativos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${MAIL_USERNAME:}")
    private String fromEmail;

    public void enviarEmail(String to, String subject, String body) {
        if (mailSender == null || fromEmail == null || fromEmail.isBlank()) {
            System.out.println("=== EMAIL (simulación) ===");
            System.out.println("Para: " + to);
            System.out.println("Asunto: " + subject);
            System.out.println("Cuerpo: " + body);
            System.out.println("===========================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom(fromEmail);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error al enviar email a " + to + ": " + e.getMessage());
        }
    }

    public void enviarNotificacionPago(String to, String nombreEstudiante, String monto, String recibo) {
        String subject = "Pago Registrado - Colegio Claretiano";
        String body = String.format("""
                Estimado padre de familia,

                Se ha registrado un pago exitosamente.

                Estudiante: %s
                Monto: S/ %s
                N° Recibo: %s

                Gracias por su puntualidad.

                Colegio Claretiano - Sistema de Pagos Educativos
                """, nombreEstudiante, monto, recibo);
        enviarEmail(to, subject, body);
    }

    public void enviarNotificacionVencimiento(String to, String nombreEstudiante, String concepto,
                                              String monto, String fechaVencimiento) {
        String subject = "Deuda Próxima a Vencer - Colegio Claretiano";
        String body = String.format("""
                Estimado padre de familia,

                Le recordamos que tiene una deuda próxima a vencer.

                Estudiante: %s
                Concepto: %s
                Monto: S/ %s
                Fecha de vencimiento: %s

                Realice su pago a tiempo para evitar cargos adicionales.

                Colegio Claretiano - Sistema de Pagos Educativos
                """, nombreEstudiante, concepto, monto, fechaVencimiento);
        enviarEmail(to, subject, body);
    }

    public void enviarRecuperacionContrasena(String to, String token) {
        String subject = "Recuperación de Contraseña - Colegio Claretiano";
        String body = String.format("""
                Estimado usuario,

                Ha solicitado la recuperación de su contraseña.

                Su token de recuperación es: %s

                Este token expira en 30 minutos.
                Si no solicitó este cambio, ignore este mensaje.

                Colegio Claretiano - Sistema de Pagos Educativos
                """, token);
        enviarEmail(to, subject, body);
    }
}
