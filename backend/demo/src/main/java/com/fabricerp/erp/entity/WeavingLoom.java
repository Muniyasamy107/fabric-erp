package com.fabricerp.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "weaving_looms")
public class WeavingLoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String loomNumber; // e.g. "LOOM-A01"

    private String machineType; // Rapier, Air Jet, Water Jet, Projectile, Jacquard
    private Integer rpmSpeed; // Rotations Per Minute (Machine speed)
    private Double maximumWeavingWidthInches;
    
    private String currentYarnSpecification; // e.g. "Cotton 80s Ne Warp / Silk 20/22 Denier Weft"
    private String activeOperatorName;
    private String loomStatus; // ACTIVE_RUNNING, MAINTENANCE, IDLE_NO_YARN, SHUTDOWN

    private String maintenanceNotes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLoomNumber() { return loomNumber; }
    public void setLoomNumber(String loomNumber) { this.loomNumber = loomNumber; }

    public String getMachineType() { return machineType; }
    public void setMachineType(String machineType) { this.machineType = machineType; }

    public Integer getRpmSpeed() { return rpmSpeed; }
    public void setRpmSpeed(Integer rpmSpeed) { this.rpmSpeed = rpmSpeed; }

    public Double getMaximumWeavingWidthInches() { return maximumWeavingWidthInches; }
    public void setMaximumWeavingWidthInches(Double maximumWeavingWidthInches) { this.maximumWeavingWidthInches = maximumWeavingWidthInches; }

    public String getCurrentYarnSpecification() { return currentYarnSpecification; }
    public void setCurrentYarnSpecification(String currentYarnSpecification) { this.currentYarnSpecification = currentYarnSpecification; }

    public String getActiveOperatorName() { return activeOperatorName; }
    public void setActiveOperatorName(String activeOperatorName) { this.activeOperatorName = activeOperatorName; }

    public String getLoomStatus() { return loomStatus; }
    public void setLoomStatus(String loomStatus) { this.loomStatus = loomStatus; }

    public String getMaintenanceNotes() { return maintenanceNotes; }
    public void setMaintenanceNotes(String maintenanceNotes) { this.maintenanceNotes = maintenanceNotes; }
}