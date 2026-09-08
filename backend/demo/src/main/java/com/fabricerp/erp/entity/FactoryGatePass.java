package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "factory_gate_passes")
public class FactoryGatePass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String gatePassNumber; // e.g. "GP-2026-9021"

    @Column(nullable = false)
    private String passType; // OUTWARD_FINISHED_GOODS, INWARD_RAW_MATERIAL, RETURNABLE_JOB_WORK, NON_RETURNABLE

    @Column(nullable = false)
    private String vehicleNumber; // e.g. "TN-38-AA-9988"

    private String transporterName; // e.g. "VRL Logistics Ltd / TCI Freight"
    private String driverName;
    private String driverPhone;

    private String destinationOrSourceParty; // Buyer or Supplier Company Name
    private String referenceInvoiceOrPoNumber; // Linked Invoice/LR Number
    private String eWayBillNumber; // Government E-Way Bill Number

    private Integer totalPackagesCount; // Total rolls / bags in lorry
    private Double totalMeterageQuantity;

    // Weighbridge Parameters in Kilograms
    private Double grossWeightKg; // Laden lorry weight
    private Double tareWeightKg; // Empty lorry weight
    private Double netMaterialWeightKg; // Material net weight

    private String securityOfficerName;
    private String gateStatus; // ALLOWED_OUT, ALLOWED_IN, REJECTED_HOLD
    private String securityRemarks;

    private LocalDateTime issuedAt;

    @PrePersist
    protected void onCreate() {
        this.issuedAt = LocalDateTime.now();
        if (this.gateStatus == null) this.gateStatus = "ALLOWED_OUT";
        if (this.passType == null) this.passType = "OUTWARD_FINISHED_GOODS";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGatePassNumber() { return gatePassNumber; }
    public void setGatePassNumber(String gatePassNumber) { this.gatePassNumber = gatePassNumber; }

    public String getPassType() { return passType; }
    public void setPassType(String passType) { this.passType = passType; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getTransporterName() { return transporterName; }
    public void setTransporterName(String transporterName) { this.transporterName = transporterName; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }

    public String getDestinationOrSourceParty() { return destinationOrSourceParty; }
    public void setDestinationOrSourceParty(String destinationOrSourceParty) { this.destinationOrSourceParty = destinationOrSourceParty; }

    public String getReferenceInvoiceOrPoNumber() { return referenceInvoiceOrPoNumber; }
    public void setReferenceInvoiceOrPoNumber(String referenceInvoiceOrPoNumber) { this.referenceInvoiceOrPoNumber = referenceInvoiceOrPoNumber; }

    public String geteWayBillNumber() { return eWayBillNumber; }
    public void seteWayBillNumber(String eWayBillNumber) { this.eWayBillNumber = eWayBillNumber; }

    public Integer getTotalPackagesCount() { return totalPackagesCount; }
    public void setTotalPackagesCount(Integer totalPackagesCount) { this.totalPackagesCount = totalPackagesCount; }

    public Double getTotalMeterageQuantity() { return totalMeterageQuantity; }
    public void setTotalMeterageQuantity(Double totalMeterageQuantity) { this.totalMeterageQuantity = totalMeterageQuantity; }

    public Double getGrossWeightKg() { return grossWeightKg; }
    public void setGrossWeightKg(Double grossWeightKg) { this.grossWeightKg = grossWeightKg; }

    public Double getTareWeightKg() { return tareWeightKg; }
    public void setTareWeightKg(Double tareWeightKg) { this.tareWeightKg = tareWeightKg; }

    public Double getNetMaterialWeightKg() { return netMaterialWeightKg; }
    public void setNetMaterialWeightKg(Double netMaterialWeightKg) { this.netMaterialWeightKg = netMaterialWeightKg; }

    public String getSecurityOfficerName() { return securityOfficerName; }
    public void setSecurityOfficerName(String securityOfficerName) { this.securityOfficerName = securityOfficerName; }

    public String getGateStatus() { return gateStatus; }
    public void setGateStatus(String gateStatus) { this.gateStatus = gateStatus; }

    public String getSecurityRemarks() { return securityRemarks; }
    public void setSecurityRemarks(String securityRemarks) { this.securityRemarks = securityRemarks; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
}