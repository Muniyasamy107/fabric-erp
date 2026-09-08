package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_notifications")
public class SystemNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // e.g. "Loom Breakdown Alert"

    @Column(length = 1000, nullable = false)
    private String message; // e.g. "LOOM-A01 stopped due to warp break. Fitter assigned."

    @Column(nullable = false)
    private String alertCategory; // BREAKDOWN, LOW_STOCK, QC_ALERT, ETP_ALERT, DISPATCH

    @Column(nullable = false)
    private String severity; // CRITICAL, WARNING, INFO

    private Boolean isRead;
    private String actionUrl; // e.g. "/maintenance", "/fabrics", "/quality-lab"

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isRead == null) this.isRead = false;
        if (this.severity == null) this.severity = "WARNING";
        if (this.alertCategory == null) this.alertCategory = "BREAKDOWN";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAlertCategory() { return alertCategory; }
    public void setAlertCategory(String alertCategory) { this.alertCategory = alertCategory; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}