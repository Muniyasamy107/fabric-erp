package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weaver_wage_entries")
public class WeaverWageEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productionJobId;
    private String batchNumber; // e.g. LOT-8832
    private String fabricProductName;

    @Column(nullable = false)
    private String weaverName; // Machine Operator Name

    private Double totalWovenMeters;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal ratePerMeter; // Piece-rate wage

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPayableWage;

    private String paymentStatus; // PENDING, PAID
    private LocalDate disbursementDate;
    private String voucherNumber; // e.g. VOUCH-FACTORY-01

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.paymentStatus == null) this.paymentStatus = "PENDING";
        if (this.totalPayableWage == null && this.ratePerMeter != null && this.totalWovenMeters != null) {
            this.totalPayableWage = this.ratePerMeter.multiply(BigDecimal.valueOf(this.totalWovenMeters));
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductionJobId() { return productionJobId; }
    public void setProductionJobId(Long productionJobId) { this.productionJobId = productionJobId; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public String getWeaverName() { return weaverName; }
    public void setWeaverName(String weaverName) { this.weaverName = weaverName; }

    public Double getTotalWovenMeters() { return totalWovenMeters; }
    public void setTotalWovenMeters(Double totalWovenMeters) { this.totalWovenMeters = totalWovenMeters; }

    public BigDecimal getRatePerMeter() { return ratePerMeter; }
    public void setRatePerMeter(BigDecimal ratePerMeter) { this.ratePerMeter = ratePerMeter; }

    public BigDecimal getTotalPayableWage() { return totalPayableWage; }
    public void setTotalPayableWage(BigDecimal totalPayableWage) { this.totalPayableWage = totalPayableWage; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDate getDisbursementDate() { return disbursementDate; }
    public void setDisbursementDate(LocalDate disbursementDate) { this.disbursementDate = disbursementDate; }

    public String getVoucherNumber() { return voucherNumber; }
    public void setVoucherNumber(String voucherNumber) { this.voucherNumber = voucherNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}