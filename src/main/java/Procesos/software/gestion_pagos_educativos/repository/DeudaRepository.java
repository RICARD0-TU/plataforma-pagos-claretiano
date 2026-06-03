package Procesos.software.gestion_pagos_educativos.repository;

import Procesos.software.gestion_pagos_educativos.model.entity.Deuda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DeudaRepository extends JpaRepository<Deuda, Long> {
    List<Deuda> findByEstudianteId(Long estudianteId);

    List<Deuda> findByEstudianteIdAndEstado(Long estudianteId, String estado);

    List<Deuda> findByEstado(String estado);

    List<Deuda> findByEstadoNot(String estado);

    List<Deuda> findByFechaVencimientoBeforeAndEstadoNot(LocalDate fecha, String estado);

    @Query("SELECT SUM(d.saldoPendiente) FROM Deuda d WHERE d.estudiante.id = :estudianteId")
    BigDecimal sumSaldoPendienteByEstudiante(@Param("estudianteId") Long estudianteId);
}
