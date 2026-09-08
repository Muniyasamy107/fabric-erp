package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "boiler_steam_logs")
public class BoilerSteamLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String steamLogNumber; // e.g. "STEAM-LOG-2026-9021"

    @Column(nullable = false)
    private LocalDate logDate;

    private String shiftTiming; // SHIFT_A_MORNING, SHIFT_B_EVENING, SHIFT_C_NIGHT
    private String boilerUnitCode; // e.g. "BOILER-THERMAX-01 (6 TPH)"

    @Column(nullable = false)
    private Double totalSteamGeneratedTons; // e.g. 48.5 Metric Tons

    private Double averageSteamPressureBar; // e.g. 10.5 Bar
    private Double averageSteamTempCelsius; // e.g. 185°C

    // Biomass Fuel Consumption
    private String fuelTypeUsed; // BIOMASS_BRIQUETTES, WOOD_CHIPS, IMPORTED_COAL
    private Double fuelConsumedTons; // e.g. 11.5 Tons
    private Double evaporationRatio; // Steam / Fuel Ratio (e.g. 4.21)

    // Departmental Steam Allocation in Metric Tons
    private Double dyeHouseSteamTons; // e.g. 31.5 Tons (65%)
    private Double stenterFinishingSteamTons; // e.g. 9.8 Tons (20%)
    private Double sizingYarnSteamTons; // e.g. 7.2 Tons (15%)

    // Water Treatment & Safety Chemistry
    private Double feedWaterHardnessPpm; // e.g. 2.0 ppm
    private Double boilerWaterPh; // e.g. 11.0 (Alkaline buffer)
    private Double blowdownTdsPpm; // e.g. 3200 ppm

    private String boilerAttendantEngineer;
    private String safetyStatus; // SAFE_CERTIFIED, BLOWDOWN_SCHEDULED, SAFETY_VALVE_INSPECTED
    private String logRemarks;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.logDate == null) this.logDate = LocalDate.now();
        if (this.safetyStatus == null) this.safetyStatus = "SAFE_CERTIFIED";
        if (this.fuelTypeUsed == null) this.fuelTypeUsed = "BIOMASS_BRIQUETTES";
        if (this.averageSteamPressureBar == null) this.averageSteamPressureBar = 10.5;
        if (this.boilerWaterPh == null) this.boilerWaterPh = 11.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSteamLogNumber() { return steamLogNumber; }
    public void setSteamLogNumber(String steamLogNumber) { this.steamLogNumber = steamLogNumber; }

    public LocalDate getLogDate() { return logDate; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }

    public String getShiftTiming() { return shiftTiming; }
    public void setShiftTiming(String shiftTiming) { this.shiftTiming = shiftTiming; }

    public String getBoilerUnitCode() { return boilerUnitCode; }
    public void setBoilerUnitCode(String boilerUnitCode) { this.boilerUnitCode = boilerUnitCode; }

    public Double getTotalSteamGeneratedTons() { return totalSteamGeneratedTons; }
    public void setTotalSteamGeneratedTons(Double totalSteamGeneratedTons) { this.totalSteamGeneratedTons = totalSteamGeneratedTons; }

    public Double getAverageSteamPressureBar() { return averageSteamPressureBar; }
    public void setAverageSteamPressureBar(Double averageSteamPressureBar) { this.averageSteamPressureBar = averageSteamPressureBar; }

    public Double getAverageSteamTempCelsius() { return averageSteamTempCelsius; }
    public void setAverageSteamTempCelsius(Double averageSteamTempCelsius) { this.averageSteamTempCelsius = averageSteamTempCelsius; }

    public String getFuelTypeUsed() { return fuelTypeUsed; }
    public void setFuelTypeUsed(String fuelTypeUsed) { this.fuelTypeUsed = fuelTypeUsed; }

    public Double getFuelConsumedTons() { return fuelConsumedTons; }
    public void setFuelConsumedTons(Double fuelConsumedTons) { this.fuelConsumedTons = fuelConsumedTons; }

    public Double getEvaporationRatio() { return evaporationRatio; }
    public void setEvaporationRatio(Double evaporationRatio) { this.evaporationRatio = evaporationRatio; }

    public Double getDyeHouseSteamTons() { return dyeHouseSteamTons; }
    public void setDyeHouseSteamTons(Double dyeHouseSteamTons) { this.dyeHouseSteamTons = dyeHouseSteamTons; }

    public Double getStenterFinishingSteamTons() { return stenterFinishingSteamTons; }
    public void setStenterFinishingSteamTons(Double stenterFinishingSteamTons) { this.stenterFinishingSteamTons = stenterFinishingSteamTons; }

    public Double getSizingYarnSteamTons() { return sizingYarnSteamTons; }
    public void setSizingYarnSteamTons(Double sizingYarnSteamTons) { this.sizingYarnSteamTons = sizingYarnSteamTons; }

    public Double getFeedWaterHardnessPpm() { return feedWaterHardnessPpm; }
    public void setFeedWaterHardnessPpm(Double feedWaterHardnessPpm) { this.feedWaterHardnessPpm = feedWaterHardnessPpm; }

    public Double getBoilerWaterPh() { return boilerWaterPh; }
    public void setBoilerWaterPh(Double boilerWaterPh) { this.boilerWaterPh = boilerWaterPh; }

    public Double getBlowdownTdsPpm() { return blowdownTdsPpm; }
    public void setBlowdownTdsPpm(Double blowdownTdsPpm) { this.blowdownTdsPpm = blowdownTdsPpm; }

    public String getBoilerAttendantEngineer() { return boilerAttendantEngineer; }
    public void setBoilerAttendantEngineer(String boilerAttendantEngineer) { this.boilerAttendantEngineer = boilerAttendantEngineer; }

    public String getSafetyStatus() { return safetyStatus; }
    public void setSafetyStatus(String safetyStatus) { this.safetyStatus = safetyStatus; }

    public String getLogRemarks() { return logRemarks; }
    public void setLogRemarks(String logRemarks) { this.logRemarks = logRemarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}