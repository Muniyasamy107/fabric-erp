package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "yarn_inventory")
public class YarnInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String yarnLotNumber; // e.g. YARN-LOT-8821

    @Column(nullable = false)
    private String yarnCountSpecification; // e.g. "Cotton 80/1 Ne Combed", "Mulberry Silk 20/22D"

    private String fiberType; // Pure Cotton, Mulberry Silk, Cashmere Wool, Linen Flax, Viscose
    private String yarnOriginMill; // Spinning Mill Supplier Name

    private Double totalWeightKg; // Net stock weight in Kilograms
    private Integer totalBagsOrBoxes; // Number of yarn cartons/bags
    private Double conesPerBag;

    @Column(precision = 10, scale = 2)
    private BigDecimal purchasePricePerKg;

    private String warehouseRackBay; // e.g. "Yarn Bay 03 - Shelf B"
    private String yarnStatus; // RAW_GREIGE, DYED_READY, IN_WARPING_CREEL

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.totalWeightKg == null) this.totalWeightKg = 0.0;
        if (this.yarnStatus == null) this.yarnStatus = "RAW_GREIGE";
        if (this.warehouseRackBay == null) this.warehouseRackBay = "Yarn Bay 01";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getYarnLotNumber() { return yarnLotNumber; }
    public void setYarnLotNumber(String yarnLotNumber) { this.yarnLotNumber = yarnLotNumber; }

    public String getYarnCountSpecification() { return yarnCountSpecification; }
    public void setYarnCountSpecification(String yarnCountSpecification) { this.yarnCountSpecification = yarnCountSpecification; }

    public String getFiberType() { return fiberType; }
    public void setFiberType(String fiberType) { this.fiberType = fiberType; }

    public String getYarnOriginMill() { return yarnOriginMill; }
    public void setYarnOriginMill(String yarnOriginMill) { this.yarnOriginMill = yarnOriginMill; }

    public Double getTotalWeightKg() { return totalWeightKg; }
    public void setTotalWeightKg(Double totalWeightKg) { this.totalWeightKg = totalWeightKg; }

    public Integer getTotalBagsOrBoxes() { return totalBagsOrBoxes; }
    public void setTotalBagsOrBoxes(Integer totalBagsOrBoxes) { this.totalBagsOrBoxes = totalBagsOrBoxes; }

    public Double getConesPerBag() { return conesPerBag; }
    public void setConesPerBag(Double conesPerBag) { this.conesPerBag = conesPerBag; }

    public BigDecimal getPurchasePricePerKg() { return purchasePricePerKg; }
    public void setPurchasePricePerKg(BigDecimal purchasePricePerKg) { this.purchasePricePerKg = purchasePricePerKg; }

    public String getWarehouseRackBay() { return warehouseRackBay; }
    public void setWarehouseRackBay(String warehouseRackBay) { this.warehouseRackBay = warehouseRackBay; }

    public String getYarnStatus() { return yarnStatus; }
    public void setYarnStatus(String yarnStatus) { this.yarnStatus = yarnStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}