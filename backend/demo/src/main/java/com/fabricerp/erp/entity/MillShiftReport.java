package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mill_shift_reports")
public class MillShiftReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate shiftDate;
    private String shiftSupervisorName;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalMetersWoven;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalDefectMeters;

    private Integer activeLoomsCount;
    private String status;
    private String closingNotes;
    private LocalDateTime openedAt;
    private LocalDateTime closedAt;

    @PrePersist
    protected void onCreate() {
        this.openedAt = LocalDateTime.now();
        if (this.shiftDate == null) this.shiftDate = LocalDate.now();
        if (this.status == null) this.status = "CLOSED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getShiftDate() { return shiftDate; }
    public void setShiftDate(LocalDate shiftDate) { this.shiftDate = shiftDate; }

    public String getShiftSupervisorName() { return shiftSupervisorName; }
    public void setShiftSupervisorName(String shiftSupervisorName) { this.shiftSupervisorName = shiftSupervisorName; }

    public BigDecimal getTotalMetersWoven() { return totalMetersWoven; }
    public void setTotalMetersWoven(BigDecimal totalMetersWoven) { this.totalMetersWoven = totalMetersWoven; }

    public BigDecimal getTotalDefectMeters() { return totalDefectMeters; }
    public void setTotalDefectMeters(BigDecimal totalDefectMeters) { this.totalDefectMeters = totalDefectMeters; }

    public Integer getActiveLoomsCount() { return activeLoomsCount; }
    public void setActiveLoomsCount(Integer activeLoomsCount) { this.activeLoomsCount = activeLoomsCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getClosingNotes() { return closingNotes; }
    public void setClosingNotes(String closingNotes) { this.closingNotes = closingNotes; }

    public LocalDateTime getOpenedAt() { return openedAt; }
    public void setOpenedAt(LocalDateTime openedAt) { this.openedAt = openedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }
}