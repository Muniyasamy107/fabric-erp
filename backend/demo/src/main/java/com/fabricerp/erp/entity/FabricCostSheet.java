package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fabric_cost_sheets")
public class FabricCostSheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String costingSheetNumber; // e.g. "COST-2026-901"

    @Column(nullable = false)
    private String qualityCode;

    @Column(nullable = false)
    private String fabricName;

    private String weaveType;
    private Double reedWidthInches; // e.g. 62.0"
    private Double finishedWidthInches; // e.g. 58.0"

    // Technical Weave Construction
    private Integer totalWarpEnds; // e.g. 4800
    private String warpCountNe; // e.g. "80/1 Ne Combed"
    private Double warpCrimpPercentage; // e.g. 6.5%

    private Integer picksPerInch; // PPI e.g. 72
    private String weftCountNe; // e.g. "60/1 Ne Compact"
    private Double weftCrimpPercentage; // e.g. 4.5%

    // Weight in Grams per Meter
    private Double calculatedWarpWeightGrams;
    private Double calculatedWeftWeightGrams;
    private Double calculatedTotalGsm;

    // Cost Breakdown per Meter (INR)
    @Column(precision = 10, scale = 2)
    private BigDecimal warpYarnCostPerMeter;

    @Column(precision = 10, scale = 2)
    private BigDecimal weftYarnCostPerMeter;

    @Column(precision = 10, scale = 2)
    private BigDecimal sizingChemicalCostPerMeter;

    @Column(precision = 10, scale = 2)
    private BigDecimal weavingLoomCostPerMeter;

    @Column(precision = 10, scale = 2)
    private BigDecimal dyeingAndFinishingCostPerMeter;

    @Column(precision = 10, scale = 2)
    private BigDecimal millOverheadsPerMeter;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal netProductionCostPerMeter; // Sum of all costs

    private Double targetProfitMarginPct; // e.g. 20%

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal recommendedExMillPrice;

    private String preparedByMerchandiser;
    private LocalDate costingDate;
    private String remarks;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.costingDate == null) this.costingDate = LocalDate.now();
        if (this.targetProfitMarginPct == null) this.targetProfitMarginPct = 20.0;
        if (this.warpCrimpPercentage == null) this.warpCrimpPercentage = 6.0;
        if (this.weftCrimpPercentage == null) this.weftCrimpPercentage = 4.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCostingSheetNumber() { return costingSheetNumber; }
    public void setCostingSheetNumber(String costingSheetNumber) { this.costingSheetNumber = costingSheetNumber; }

    public String getQualityCode() { return qualityCode; }
    public void setQualityCode(String qualityCode) { this.qualityCode = qualityCode; }

    public String getFabricName() { return fabricName; }
    public void setFabricName(String fabricName) { this.fabricName = fabricName; }

    public String getWeaveType() { return weaveType; }
    public void setWeaveType(String weaveType) { this.weaveType = weaveType; }

    public Double getReedWidthInches() { return reedWidthInches; }
    public void setReedWidthInches(Double reedWidthInches) { this.reedWidthInches = reedWidthInches; }

    public Double getFinishedWidthInches() { return finishedWidthInches; }
    public void setFinishedWidthInches(Double finishedWidthInches) { this.finishedWidthInches = finishedWidthInches; }

    public Integer getTotalWarpEnds() { return totalWarpEnds; }
    public void setTotalWarpEnds(Integer totalWarpEnds) { this.totalWarpEnds = totalWarpEnds; }

    public String getWarpCountNe() { return warpCountNe; }
    public void setWarpCountNe(String warpCountNe) { this.warpCountNe = warpCountNe; }

    public Double getWarpCrimpPercentage() { return warpCrimpPercentage; }
    public void setWarpCrimpPercentage(Double warpCrimpPercentage) { this.warpCrimpPercentage = warpCrimpPercentage; }

    public Integer getPicksPerInch() { return picksPerInch; }
    public void setPicksPerInch(Integer picksPerInch) { this.picksPerInch = picksPerInch; }

    public String getWeftCountNe() { return weftCountNe; }
    public void setWeftCountNe(String weftCountNe) { this.weftCountNe = weftCountNe; }

    public Double getWeftCrimpPercentage() { return weftCrimpPercentage; }
    public void setWeftCrimpPercentage(Double weftCrimpPercentage) { this.weftCrimpPercentage = weftCrimpPercentage; }

    public Double getCalculatedWarpWeightGrams() { return calculatedWarpWeightGrams; }
    public void setCalculatedWarpWeightGrams(Double calculatedWarpWeightGrams) { this.calculatedWarpWeightGrams = calculatedWarpWeightGrams; }

    public Double getCalculatedWeftWeightGrams() { return calculatedWeftWeightGrams; }
    public void setCalculatedWeftWeightGrams(Double calculatedWeftWeightGrams) { this.calculatedWeftWeightGrams = calculatedWeftWeightGrams; }

    public Double getCalculatedTotalGsm() { return calculatedTotalGsm; }
    public void setCalculatedTotalGsm(Double calculatedTotalGsm) { this.calculatedTotalGsm = calculatedTotalGsm; }

    public BigDecimal getWarpYarnCostPerMeter() { return warpYarnCostPerMeter; }
    public void setWarpYarnCostPerMeter(BigDecimal warpYarnCostPerMeter) { this.warpYarnCostPerMeter = warpYarnCostPerMeter; }

    public BigDecimal getWeftYarnCostPerMeter() { return weftYarnCostPerMeter; }
    public void setWeftYarnCostPerMeter(BigDecimal weftYarnCostPerMeter) { this.weftYarnCostPerMeter = weftYarnCostPerMeter; }

    public BigDecimal getSizingChemicalCostPerMeter() { return sizingChemicalCostPerMeter; }
    public void setSizingChemicalCostPerMeter(BigDecimal sizingChemicalCostPerMeter) { this.sizingChemicalCostPerMeter = sizingChemicalCostPerMeter; }

    public BigDecimal getWeavingLoomCostPerMeter() { return weavingLoomCostPerMeter; }
    public void setWeavingLoomCostPerMeter(BigDecimal weavingLoomCostPerMeter) { this.weavingLoomCostPerMeter = weavingLoomCostPerMeter; }

    public BigDecimal getDyeingAndFinishingCostPerMeter() { return dyeingAndFinishingCostPerMeter; }
    public void setDyeingAndFinishingCostPerMeter(BigDecimal dyeingAndFinishingCostPerMeter) { this.dyeingAndFinishingCostPerMeter = dyeingAndFinishingCostPerMeter; }

    public BigDecimal getMillOverheadsPerMeter() { return millOverheadsPerMeter; }
    public void setMillOverheadsPerMeter(BigDecimal millOverheadsPerMeter) { this.millOverheadsPerMeter = millOverheadsPerMeter; }

    public BigDecimal getNetProductionCostPerMeter() { return netProductionCostPerMeter; }
    public void setNetProductionCostPerMeter(BigDecimal netProductionCostPerMeter) { this.netProductionCostPerMeter = netProductionCostPerMeter; }

    public Double getTargetProfitMarginPct() { return targetProfitMarginPct; }
    public void setTargetProfitMarginPct(Double targetProfitMarginPct) { this.targetProfitMarginPct = targetProfitMarginPct; }

    public BigDecimal getRecommendedExMillPrice() { return recommendedExMillPrice; }
    public void setRecommendedExMillPrice(BigDecimal recommendedExMillPrice) { this.recommendedExMillPrice = recommendedExMillPrice; }

    public String getPreparedByMerchandiser() { return preparedByMerchandiser; }
    public void setPreparedByMerchandiser(String preparedByMerchandiser) { this.preparedByMerchandiser = preparedByMerchandiser; }

    public LocalDate getCostingDate() { return costingDate; }
    public void setCostingDate(LocalDate costingDate) { this.costingDate = costingDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}