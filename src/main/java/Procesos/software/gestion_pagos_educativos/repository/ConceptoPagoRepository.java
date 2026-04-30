package Procesos.software.gestion_pagos_educativos.repository;

import Procesos.software.gestion_pagos_educativos.model.entity.ConceptoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConceptoPagoRepository extends JpaRepository<ConceptoPago, Long> {
    List<ConceptoPago> findByActivoTrue();
}
