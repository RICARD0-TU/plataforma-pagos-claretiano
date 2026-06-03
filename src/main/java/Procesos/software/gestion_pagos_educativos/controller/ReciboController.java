package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.model.entity.Pago;
import Procesos.software.gestion_pagos_educativos.model.entity.Recibo;
import Procesos.software.gestion_pagos_educativos.repository.PagoRepository;
import Procesos.software.gestion_pagos_educativos.repository.ReciboRepository;
import Procesos.software.gestion_pagos_educativos.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/recibos")
@CrossOrigin(origins = "*")
public class ReciboController {

    @Autowired
    private ReciboRepository reciboRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private PdfService pdfService;

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerRecibo(@PathVariable Long id) {
        Optional<Recibo> recibo = reciboRepository.findById(id);
        if (recibo.isPresent()) {
            return ResponseEntity.ok(recibo.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Long id) {
        Optional<Recibo> reciboOpt = reciboRepository.findById(id);
        if (reciboOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Recibo recibo = reciboOpt.get();
        Optional<Pago> pagoOpt = pagoRepository.findById(recibo.getPago().getId());
        if (pagoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = pdfService.generarReciboPdf(pagoOpt.get());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=recibo_" + recibo.getNumeroRecibo() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/pago/{pagoId}")
    public ResponseEntity<?> obtenerReciboPorPago(@PathVariable Long pagoId) {
        Optional<Pago> pagoOpt = pagoRepository.findById(pagoId);
        if (pagoOpt.isPresent() && pagoOpt.get().getRecibo() != null) {
            return ResponseEntity.ok(pagoOpt.get().getRecibo());
        }
        return ResponseEntity.notFound().build();
    }
}
