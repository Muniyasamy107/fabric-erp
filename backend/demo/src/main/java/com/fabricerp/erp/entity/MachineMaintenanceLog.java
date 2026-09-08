package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "machine_maintenance_logs")
public class MachineMaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ticketNumber; // e.g. TICKET-2026-8801

    @Column(nullable = false)
    private String machineCode; // e.g. LOOM-A01, STENTER-LINE-01, SIZING-01

    private String machineType; // RAPIER_LOOM, AIR_JET, STENTER, CALENDER, SIZING
    private String maintenanceType; // BREAKDOWN_REPAIR, PREVENTIVE_PM, OVERHAUL
    private String priority; // CRITICAL_STOP, MEDIUM, LOW

    @Column(length = 1000, nullable = false)
    private String issueDescription;

    private String technicianName; // Fitter or Electrician Name
    private String partsReplacedSummary; // e.g. "2x Rapier Tape + 1x Bearing 6205"

    private Double downtimeHours; // e.g. 3.5 hours

    @Column(precision = 10, scale = 2)
    private BigDecimal totalSpareAndLabourCost;

    private String status; // OPEN_DOWN, IN_REPAIR, RESOLVED_RUNNING
    private String resolutionNotes;

    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.reportedAt = LocalDateTime.now();
        if (this.status == null) this.status = "OPEN_DOWN";
        if (this.priority == null) this.priority = "CRITICAL_STOP";
        if (this.downtimeHours == null) this.downtimeHours = 0.0;
        if (this.totalSpareAndLabourCost == null) this.totalSpareAndLabourCost = BigDecimal.ZERO;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public String getMachineCode() { return machineCode; }
    public void setMachineCode(String machineCode) { this.machineCode = machineCode; }

    public String getMachineType() { return machineType; }
    public void setMachineType(String machineType) { this.machineType = machineType; }

    public String getMaintenanceType() { return maintenanceType; }
    public void setMaintenanceType(String maintenanceType) { this.maintenanceType = maintenanceType; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getPartsReplacedSummary() { return partsReplacedSummary; }
    public void setPartsReplacedSummary(String partsReplacedSummary) { this.partsReplacedSummary = partsReplacedSummary; }

    public Double getDowntimeHours() { return downtimeHours; }
    public void setDowntimeHours(Double downtimeHours) { this.downtimeHours = downtimeHours; }

    public BigDecimal getTotalSpareAndLabourCost() { return totalSpareAndLabourCost; }
    public void setTotalSpareAndLabourCost(BigDecimal totalSpareAndLabourCost) { this.totalSpareAndLabourCost = totalSpareAndLabourCost; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}