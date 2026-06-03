package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.Log;
import Procesos.software.gestion_pagos_educativos.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    @Transactional
    public void registrarLog(String accion, String entidad, Long entidadId, String detalles) {
        Log log = new Log();
        log.setAccion(accion);
        log.setEntidad(entidad);
        log.setEntidadId(entidadId);
        log.setDetalles(detalles);
        logRepository.save(log);
    }
}
