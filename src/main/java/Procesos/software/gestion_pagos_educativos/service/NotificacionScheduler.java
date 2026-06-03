package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Deuda;
import Procesos.software.gestion_pagos_educativos.model.entity.Estudiante;
import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.repository.DeudaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@EnableScheduling
public class NotificacionScheduler {

    @Autowired
    private DeudaRepository deudaRepository;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private EmailService emailService;

    // Ejecutar todos los días a las 8:00 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void verificarDeudasProximasAVencer() {
        System.out.println("=== Verificando deudas próximas a vencer ===");
        LocalDate hoy = LocalDate.now();
        LocalDate en7Dias = hoy.plusDays(7);

        List<Deuda> deudas = deudaRepository.findByEstadoNot("PAGADO");
        for (Deuda deuda : deudas) {
            if (deuda.getFechaVencimiento() != null) {
                long diasRestantes = ChronoUnit.DAYS.between(hoy, deuda.getFechaVencimiento());

                if (diasRestantes == 7 || diasRestantes == 3 || diasRestantes == 1) {
                    Estudiante estudiante = deuda.getEstudiante();
                    Usuario padre = estudiante.getUsuario();

                    String titulo = "Deuda próxima a vencer";
                    String mensaje = String.format(
                            "La deuda de %s por concepto de %s vencerá en %d días (S/ %.2f)",
                            estudiante.getNombreCompleto(),
                            deuda.getConceptoPago().getNombre(),
                            diasRestantes,
                            deuda.getSaldoPendiente()
                    );

                    notificacionService.crearNotificacion(padre.getId(), titulo, mensaje, "VENCIMIENTO");
                    emailService.enviarNotificacionVencimiento(
                            padre.getEmail(),
                            estudiante.getNombreCompleto(),
                            deuda.getConceptoPago().getNombre(),
                            String.format("%.2f", deuda.getSaldoPendiente()),
                            deuda.getFechaVencimiento().toString()
                    );
                }
            }
        }
    }

    // Ejecutar todos los días a las 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void verificarDeudasVencidas() {
        System.out.println("=== Verificando deudas vencidas ===");
        LocalDate hoy = LocalDate.now();

        List<Deuda> deudasVencidas = deudaRepository.findByFechaVencimientoBeforeAndEstadoNot(hoy, "PAGADO");
        for (Deuda deuda : deudasVencidas) {
            if ("PENDIENTE".equals(deuda.getEstado()) && deuda.getFechaVencimiento().isBefore(hoy)) {
                deuda.setEstado("VENCIDO");
                deudaRepository.save(deuda);

                Estudiante estudiante = deuda.getEstudiante();
                Usuario padre = estudiante.getUsuario();

                String titulo = "Deuda vencida";
                String mensaje = String.format(
                        "La deuda de %s por concepto de %s (S/ %.2f) ha vencido. Regularice su pago.",
                        estudiante.getNombreCompleto(),
                        deuda.getConceptoPago().getNombre(),
                        deuda.getSaldoPendiente()
                );

                notificacionService.crearNotificacion(padre.getId(), titulo, mensaje, "VENCIMIENTO");
            }
        }
    }
}
