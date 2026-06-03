package Procesos.software.gestion_pagos_educativos.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import Procesos.software.gestion_pagos_educativos.model.entity.Pago;
import Procesos.software.gestion_pagos_educativos.model.entity.Recibo;
import Procesos.software.gestion_pagos_educativos.repository.ReciboRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    @Autowired
    private ReciboRepository reciboRepository;

    public byte[] generarReciboPdf(Pago pago) {
        Recibo recibo = pago.getRecibo();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            document.add(new Paragraph("COLEGIO CLARETIANO")
                    .setBold().setFontSize(18).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            document.add(new Paragraph("Sistema de Gestión de Pagos Educativos")
                    .setFontSize(12).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            document.add(new Paragraph("RECIBO DE PAGO")
                    .setBold().setFontSize(16).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            document.add(new Paragraph(""));

            document.add(new Paragraph("Recibo N°: " + recibo.getNumeroRecibo()));
            document.add(new Paragraph("Fecha de emisión: " +
                    recibo.getFechaEmision().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));
            document.add(new Paragraph(""));

            document.add(new Paragraph("DATOS DEL ESTUDIANTE").setBold());
            document.add(new Paragraph("Nombre: " + pago.getDeuda().getEstudiante().getNombreCompleto()));
            document.add(new Paragraph("Grado: " + pago.getDeuda().getEstudiante().getGrado() +
                    " - " + pago.getDeuda().getEstudiante().getSeccion()));
            document.add(new Paragraph("Código: " + pago.getDeuda().getEstudiante().getCodigoEstudiante()));
            document.add(new Paragraph(""));

            document.add(new Paragraph("DETALLE DEL PAGO").setBold());
            Table table = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2}));
            table.addHeaderCell("Concepto");
            table.addHeaderCell("Monto Total");
            table.addHeaderCell("Monto Pagado");

            table.addCell(pago.getDeuda().getConceptoPago().getNombre());
            table.addCell(String.format("S/ %.2f", pago.getDeuda().getMontoTotal()));
            table.addCell(String.format("S/ %.2f", pago.getMontoPagado()));

            document.add(table);
            document.add(new Paragraph(""));

            document.add(new Paragraph(String.format("Monto Pagado: S/ %.2f", pago.getMontoPagado()))
                    .setBold().setFontSize(14));
            document.add(new Paragraph("Método de Pago: " + pago.getMetodoPago()));
            document.add(new Paragraph("Referencia: " + (pago.getReferenciaPago() != null ? pago.getReferenciaPago() : "-")));
            document.add(new Paragraph(""));

            document.add(new Paragraph("Código de Operación: " + recibo.getNumeroRecibo()));
            document.add(new Paragraph(""));

            document.add(new Paragraph("¡Gracias por su pago!")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));

            document.close();

            recibo.setPdfGenerado(true);
            reciboRepository.save(recibo);

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el PDF: " + e.getMessage());
        }
    }
}
