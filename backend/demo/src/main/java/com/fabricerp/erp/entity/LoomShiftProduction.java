package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loom_shift_productions")
public class LoomShiftProduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String shiftLogNumber; // e.g. "SHIFT-20260904-A"

    @Column(nullable = false)
    private LocalDate shiftDate;

    @Column(nullable = false)
    private String shiftName; // SHIFT_A_MORNING, SHIFT_B_EVENING, SHIFT_C_NIGHT

    private String shiftSupervisorName;
    private Integer totalActiveLooms; // e.g. 24 Looms running

    private Long totalPicksWoven; // e.g. 1,450,000 picks in 8 hours
    private Double totalMetersWoven; // e.g. 1,250.0 meters
    private Double totalWasteScrapMeters;

    private Double warpStoppageMinutes; // Stoppage due to warp breaks
    private Double weftStoppageMinutes; // Stoppage due to weft feeder
    private Double electricalDowntimeMinutes;

    private Double powerUnitsKwh; // Electricity consumption

    // Calculated OEE Indicators
    private Double availabilityRatePct; // Running time / Total time (e.g. 92.5%)
    private Double performanceRatePct; // Actual speed / Rated speed (e.g. 95.0%)
    private Double qualityRatePct; // (Total - Scrap) / Total (e.g. 98.2%)
    private Double overallOeePercentage; // Availability * Performance * Quality (e.g. 86.3%)

    @Column(length = 1000)
    private String shiftHandoverNotes;

    private String shiftStatus; // LOGGED_CLOSED, UNDER_VERIFICATION
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.shiftDate == null) this.shiftDate = LocalDate.now();
        if (this.shiftStatus == null) this.shiftStatus = "LOGGED_CLOSED";
        if (this.warpStoppageMinutes == null) this.warpStoppageMinutes = 0.0;
        if (this.weftStoppageMinutes == null) this.weftStoppageMinutes = 0.0;
        if (this.totalWasteScrapMeters == null) this.totalWasteScrapMeters = 0.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShiftLogNumber() { return shiftLogNumber; }
    public void setShiftLogNumber(String shiftLogNumber) { this.shiftLogNumber = shiftLogNumber; }

    public LocalDate getShiftDate() { return shiftDate; }
    public void setShiftDate(LocalDate shiftDate) { this.shiftDate = shiftDate; }

    public String getShiftName() { return shiftName; }
    public void setShiftName(String shiftName) { this.shiftName = shiftName; }

    public String getShiftSupervisorName() { return shiftSupervisorName; }
    public void setShiftSupervisorName(String shiftSupervisorName) { this.shiftSupervisorName = shiftSupervisorName; }

    public Integer getTotalActiveLooms() { return totalActiveLooms; }
    public void setTotalActiveLooms(Integer totalActiveLooms) { this.totalActiveLooms = totalActiveLooms; }

    public Long getTotalPicksWoven() { return totalPicksWoven; }
    public void setTotalPicksWoven(Long totalPicksWoven) { this.totalPicksWoven = totalPicksWoven; }

    public Double getTotalMetersWoven() { return totalMetersWoven; }
    public void setTotalMetersWoven(Double totalMetersWoven) { this.totalMetersWoven = totalMetersWoven; }

    public Double getTotalWasteScrapMeters() { return totalWasteScrapMeters; }
    public void setTotalWasteScrapMeters(Double totalWasteScrapMeters) { this.totalWasteScrapMeters = totalWasteScrapMeters; }

    public Double getWarpStoppageMinutes() { return warpStoppageMinutes; }
    public void setWarpStoppageMinutes(Double warpStoppageMinutes) { this.warpStoppageMinutes = warpStoppageMinutes; }

    public Double getWeftStoppageMinutes() { return weftStoppageMinutes; }
    public void setWeftStoppageMinutes(Double weftStoppageMinutes) { this.weftStoppageMinutes = weftStoppageMinutes; }

    public Double getElectricalDowntimeMinutes() { return electricalDowntimeMinutes; }
    public void setElectricalDowntimeMinutes(Double electricalDowntimeMinutes) { this.electricalDowntimeMinutes = electricalDowntimeMinutes; }

    public Double getPowerUnitsKwh() { return powerUnitsKwh; }
    public void setPowerUnitsKwh(Double powerUnitsKwh) { this.powerUnitsKwh = powerUnitsKwh; }

    public Double getAvailabilityRatePct() { return availabilityRatePct; }
    public void setAvailabilityRatePct(Double availabilityRatePct) { this.availabilityRatePct = availabilityRatePct; }

    public Double getPerformanceRatePct() { return performanceRatePct; }
    public void setPerformanceRatePct(Double performanceRatePct) { this.performanceRatePct = performanceRatePct; }

    public Double getQualityRatePct() { return qualityRatePct; }
    public void setQualityRatePct(Double qualityRatePct) { this.qualityRatePct = qualityRatePct; }

    public Double getOverallOeePercentage() { return overallOeePercentage; }
    public void setOverallOeePercentage(Double overallOeePercentage) { this.overallOeePercentage = overallOeePercentage; }

    public String getShiftHandoverNotes() { return shiftHandoverNotes; }
    public void setShiftHandoverNotes(String shiftHandoverNotes) { this.shiftHandoverNotes = shiftHandoverNotes; }

    public String getShiftStatus() { return shiftStatus; }
    public void setShiftStatus(String shiftStatus) { this.shiftStatus = shiftStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}