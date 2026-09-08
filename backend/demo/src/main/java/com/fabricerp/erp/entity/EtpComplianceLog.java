package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "etp_compliance_logs")
public class EtpComplianceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String logCertificateNumber; // e.g. "ETP-LOG-2026-9021"

    @Column(nullable = false)
    private LocalDate auditDate;

    private String shiftTiming; // SHIFT_A_MORNING, SHIFT_B_EVENING, SHIFT_C_NIGHT

    @Column(nullable = false)
    private Double rawEffluentInflowKld; // Raw inflow from Dye House in Kilo Liters / Day (e.g. 150.0 KLD)

    @Column(nullable = false)
    private Double recycledPermeateWaterKld; // Clean recycled water back to factory (e.g. 140.0 KLD)

    private Double waterRecoveryPercentage; // e.g. 93.3%

    // Chemical & Physical Lab Testing Parameters
    private Double testedPhValue; // Normal range: 6.5 - 8.0
    private Double inletTdsPpm; // Raw effluent TDS (e.g. 6500 ppm)
    private Double treatedRoTdsPpm; // RO output TDS (e.g. 120 ppm)
    private Double chemicalOxygenDemandCod; // COD mg/L (e.g. 45.0 mg/L)
    private Double biochemicalOxygenDemandBod; // BOD mg/L (e.g. 12.0 mg/L)
    private Double totalSuspendedSolidsTss; // TSS mg/L (e.g. 8.0 mg/L)

    private Double drySludgeGeneratedKg; // Filter press sludge generated in KG
    private Double etpPowerConsumedKwh; // Electricity consumption for aeration/RO

    @Column(nullable = false)
    private String zldComplianceStatus; // ZLD_PASSED_100PCT_RECYCLED, PARAMETER_DEVIATION, FILTER_BACKWASH_DOWN

    private String environmentalChemistName;
    private String observations;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.auditDate == null) this.auditDate = LocalDate.now();
        if (this.zldComplianceStatus == null) this.zldComplianceStatus = "ZLD_PASSED_100PCT_RECYCLED";
        if (this.shiftTiming == null) this.shiftTiming = "SHIFT_A_MORNING";
        if (this.testedPhValue == null) this.testedPhValue = 7.2;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogCertificateNumber() { return logCertificateNumber; }
    public void setLogCertificateNumber(String logCertificateNumber) { this.logCertificateNumber = logCertificateNumber; }

    public LocalDate getAuditDate() { return auditDate; }
    public void setAuditDate(LocalDate auditDate) { this.auditDate = auditDate; }

    public String getShiftTiming() { return shiftTiming; }
    public void setShiftTiming(String shiftTiming) { this.shiftTiming = shiftTiming; }

    public Double getRawEffluentInflowKld() { return rawEffluentInflowKld; }
    public void setRawEffluentInflowKld(Double rawEffluentInflowKld) { this.rawEffluentInflowKld = rawEffluentInflowKld; }

    public Double getRecycledPermeateWaterKld() { return recycledPermeateWaterKld; }
    public void setRecycledPermeateWaterKld(Double recycledPermeateWaterKld) { this.recycledPermeateWaterKld = recycledPermeateWaterKld; }

    public Double getWaterRecoveryPercentage() { return waterRecoveryPercentage; }
    public void setWaterRecoveryPercentage(Double waterRecoveryPercentage) { this.waterRecoveryPercentage = waterRecoveryPercentage; }

    public Double getTestedPhValue() { return testedPhValue; }
    public void setTestedPhValue(Double testedPhValue) { this.testedPhValue = testedPhValue; }

    public Double getInletTdsPpm() { return inletTdsPpm; }
    public void setInletTdsPpm(Double inletTdsPpm) { this.inletTdsPpm = inletTdsPpm; }

    public Double getTreatedRoTdsPpm() { return treatedRoTdsPpm; }
    public void setTreatedRoTdsPpm(Double treatedRoTdsPpm) { this.treatedRoTdsPpm = treatedRoTdsPpm; }

    public Double getChemicalOxygenDemandCod() { return chemicalOxygenDemandCod; }
    public void setChemicalOxygenDemandCod(Double chemicalOxygenDemandCod) { this.chemicalOxygenDemandCod = chemicalOxygenDemandCod; }

    public Double getBiochemicalOxygenDemandBod() { return biochemicalOxygenDemandBod; }
    public void setBiochemicalOxygenDemandBod(Double biochemicalOxygenDemandBod) { this.biochemicalOxygenDemandBod = biochemicalOxygenDemandBod; }

    public Double getTotalSuspendedSolidsTss() { return totalSuspendedSolidsTss; }
    public void setTotalSuspendedSolidsTss(Double totalSuspendedSolidsTss) { this.totalSuspendedSolidsTss = totalSuspendedSolidsTss; }

    public Double getDrySludgeGeneratedKg() { return drySludgeGeneratedKg; }
    public void setDrySludgeGeneratedKg(Double drySludgeGeneratedKg) { this.drySludgeGeneratedKg = drySludgeGeneratedKg; }

    public Double getEtpPowerConsumedKwh() { return etpPowerConsumedKwh; }
    public void setEtpPowerConsumedKwh(Double etpPowerConsumedKwh) { this.etpPowerConsumedKwh = etpPowerConsumedKwh; }

    public String getZldComplianceStatus() { return zldComplianceStatus; }
    public void setZldComplianceStatus(String zldComplianceStatus) { this.zldComplianceStatus = zldComplianceStatus; }

    public String getEnvironmentalChemistName() { return environmentalChemistName; }
    public void setEnvironmentalChemistName(String environmentalChemistName) { this.environmentalChemistName = environmentalChemistName; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}