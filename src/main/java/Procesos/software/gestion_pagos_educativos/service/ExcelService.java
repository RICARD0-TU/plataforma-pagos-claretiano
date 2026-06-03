package Procesos.software.gestion_pagos_educativos.service;

import Procesos.software.gestion_pagos_educativos.dto.ReporteEstadoCuentaDTO;
import Procesos.software.gestion_pagos_educativos.dto.ReportePagosDTO;
import Procesos.software.gestion_pagos_educativos.model.entity.Deuda;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelService {

    public byte[] exportarReportePagos(List<ReportePagosDTO> pagos) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Reporte de Pagos");
            CellStyle headerStyle = crearEstiloHeader(workbook);

            String[] headers = {"Fecha", "Estudiante", "Concepto", "Monto", "Método", "Recibo"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (ReportePagosDTO pago : pagos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(
                        pago.getFechaPago().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                row.createCell(1).setCellValue(pago.getEstudiante());
                row.createCell(2).setCellValue(pago.getConcepto());
                row.createCell(3).setCellValue(pago.getMonto().doubleValue());
                row.createCell(4).setCellValue(pago.getMetodoPago());
                row.createCell(5).setCellValue(pago.getNumeroRecibo());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar Excel: " + e.getMessage());
        }
    }

    public byte[] exportarEstadoCuenta(ReporteEstadoCuentaDTO estadoCuenta) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Estado de Cuenta");
            CellStyle headerStyle = crearEstiloHeader(workbook);

            Row titleRow = sheet.createRow(0);
            titleRow.createCell(0).setCellValue("Estado de Cuenta - " + estadoCuenta.getEstudianteNombre());

            Row gradoRow = sheet.createRow(1);
            gradoRow.createCell(0).setCellValue("Grado: " + estadoCuenta.getGrado());

            Row summaryRow = sheet.createRow(3);
            summaryRow.createCell(0).setCellValue("Total Deuda: S/ " + estadoCuenta.getTotalDeuda());
            summaryRow.createCell(1).setCellValue("Total Pagado: S/ " + estadoCuenta.getTotalPagado());
            summaryRow.createCell(2).setCellValue("Saldo Pendiente: S/ " + estadoCuenta.getSaldoPendiente());

            String[] headers = {"Concepto", "Monto Total", "Monto Pagado", "Saldo", "Vencimiento", "Estado"};
            Row headerRow = sheet.createRow(5);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 6;
            for (var deuda : estadoCuenta.getDeudas()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(deuda.getConcepto());
                row.createCell(1).setCellValue(deuda.getMontoTotal().doubleValue());
                row.createCell(2).setCellValue(deuda.getMontoPagado().doubleValue());
                row.createCell(3).setCellValue(deuda.getSaldo().doubleValue());
                row.createCell(4).setCellValue(deuda.getFechaVencimiento().toString());
                row.createCell(5).setCellValue(deuda.getEstado());
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar Excel: " + e.getMessage());
        }
    }

    public byte[] exportarDeudasMorosas(List<Deuda> deudas) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Deudas Morosas");
            CellStyle headerStyle = crearEstiloHeader(workbook);

            String[] headers = {"ID", "Estudiante", "Concepto", "Monto Total", "Saldo", "Vencimiento", "Estado"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (Deuda d : deudas) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(d.getId());
                row.createCell(1).setCellValue(d.getEstudiante().getNombreCompleto());
                row.createCell(2).setCellValue(d.getConceptoPago().getNombre());
                row.createCell(3).setCellValue(d.getMontoTotal().doubleValue());
                row.createCell(4).setCellValue(d.getSaldoPendiente().doubleValue());
                row.createCell(5).setCellValue(d.getFechaVencimiento().toString());
                row.createCell(6).setCellValue(d.getEstado());
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar Excel: " + e.getMessage());
        }
    }

    private CellStyle crearEstiloHeader(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }
}
