package Procesos.software.gestion_pagos_educativos.repository;

import Procesos.software.gestion_pagos_educativos.model.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdAndLeidaFalse(Long usuarioId);

    List<Notificacion> findByUsuarioIdOrderByFechaEnvioDesc(Long usuarioId);
}
