package com.fabricerp.erp.dto.request;

import java.math.BigDecimal;

public class StockInwardRequest {
    private Long fabricId;
    private Long supplierId;
    private Double addedMeters;
    private BigDecimal purchaseCostPerMeter;
    private String consignmentNumber;

    public Long getFabricId() { return fabricId; }
    public void setFabricId(Long fabricId) { this.fabricId = fabricId; }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public Double getAddedMeters() { return addedMeters; }
    public void setAddedMeters(Double addedMeters) { this.addedMeters = addedMeters; }

    public BigDecimal getPurchaseCostPerMeter() { return purchaseCostPerMeter; }
    public void setPurchaseCostPerMeter(BigDecimal purchaseCostPerMeter) { this.purchaseCostPerMeter = purchaseCostPerMeter; }

    public String getConsignmentNumber() { return consignmentNumber; }
    public void setConsignmentNumber(String consignmentNumber) { this.consignmentNumber = consignmentNumber; }
}