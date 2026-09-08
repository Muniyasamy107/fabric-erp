package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "finishing_batches")
public class FinishingBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String finishBatchNumber; // e.g. FINISH-2026-9901

    private Long productionJobId;
    private String rawBatchLotNumber; // Link to ProductionJob
    private String fabricProductName;

    private String machineLine; // STENTER_LINE_01, ROTARY_CALENDER_02, SANFORIZER_01
    private String finishTreatmentType; // HEAT_SETTING, SILICONE_SOFTENER, HIGH_LUSTER_CALENDER, TEFLON_WATER_REPELLENT, BIO_POLISHING

    private Double inputGreigeMeters; // Input meters before finish
    private Double outputFinishedMeters; // Final delivered meters after shrinkage/stretch

    private Integer stenterTemperatureCelsius; // e.g. 180°C
    private Double machineSpeedMpm; // Meters Per Minute (e.g. 25 m/min)
    private Double targetWidthInches; // e.g. 58.0"

    private String chemicalRecipeApplied; // e.g. "Silicone Micro Emulsion 25g/L + Acetic Acid 1g/L"
    private String finishStatus; // QUEUED, IN_STENTER, CALENDERING, COMPLETED

    private String operatorMasterName;
    private LocalDate processingDate;
    private String processNotes;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.processingDate == null) this.processingDate = LocalDate.now();
        if (this.finishStatus == null) this.finishStatus = "QUEUED";
        if (this.stenterTemperatureCelsius == null) this.stenterTemperatureCelsius = 175;
        if (this.machineSpeedMpm == null) this.machineSpeedMpm = 25.0;
        if (this.targetWidthInches == null) this.targetWidthInches = 58.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFinishBatchNumber() { return finishBatchNumber; }
    public void setFinishBatchNumber(String finishBatchNumber) { this.finishBatchNumber = finishBatchNumber; }

    public Long getProductionJobId() { return productionJobId; }
    public void setProductionJobId(Long productionJobId) { this.productionJobId = productionJobId; }

    public String getRawBatchLotNumber() { return rawBatchLotNumber; }
    public void setRawBatchLotNumber(String rawBatchLotNumber) { this.rawBatchLotNumber = rawBatchLotNumber; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public String getMachineLine() { return machineLine; }
    public void setMachineLine(String machineLine) { this.machineLine = machineLine; }

    public String getFinishTreatmentType() { return finishTreatmentType; }
    public void setFinishTreatmentType(String finishTreatmentType) { this.finishTreatmentType = finishTreatmentType; }

    public Double getInputGreigeMeters() { return inputGreigeMeters; }
    public void setInputGreigeMeters(Double inputGreigeMeters) { this.inputGreigeMeters = inputGreigeMeters; }

    public Double getOutputFinishedMeters() { return outputFinishedMeters; }
    public void setOutputFinishedMeters(Double outputFinishedMeters) { this.outputFinishedMeters = outputFinishedMeters; }

    public Integer getStenterTemperatureCelsius() { return stenterTemperatureCelsius; }
    public void setStenterTemperatureCelsius(Integer stenterTemperatureCelsius) { this.stenterTemperatureCelsius = stenterTemperatureCelsius; }

    public Double getMachineSpeedMpm() { return machineSpeedMpm; }
    public void setMachineSpeedMpm(Double machineSpeedMpm) { this.machineSpeedMpm = machineSpeedMpm; }

    public Double getTargetWidthInches() { return targetWidthInches; }
    public void setTargetWidthInches(Double targetWidthInches) { this.targetWidthInches = targetWidthInches; }

    public String getChemicalRecipeApplied() { return chemicalRecipeApplied; }
    public void setChemicalRecipeApplied(String chemicalRecipeApplied) { this.chemicalRecipeApplied = chemicalRecipeApplied; }

    public String getFinishStatus() { return finishStatus; }
    public void setFinishStatus(String finishStatus) { this.finishStatus = finishStatus; }

    public String getOperatorMasterName() { return operatorMasterName; }
    public void setOperatorMasterName(String operatorMasterName) { this.operatorMasterName = operatorMasterName; }

    public LocalDate getProcessingDate() { return processingDate; }
    public void setProcessingDate(LocalDate processingDate) { this.processingDate = processingDate; }

    public String getProcessNotes() { return processNotes; }
    public void setProcessNotes(String processNotes) { this.processNotes = processNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}