package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fabric_roll_packings")
public class FabricRollPacking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String rollBarcodeNumber; // e.g. "ROLL-LOT88-001"

    private Long productionJobId;
    private String batchLotNumber; // Link to ProductionJob
    private String qualityCode; // Link to FabricProduct
    private String fabricProductName;
    private String weaveType;
    private Double fabricWidthInches;

    @Column(nullable = false)
    private Double netLengthMeters; // Exact meter length of this single roll (e.g. 52.4m)

    private Double grossWeightKg; // Roll weight including cardboard core
    private Double netWeightKg;

    private String qualityGrade; // GRADE_A, GRADE_B, SECONDS
    private String warehouseBin; // e.g. "Warehouse Bay C - Pallet 04"

    private String packingStatus; // IN_WAREHOUSE, ALLOCATED_FOR_DISPATCH, DISPATCHED

    private String balePackageNumber; // e.g. "BALE-EXP-01"
    private String packedByOperatorName;
    private LocalDate packingDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.packingDate == null) this.packingDate = LocalDate.now();
        if (this.packingStatus == null) this.packingStatus = "IN_WAREHOUSE";
        if (this.qualityGrade == null) this.qualityGrade = "GRADE_A";
        if (this.warehouseBin == null) this.warehouseBin = "Finished Bay 01";
        if (this.balePackageNumber == null) this.balePackageNumber = "BALE-LOT-01";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRollBarcodeNumber() { return rollBarcodeNumber; }
    public void setRollBarcodeNumber(String rollBarcodeNumber) { this.rollBarcodeNumber = rollBarcodeNumber; }

    public Long getProductionJobId() { return productionJobId; }
    public void setProductionJobId(Long productionJobId) { this.productionJobId = productionJobId; }

    public String getBatchLotNumber() { return batchLotNumber; }
    public void setBatchLotNumber(String batchLotNumber) { this.batchLotNumber = batchLotNumber; }

    public String getQualityCode() { return qualityCode; }
    public void setQualityCode(String qualityCode) { this.qualityCode = qualityCode; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public String getWeaveType() { return weaveType; }
    public void setWeaveType(String weaveType) { this.weaveType = weaveType; }

    public Double getFabricWidthInches() { return fabricWidthInches; }
    public void setFabricWidthInches(Double fabricWidthInches) { this.fabricWidthInches = fabricWidthInches; }

    public Double getNetLengthMeters() { return netLengthMeters; }
    public void setNetLengthMeters(Double netLengthMeters) { this.netLengthMeters = netLengthMeters; }

    public Double getGrossWeightKg() { return grossWeightKg; }
    public void setGrossWeightKg(Double grossWeightKg) { this.grossWeightKg = grossWeightKg; }

    public Double getNetWeightKg() { return netWeightKg; }
    public void setNetWeightKg(Double netWeightKg) { this.netWeightKg = netWeightKg; }

    public String getQualityGrade() { return qualityGrade; }
    public void setQualityGrade(String qualityGrade) { this.qualityGrade = qualityGrade; }

    public String getWarehouseBin() { return warehouseBin; }
    public void setWarehouseBin(String warehouseBin) { this.warehouseBin = warehouseBin; }

    public String getPackingStatus() { return packingStatus; }
    public void setPackingStatus(String packingStatus) { this.packingStatus = packingStatus; }

    public String getBalePackageNumber() { return balePackageNumber; }
    public void setBalePackageNumber(String balePackageNumber) { this.balePackageNumber = balePackageNumber; }

    public String getPackedByOperatorName() { return packedByOperatorName; }
    public void setPackedByOperatorName(String packedByOperatorName) { this.packedByOperatorName = packedByOperatorName; }

    public LocalDate getPackingDate() { return packingDate; }
    public void setPackingDate(LocalDate packingDate) { this.packingDate = packingDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}