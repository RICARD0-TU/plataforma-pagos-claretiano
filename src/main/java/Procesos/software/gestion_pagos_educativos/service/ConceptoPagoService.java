package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.model.entity.ConceptoPago;
import Procesos.software.gestion_pagos_educativos.repository.ConceptoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConceptoPagoService {

    @Autowired
    private ConceptoPagoRepository conceptoPagoRepository;

    public List<ConceptoPago> listarTodos() {
        return conceptoPagoRepository.findAll();
    }

    public ConceptoPago buscarPorId(Long id) {
        return conceptoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Concepto no encontrado"));
    }

    public ConceptoPago guardar(ConceptoPago concepto) {
        return conceptoPagoRepository.save(concepto);
    }
}