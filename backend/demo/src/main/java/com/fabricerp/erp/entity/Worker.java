package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "factory_workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String badgeNumber; // e.g. "EMP-WEAVER-042"

    @Column(nullable = false)
    private String fullName;

    private String plantDepartment; // LOOM_HALL_WEAVING, WARPING_SIZING, DYE_HOUSE, etc.
    
    @Column(precision = 10, scale = 2)
    private BigDecimal baseDailyWage; // e.g. 650.00

    private String assignedMachineCode; // e.g. "LOOM-A01"
    private Boolean active;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.active == null) this.active = true;
        if (this.baseDailyWage == null) this.baseDailyWage = BigDecimal.valueOf(650.0);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPlantDepartment() { return plantDepartment; }
    public void setPlantDepartment(String plantDepartment) { this.plantDepartment = plantDepartment; }

    public BigDecimal getBaseDailyWage() { return baseDailyWage; }
    public void setBaseDailyWage(BigDecimal baseDailyWage) { this.baseDailyWage = baseDailyWage; }

    public String getAssignedMachineCode() { return assignedMachineCode; }
    public void setAssignedMachineCode(String assignedMachineCode) { this.assignedMachineCode = assignedMachineCode; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}