package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "production_plans")
public class ProductionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String planNumber; // e.g. "PLAN-2026-9021"

    @Column(nullable = false)
    private String orderReferenceNumber; // Linked Wholesale Order / Export Contract No

    @Column(nullable = false)
    private String targetClientName; // e.g. "Armani Group Milan"

    private String fabricProductName;
    private String qualityCode;

    @Column(nullable = false)
    private Double targetMeterage; // e.g. 25,000 meters

    // Auto Calculated MRP Raw Material Requirements
    private Double requiredWarpYarnKg; // in Kilograms
    private Double requiredWeftYarnKg; // in Kilograms
    private Double requiredSizingChemicalKg; // in Kilograms
    private Double requiredDyesAndAuxiliariesKg; // in Kilograms

    // Loom Capacity & Scheduling
    private Integer allocatedLoomsCount; // e.g. 8 Looms
    private Integer estimatedLoomDays; // e.g. 12 Days
    private LocalDate plannedStartDate;
    private LocalDate committedDeliveryDate;

    @Column(nullable = false)
    private String currentStage; // YARN_PROCUREMENT, WARPING_BEAMS, WEAVING_RUN, DYEING_STENTER, INSPECTION_PACK, COMPLETED

    private String plannedByManager;
    private String remarks;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.plannedStartDate == null) this.plannedStartDate = LocalDate.now();
        if (this.committedDeliveryDate == null) this.committedDeliveryDate = LocalDate.now().plusDays(25);
        if (this.currentStage == null) this.currentStage = "YARN_PROCUREMENT";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlanNumber() { return planNumber; }
    public void setPlanNumber(String planNumber) { this.planNumber = planNumber; }

    public String getOrderReferenceNumber() { return orderReferenceNumber; }
    public void setOrderReferenceNumber(String orderReferenceNumber) { this.orderReferenceNumber = orderReferenceNumber; }

    public String getTargetClientName() { return targetClientName; }
    public void setTargetClientName(String targetClientName) { this.targetClientName = targetClientName; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public String getQualityCode() { return qualityCode; }
    public void setQualityCode(String qualityCode) { this.qualityCode = qualityCode; }

    public Double getTargetMeterage() { return targetMeterage; }
    public void setTargetMeterage(Double targetMeterage) { this.targetMeterage = targetMeterage; }

    public Double getRequiredWarpYarnKg() { return requiredWarpYarnKg; }
    public void setRequiredWarpYarnKg(Double requiredWarpYarnKg) { this.requiredWarpYarnKg = requiredWarpYarnKg; }

    public Double getRequiredWeftYarnKg() { return requiredWeftYarnKg; }
    public void setRequiredWeftYarnKg(Double requiredWeftYarnKg) { this.requiredWeftYarnKg = requiredWeftYarnKg; }

    public Double getRequiredSizingChemicalKg() { return requiredSizingChemicalKg; }
    public void setRequiredSizingChemicalKg(Double requiredSizingChemicalKg) { this.requiredSizingChemicalKg = requiredSizingChemicalKg; }

    public Double getRequiredDyesAndAuxiliariesKg() { return requiredDyesAndAuxiliariesKg; }
    public void setRequiredDyesAndAuxiliariesKg(Double requiredDyesAndAuxiliariesKg) { this.requiredDyesAndAuxiliariesKg = requiredDyesAndAuxiliariesKg; }

    public Integer getAllocatedLoomsCount() { return allocatedLoomsCount; }
    public void setAllocatedLoomsCount(Integer allocatedLoomsCount) { this.allocatedLoomsCount = allocatedLoomsCount; }

    public Integer getEstimatedLoomDays() { return estimatedLoomDays; }
    public void setEstimatedLoomDays(Integer estimatedLoomDays) { this.estimatedLoomDays = estimatedLoomDays; }

    public LocalDate getPlannedStartDate() { return plannedStartDate; }
    public void setPlannedStartDate(LocalDate plannedStartDate) { this.plannedStartDate = plannedStartDate; }

    public LocalDate getCommittedDeliveryDate() { return committedDeliveryDate; }
    public void setCommittedDeliveryDate(LocalDate committedDeliveryDate) { this.committedDeliveryDate = committedDeliveryDate; }

    public String getCurrentStage() { return currentStage; }
    public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }

    public String getPlannedByManager() { return plannedByManager; }
    public void setPlannedByManager(String plannedByManager) { this.plannedByManager = plannedByManager; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}