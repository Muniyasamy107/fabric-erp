package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "loom_telemetry_logs")
public class LoomTelemetryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String loomNumber; // e.g. LOOM-A01

    private String machineType; // RAPIER_HIGH_SPEED, AIR_JET_TERRY, JACQUARD_ELECTRONIC
    private Integer currentRpmSpeed; // e.g. 580 RPM
    private Long currentPicksCounter; // e.g. 842,900 picks
    private Double currentWovenMeters; // e.g. 642.5 meters

    private String currentLotBatchNumber;
    private String fabricQualityName;
    private String allocatedWeaverName;

    @Column(nullable = false)
    private String liveStatus; // ACTIVE_RUNNING, WARP_BREAK_STOP, WEFT_FEEDER_STOP, BEAM_GAITING_CHANGE, MAINTENANCE_DOWN

    private Double currentShiftEfficiencyPct; // e.g. 94.2%
    private String telemetrySensorAlert; // e.g. "Dropper Wire 412 Trip"

    private LocalDateTime lastSensorPingAt;

    @PrePersist
    protected void onCreate() {
        this.lastSensorPingAt = LocalDateTime.now();
        if (this.liveStatus == null) this.liveStatus = "ACTIVE_RUNNING";
        if (this.currentRpmSpeed == null) this.currentRpmSpeed = 550;
        if (this.currentShiftEfficiencyPct == null) this.currentShiftEfficiencyPct = 92.5;
        if (this.currentPicksCounter == null) this.currentPicksCounter = 0L;
        if (this.currentWovenMeters == null) this.currentWovenMeters = 0.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLoomNumber() { return loomNumber; }
    public void setLoomNumber(String loomNumber) { this.loomNumber = loomNumber; }

    public String getMachineType() { return machineType; }
    public void setMachineType(String machineType) { this.machineType = machineType; }

    public Integer getCurrentRpmSpeed() { return currentRpmSpeed; }
    public void setCurrentRpmSpeed(Integer currentRpmSpeed) { this.currentRpmSpeed = currentRpmSpeed; }

    public Long getCurrentPicksCounter() { return currentPicksCounter; }
    public void setCurrentPicksCounter(Long currentPicksCounter) { this.currentPicksCounter = currentPicksCounter; }

    public Double getCurrentWovenMeters() { return currentWovenMeters; }
    public void setCurrentWovenMeters(Double currentWovenMeters) { this.currentWovenMeters = currentWovenMeters; }

    public String getCurrentLotBatchNumber() { return currentLotBatchNumber; }
    public void setCurrentLotBatchNumber(String currentLotBatchNumber) { this.currentLotBatchNumber = currentLotBatchNumber; }

    public String getFabricQualityName() { return fabricQualityName; }
    public void setFabricQualityName(String fabricQualityName) { this.fabricQualityName = fabricQualityName; }

    public String getAllocatedWeaverName() { return allocatedWeaverName; }
    public void setAllocatedWeaverName(String allocatedWeaverName) { this.allocatedWeaverName = allocatedWeaverName; }

    public String getLiveStatus() { return liveStatus; }
    public void setLiveStatus(String liveStatus) { this.liveStatus = liveStatus; }

    public Double getCurrentShiftEfficiencyPct() { return currentShiftEfficiencyPct; }
    public void setCurrentShiftEfficiencyPct(Double currentShiftEfficiencyPct) { this.currentShiftEfficiencyPct = currentShiftEfficiencyPct; }

    public String getTelemetrySensorAlert() { return telemetrySensorAlert; }
    public void setTelemetrySensorAlert(String telemetrySensorAlert) { this.telemetrySensorAlert = telemetrySensorAlert; }

    public LocalDateTime getLastSensorPingAt() { return lastSensorPingAt; }
    public void setLastSensorPingAt(LocalDateTime lastSensorPingAt) { this.lastSensorPingAt = lastSensorPingAt; }
}