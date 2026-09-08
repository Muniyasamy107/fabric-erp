package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fabricProductId;
    private String fabricProductName;
    private Double shippedMeters; // Bulk roll length

    @Column(precision = 10, scale = 2)
    private BigDecimal pricePerMeter;

    @Column(precision = 10, scale = 2)
    private BigDecimal lineTotal;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFabricProductId() { return fabricProductId; }
    public void setFabricProductId(Long fabricProductId) { this.fabricProductId = fabricProductId; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public Double getShippedMeters() { return shippedMeters; }
    public void setShippedMeters(Double shippedMeters) { this.shippedMeters = shippedMeters; }

    public BigDecimal getPricePerMeter() { return pricePerMeter; }
    public void setPricePerMeter(BigDecimal pricePerMeter) { this.pricePerMeter = pricePerMeter; }

    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}