package Procesos.software.gestion_pagos_educativos.repository;

import Procesos.software.gestion_pagos_educativos.model.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    // Métodos de consulta personalizados si se necesitan en el futuro
}
