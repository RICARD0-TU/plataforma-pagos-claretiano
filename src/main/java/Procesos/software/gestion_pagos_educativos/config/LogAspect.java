package Procesos.software.gestion_pagos_educativos.config;

import Procesos.software.gestion_pagos_educativos.model.entity.Usuario;
import Procesos.software.gestion_pagos_educativos.service.LogService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LogAspect {

    @Autowired
    private LogService logService;

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Usuario) {
            return ((Usuario) auth.getPrincipal()).getEmail();
        }
        return "anonymous";
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.UsuarioController.crearUsuario(..))")
    public void logCrearUsuario(JoinPoint jp) {
        logService.registrarLog("CREAR_USUARIO", "Usuario", null,
                "Creación de usuario por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.UsuarioController.actualizarUsuario(..))")
    public void logActualizarUsuario(JoinPoint jp) {
        Object[] args = jp.getArgs();
        logService.registrarLog("EDITAR_USUARIO", "Usuario", (Long) args[0],
                "Actualización por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.UsuarioController.eliminarUsuario(..))")
    public void logEliminarUsuario(JoinPoint jp) {
        Object[] args = jp.getArgs();
        logService.registrarLog("ELIMINAR_USUARIO", "Usuario", (Long) args[0],
                "Eliminación por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.EstudianteController.crearEstudiante(..))")
    public void logCrearEstudiante() {
        logService.registrarLog("CREAR_ESTUDIANTE", "Estudiante", null,
                "Creación por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.EstudianteController.actualizarEstudiante(..))")
    public void logActualizarEstudiante(JoinPoint jp) {
        Object[] args = jp.getArgs();
        logService.registrarLog("EDITAR_ESTUDIANTE", "Estudiante", (Long) args[0],
                "Actualización por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.EstudianteController.eliminarEstudiante(..))")
    public void logEliminarEstudiante(JoinPoint jp) {
        Object[] args = jp.getArgs();
        logService.registrarLog("ELIMINAR_ESTUDIANTE", "Estudiante", (Long) args[0],
                "Eliminación por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.PagoController.realizarPago(..))")
    public void logRealizarPago() {
        logService.registrarLog("REALIZAR_PAGO", "Pago", null,
                "Pago realizado por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.DeudaController.registrarDeuda(..))")
    public void logRegistrarDeuda() {
        logService.registrarLog("REGISTRAR_DEUDA", "Deuda", null,
                "Deuda registrada por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.ConceptoPagoController.crearConcepto(..))")
    public void logCrearConcepto() {
        logService.registrarLog("CREAR_CONCEPTO", "ConceptoPago", null,
                "Creación por " + getCurrentUserEmail());
    }

    @AfterReturning("execution(* Procesos.software.gestion_pagos_educativos.controller.ReporteController.*(..))")
    public void logReportes() {
        logService.registrarLog("CONSULTAR_REPORTE", "Reporte", null,
                "Reporte consultado por " + getCurrentUserEmail());
    }
}
