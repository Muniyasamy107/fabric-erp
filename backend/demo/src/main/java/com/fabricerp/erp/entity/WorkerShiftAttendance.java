package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker_shift_attendances")
public class WorkerShiftAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String workerBadgeNumber; // e.g. "EMP-WEAVER-042"

    @Column(nullable = false)
    private String workerFullName; // e.g. "Murugesan K"

    private String plantDepartment; // LOOM_HALL_WEAVING, WARPING_SIZING, DYE_HOUSE, FINISHING_STENTER, QUALITY_INSPECT, MAINTENANCE_FITTER
    private String designatedShift; // SHIFT_A_MORNING, SHIFT_B_EVENING, SHIFT_C_NIGHT

    @Column(nullable = false)
    private LocalDate attendanceDate;

    private String punchInTime; // e.g. "05:55 AM"
    private String punchOutTime; // e.g. "02:10 PM"

    @Column(nullable = false)
    private String attendanceStatus; // PRESENT, LATE_ENTRY, HALF_DAY, OVERTIME_DOUBLE_SHIFT, ABSENT

    private Double standardShiftHours; // 8.0 Hours
    private Double overtimeHours; // e.g. 4.0 Hours OT

    @Column(precision = 10, scale = 2)
    private BigDecimal regularDailyWage; // e.g. ₹650.00

    @Column(precision = 10, scale = 2)
    private BigDecimal overtimeWagesEarned; // e.g. ₹325.00 (Double OT Rate)

    @Column(precision = 10, scale = 2)
    private BigDecimal totalGrossEarned; // regular + OT

    private String assignedMachineCode; // e.g. "LOOM-A01 to A06"
    private String supervisorNotes;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.attendanceDate == null) this.attendanceDate = LocalDate.now();
        if (this.attendanceStatus == null) this.attendanceStatus = "PRESENT";
        if (this.standardShiftHours == null) this.standardShiftHours = 8.0;
        if (this.overtimeHours == null) this.overtimeHours = 0.0;
        if (this.regularDailyWage == null) this.regularDailyWage = BigDecimal.valueOf(650.0);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWorkerBadgeNumber() { return workerBadgeNumber; }
    public void setWorkerBadgeNumber(String workerBadgeNumber) { this.workerBadgeNumber = workerBadgeNumber; }

    public String getWorkerFullName() { return workerFullName; }
    public void setWorkerFullName(String workerFullName) { this.workerFullName = workerFullName; }

    public String getPlantDepartment() { return plantDepartment; }
    public void setPlantDepartment(String plantDepartment) { this.plantDepartment = plantDepartment; }

    public String getDesignatedShift() { return designatedShift; }
    public void setDesignatedShift(String designatedShift) { this.designatedShift = designatedShift; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public String getPunchInTime() { return punchInTime; }
    public void setPunchInTime(String punchInTime) { this.punchInTime = punchInTime; }

    public String getPunchOutTime() { return punchOutTime; }
    public void setPunchOutTime(String punchOutTime) { this.punchOutTime = punchOutTime; }

    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }

    public Double getStandardShiftHours() { return standardShiftHours; }
    public void setStandardShiftHours(Double standardShiftHours) { this.standardShiftHours = standardShiftHours; }

    public Double getOvertimeHours() { return overtimeHours; }
    public void setOvertimeHours(Double overtimeHours) { this.overtimeHours = overtimeHours; }

    public BigDecimal getRegularDailyWage() { return regularDailyWage; }
    public void setRegularDailyWage(BigDecimal regularDailyWage) { this.regularDailyWage = regularDailyWage; }

    public BigDecimal getOvertimeWagesEarned() { return overtimeWagesEarned; }
    public void setOvertimeWagesEarned(BigDecimal overtimeWagesEarned) { this.overtimeWagesEarned = overtimeWagesEarned; }

    public BigDecimal getTotalGrossEarned() { return totalGrossEarned; }
    public void setTotalGrossEarned(BigDecimal totalGrossEarned) { this.totalGrossEarned = totalGrossEarned; }

    public String getAssignedMachineCode() { return assignedMachineCode; }
    public void setAssignedMachineCode(String assignedMachineCode) { this.assignedMachineCode = assignedMachineCode; }

    public String getSupervisorNotes() { return supervisorNotes; }
    public void setSupervisorNotes(String supervisorNotes) { this.supervisorNotes = supervisorNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}