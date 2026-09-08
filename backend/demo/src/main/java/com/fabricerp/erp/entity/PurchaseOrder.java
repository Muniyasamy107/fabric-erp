package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String poNumber; // e.g. PO-2026-9021

    private Long supplierId;
    private String supplierMillName;
    private String millContactPerson;
    private String millPhone;
    private String millCity;

    private String status; // DRAFT, ISSUED_TO_MILL, RECEIVED, CANCELLED

    private LocalDate expectedDeliveryDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalEstimatedCost;

    private String notes;
    private LocalDateTime createdAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "purchase_order_id")
    private List<PurchaseOrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "ISSUED_TO_MILL";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierMillName() { return supplierMillName; }
    public void setSupplierMillName(String supplierMillName) { this.supplierMillName = supplierMillName; }

    public String getMillContactPerson() { return millContactPerson; }
    public void setMillContactPerson(String millContactPerson) { this.millContactPerson = millContactPerson; }

    public String getMillPhone() { return millPhone; }
    public void setMillPhone(String millPhone) { this.millPhone = millPhone; }

    public String getMillCity() { return millCity; }
    public void setMillCity(String millCity) { this.millCity = millCity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public BigDecimal getTotalEstimatedCost() { return totalEstimatedCost; }
    public void setTotalEstimatedCost(BigDecimal totalEstimatedCost) { this.totalEstimatedCost = totalEstimatedCost; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<PurchaseOrderItem> getItems() { return items; }
    public void setItems(List<PurchaseOrderItem> items) { this.items = items; }
}