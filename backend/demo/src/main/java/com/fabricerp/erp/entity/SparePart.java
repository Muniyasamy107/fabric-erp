package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "spare_parts")
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String partSku; // e.g. "SPARE-RAPIER-01"

    @Column(nullable = false)
    private String partName; // e.g. "Carbon Fiber Rapier Tape 190cm"

    private String category; // LOOM_MECHANICAL, ELECTRICAL_DRIVE, STENTER_CHAIN, DYEING_VALVES
    private Integer currentStockQty;
    private Integer minReorderAlertQty;

    @Column(precision = 10, scale = 2)
    private BigDecimal unitCost;

    private String storageBinLocation; // e.g. "Maintenance Bay 02 - Rack 3"
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.currentStockQty == null) this.currentStockQty = 0;
        if (this.minReorderAlertQty == null) this.minReorderAlertQty = 5;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPartSku() { return partSku; }
    public void setPartSku(String partSku) { this.partSku = partSku; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getCurrentStockQty() { return currentStockQty; }
    public void setCurrentStockQty(Integer currentStockQty) { this.currentStockQty = currentStockQty; }

    public Integer getMinReorderAlertQty() { return minReorderAlertQty; }
    public void setMinReorderAlertQty(Integer minReorderAlertQty) { this.minReorderAlertQty = minReorderAlertQty; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public String getStorageBinLocation() { return storageBinLocation; }
    public void setStorageBinLocation(String storageBinLocation) { this.storageBinLocation = storageBinLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}