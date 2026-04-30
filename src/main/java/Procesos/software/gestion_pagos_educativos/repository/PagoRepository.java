package Procesos.software.gestion_pagos_educativos.repository;

import Procesos.software.gestion_pagos_educativos.model.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByDeudaId(Long deudaId);

    List<Pago> findByFechaPagoBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT SUM(p.montoPagado) FROM Pago p WHERE p.deuda.id = :deudaId")
    BigDecimal sumMontoPagadoByDeuda(@Param("deudaId") Long deudaId);
}
