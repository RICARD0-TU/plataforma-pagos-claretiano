package Procesos.software.gestion_pagos_educativos.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "deuda_id", nullable = false)
    @JsonIgnoreProperties({"pagos", "hibernateLazyInitializer", "handler"})
    private Deuda deuda;

    @Column(name = "monto_pagado", nullable = false)
    private BigDecimal montoPagado;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "metodo_pago")
    private String metodoPago = "EFECTIVO";

    @Column(name = "referencia_pago")
    private String referenciaPago;

    private String estado = "COMPLETADO";

    private String observaciones;

    @OneToOne(mappedBy = "pago", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"pago", "hibernateLazyInitializer", "handler"})
    private Recibo recibo;

    public Pago() {
        this.fechaPago = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Deuda getDeuda() { return deuda; }
    public void setDeuda(Deuda deuda) { this.deuda = deuda; }
    public BigDecimal getMontoPagado() { return montoPagado; }
    public void setMontoPagado(BigDecimal montoPagado) { this.montoPagado = montoPagado; }
    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public String getReferenciaPago() { return referenciaPago; }
    public void setReferenciaPago(String referenciaPago) { this.referenciaPago = referenciaPago; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    public Recibo getRecibo() { return recibo; }
    public void setRecibo(Recibo recibo) { this.recibo = recibo; }
}
