package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fabricId;
    private String itemCode;
    private String fabricName;
    private String fabricType;

    private Double orderedMeters;

    @Column(precision = 10, scale = 2)
    private BigDecimal estimatedCostPerMeter;

    @Column(precision = 10, scale = 2)
    private BigDecimal subTotal;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFabricId() { return fabricId; }
    public void setFabricId(Long fabricId) { this.fabricId = fabricId; }

    public String getItemCode() { return itemCode; }
    public void setItemCode(String itemCode) { this.itemCode = itemCode; }

    public String getFabricName() { return fabricName; }
    public void setFabricName(String fabricName) { this.fabricName = fabricName; }

    public String getFabricType() { return fabricType; }
    public void setFabricType(String fabricType) { this.fabricType = fabricType; }

    public Double getOrderedMeters() { return orderedMeters; }
    public void setOrderedMeters(Double orderedMeters) { this.orderedMeters = orderedMeters; }

    public BigDecimal getEstimatedCostPerMeter() { return estimatedCostPerMeter; }
    public void setEstimatedCostPerMeter(BigDecimal estimatedCostPerMeter) { this.estimatedCostPerMeter = estimatedCostPerMeter; }

    public BigDecimal getSubTotal() { return subTotal; }
    public void setSubTotal(BigDecimal subTotal) { this.subTotal = subTotal; }
}