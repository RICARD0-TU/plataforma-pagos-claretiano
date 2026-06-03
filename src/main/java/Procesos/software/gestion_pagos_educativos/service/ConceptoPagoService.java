package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.ConceptoPago;
import Procesos.software.gestion_pagos_educativos.repository.ConceptoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ConceptoPagoService {

    @Autowired
    private ConceptoPagoRepository repository;

    @Transactional(readOnly = true)
    public List<ConceptoPago> listarTodos() {
        return repository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Optional<ConceptoPago> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public ConceptoPago guardar(ConceptoPago concepto) {
        return repository.save(concepto);
    }
}
