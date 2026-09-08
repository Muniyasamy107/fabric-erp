package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "quality_inspection_reports")
public class QualityInspectionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String certificateNumber; // e.g. QC-CERT-2026-902

    private Long productionJobId;
    private String batchLotNumber; // Link to ProductionJob
    private String fabricProductName;
    private String weaveType;
    private Double standardWidthInches;

    private Double totalInspectedMeters;
    private Integer minorDefectsCount; // 1-2 point flaws
    private Integer majorDefectsCount; // 3-4 point flaws (holes, long slubs)
    private Double fourPointScore; // Calculated ASTM 4-Point Score per 100 sq yds

    // Physical Lab Test Metrics
    private Integer testedGsm;
    private Double shrinkagePercentage; // e.g. 1.5%
    private String colorFastnessRating; // e.g. 4-5 (Excellent)
    private Double tensileStrengthNewton; // e.g. 450N

    @Column(nullable = false)
    private String finalVerdict; // GRADE_A_PASS, GRADE_B_ACCEPTABLE, REJECTED_SECONDS

    private String qcInspectorName;
    private LocalDate inspectionDate;
    private String remarks;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.inspectionDate == null) this.inspectionDate = LocalDate.now();
        if (this.finalVerdict == null) this.finalVerdict = "GRADE_A_PASS";
        if (this.minorDefectsCount == null) this.minorDefectsCount = 0;
        if (this.majorDefectsCount == null) this.majorDefectsCount = 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }

    public Long getProductionJobId() { return productionJobId; }
    public void setProductionJobId(Long productionJobId) { this.productionJobId = productionJobId; }

    public String getBatchLotNumber() { return batchLotNumber; }
    public void setBatchLotNumber(String batchLotNumber) { this.batchLotNumber = batchLotNumber; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public String getWeaveType() { return weaveType; }
    public void setWeaveType(String weaveType) { this.weaveType = weaveType; }

    public Double getStandardWidthInches() { return standardWidthInches; }
    public void setStandardWidthInches(Double standardWidthInches) { this.standardWidthInches = standardWidthInches; }

    public Double getTotalInspectedMeters() { return totalInspectedMeters; }
    public void setTotalInspectedMeters(Double totalInspectedMeters) { this.totalInspectedMeters = totalInspectedMeters; }

    public Integer getMinorDefectsCount() { return minorDefectsCount; }
    public void setMinorDefectsCount(Integer minorDefectsCount) { this.minorDefectsCount = minorDefectsCount; }

    public Integer getMajorDefectsCount() { return majorDefectsCount; }
    public void setMajorDefectsCount(Integer majorDefectsCount) { this.majorDefectsCount = majorDefectsCount; }

    public Double getFourPointScore() { return fourPointScore; }
    public void setFourPointScore(Double fourPointScore) { this.fourPointScore = fourPointScore; }

    public Integer getTestedGsm() { return testedGsm; }
    public void setTestedGsm(Integer testedGsm) { this.testedGsm = testedGsm; }

    public Double getShrinkagePercentage() { return shrinkagePercentage; }
    public void setShrinkagePercentage(Double shrinkagePercentage) { this.shrinkagePercentage = shrinkagePercentage; }

    public String getColorFastnessRating() { return colorFastnessRating; }
    public void setColorFastnessRating(String colorFastnessRating) { this.colorFastnessRating = colorFastnessRating; }

    public Double getTensileStrengthNewton() { return tensileStrengthNewton; }
    public void setTensileStrengthNewton(Double tensileStrengthNewton) { this.tensileStrengthNewton = tensileStrengthNewton; }

    public String getFinalVerdict() { return finalVerdict; }
    public void setFinalVerdict(String finalVerdict) { this.finalVerdict = finalVerdict; }

    public String getQcInspectorName() { return qcInspectorName; }
    public void setQcInspectorName(String qcInspectorName) { this.qcInspectorName = qcInspectorName; }

    public LocalDate getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDate inspectionDate) { this.inspectionDate = inspectionDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}