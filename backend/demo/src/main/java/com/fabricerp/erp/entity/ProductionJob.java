package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_jobs")
public class ProductionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String batchNumber; // e.g. "BATCH-2026-88"

    private Long fabricProductId;
    private String fabricProductName;
    private String assignedLoomNumber; // Link to WeavingLoom
    private String masterWeaverName;

    private Double targetMeters;
    private Double producedMeters;
    private Double defectWastageMeters; // Mill scrap count

    private String fabricQualityGrade; // GRADE_A (Premium), GRADE_B, SECONDS (Rejected)

    private LocalDate startDate;
    private LocalDate targetCompletionDate;
    private String jobStatus; // QUEUED, WARPING, WEAVING, QUALITY_INSPECT, CALENDERING_FINISH, COMPLETED

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.producedMeters == null) this.producedMeters = 0.0;
        if (this.defectWastageMeters == null) this.defectWastageMeters = 0.0;
        if (this.jobStatus == null) this.jobStatus = "QUEUED";
        if (this.fabricQualityGrade == null) this.fabricQualityGrade = "GRADE_A";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Long getFabricProductId() { return fabricProductId; }
    public void setFabricProductId(Long fabricProductId) { this.fabricProductId = fabricProductId; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public String getAssignedLoomNumber() { return assignedLoomNumber; }
    public void setAssignedLoomNumber(String assignedLoomNumber) { this.assignedLoomNumber = assignedLoomNumber; }

    public String getMasterWeaverName() { return masterWeaverName; }
    public void setMasterWeaverName(String masterWeaverName) { this.masterWeaverName = masterWeaverName; }

    public Double getTargetMeters() { return targetMeters; }
    public void setTargetMeters(Double targetMeters) { this.targetMeters = targetMeters; }

    public Double getProducedMeters() { return producedMeters; }
    public void setProducedMeters(Double producedMeters) { this.producedMeters = producedMeters; }

    public Double getDefectWastageMeters() { return defectWastageMeters; }
    public void setDefectWastageMeters(Double defectWastageMeters) { this.defectWastageMeters = defectWastageMeters; }

    public String getFabricQualityGrade() { return fabricQualityGrade; }
    public void setFabricQualityGrade(String fabricQualityGrade) { this.fabricQualityGrade = fabricQualityGrade; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(LocalDate targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }

    public String getJobStatus() { return jobStatus; }
    public void setJobStatus(String jobStatus) { this.jobStatus = jobStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}