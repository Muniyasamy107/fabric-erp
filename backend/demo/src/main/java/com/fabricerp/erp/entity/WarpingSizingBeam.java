package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "warping_sizing_beams")
public class WarpingSizingBeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String beamNumber; // e.g. BEAM-2026-8801

    private String qualityCode; // Link to FabricProduct
    private String fabricProductName;
    private String yarnLotNumber; // Link to YarnInventory
    private String yarnCountSpecification; // e.g. "Cotton 80/1 Ne Compact"

    private Integer totalWarpEnds; // e.g. 4800 ends / threads
    private Double beamLengthMeters; // e.g. 1500 meters wound on beam
    private Double flangeWidthInches; // e.g. 68.0 inches

    // Sizing Parameters
    private String sizingChemicalMix; // e.g. "Modified Maize Starch (8%) + PVA Binder + Wax Softener"
    private Double sizePickUpPercentage; // e.g. 8.5%
    private Double moisturePercentage; // e.g. 6.2%
    private Integer dryingCylinderTempCelsius; // e.g. 115°C

    private String assignedLoomNumber; // e.g. LOOM-A01
    private String beamStatus; // IN_WARPING, IN_SIZING, READY_IN_BEAM_BANK, MOUNTED_ON_LOOM, EXHAUSTED

    private String supervisorName;
    private LocalDate beamWarpingDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.beamWarpingDate == null) this.beamWarpingDate = LocalDate.now();
        if (this.beamStatus == null) this.beamStatus = "READY_IN_BEAM_BANK";
        if (this.flangeWidthInches == null) this.flangeWidthInches = 68.0;
        if (this.sizePickUpPercentage == null) this.sizePickUpPercentage = 8.5;
        if (this.moisturePercentage == null) this.moisturePercentage = 6.5;
        if (this.dryingCylinderTempCelsius == null) this.dryingCylinderTempCelsius = 115;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBeamNumber() { return beamNumber; }
    public void setBeamNumber(String beamNumber) { this.beamNumber = beamNumber; }

    public String getQualityCode() { return qualityCode; }
    public void setQualityCode(String qualityCode) { this.qualityCode = qualityCode; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public String getYarnLotNumber() { return yarnLotNumber; }
    public void setYarnLotNumber(String yarnLotNumber) { this.yarnLotNumber = yarnLotNumber; }

    public String getYarnCountSpecification() { return yarnCountSpecification; }
    public void setYarnCountSpecification(String yarnCountSpecification) { this.yarnCountSpecification = yarnCountSpecification; }

    public Integer getTotalWarpEnds() { return totalWarpEnds; }
    public void setTotalWarpEnds(Integer totalWarpEnds) { this.totalWarpEnds = totalWarpEnds; }

    public Double getBeamLengthMeters() { return beamLengthMeters; }
    public void setBeamLengthMeters(Double beamLengthMeters) { this.beamLengthMeters = beamLengthMeters; }

    public Double getFlangeWidthInches() { return flangeWidthInches; }
    public void setFlangeWidthInches(Double flangeWidthInches) { this.flangeWidthInches = flangeWidthInches; }

    public String getSizingChemicalMix() { return sizingChemicalMix; }
    public void setSizingChemicalMix(String sizingChemicalMix) { this.sizingChemicalMix = sizingChemicalMix; }

    public Double getSizePickUpPercentage() { return sizePickUpPercentage; }
    public void setSizePickUpPercentage(Double sizePickUpPercentage) { this.sizePickUpPercentage = sizePickUpPercentage; }

    public Double getMoisturePercentage() { return moisturePercentage; }
    public void setMoisturePercentage(Double moisturePercentage) { this.moisturePercentage = moisturePercentage; }

    public Integer getDryingCylinderTempCelsius() { return dryingCylinderTempCelsius; }
    public void setDryingCylinderTempCelsius(Integer dryingCylinderTempCelsius) { this.dryingCylinderTempCelsius = dryingCylinderTempCelsius; }

    public String getAssignedLoomNumber() { return assignedLoomNumber; }
    public void setAssignedLoomNumber(String assignedLoomNumber) { this.assignedLoomNumber = assignedLoomNumber; }

    public String getBeamStatus() { return beamStatus; }
    public void setBeamStatus(String beamStatus) { this.beamStatus = beamStatus; }

    public String getSupervisorName() { return supervisorName; }
    public void setSupervisorName(String supervisorName) { this.supervisorName = supervisorName; }

    public LocalDate getBeamWarpingDate() { return beamWarpingDate; }
    public void setBeamWarpingDate(LocalDate beamWarpingDate) { this.beamWarpingDate = beamWarpingDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}