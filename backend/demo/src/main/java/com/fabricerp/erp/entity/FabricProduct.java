package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fabric_products")
public class FabricProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quality_code", nullable = false, unique = true)
    private String qualityCode;

    @Column(name = "fabric_name", nullable = false)
    private String fabricName;

    @Column(name = "fabric_type")
    private String fabricType;

    @Column(name = "gsm")
    private Integer gsm;

    @Column(name = "warehouse_bin_location")
    private String warehouseBinLocation;

    @Column(name = "hsn_code")
    private String hsnCode;

    @Column(name = "season_collection")
    private String seasonCollection;

    @Column(name = "recommended_garment")
    private String recommendedGarment;

    @Column(name = "image_url", length = 2000)
    private String imageUrl;

    @Column(name = "wholesale_price_per_meter", precision = 10, scale = 2)
    private BigDecimal wholesalePricePerMeter;

    @Column(name = "total_stock_meters")
    private Double totalStockMeters;

    @Column(name = "min_stock_alert")
    private Double minStockAlert;

    @Column(name = "gst_rate")
    private Double gstRate;

    @Column(name = "is_remnant")
    private Boolean isRemnant;

    @Column(name = "remnant_discount_pct")
    private Double remnantDiscountPct;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.totalStockMeters == null) this.totalStockMeters = 0.0;
        if (this.minStockAlert == null) this.minStockAlert = 50.0;
        if (this.gstRate == null) this.gstRate = 5.0;
        if (this.wholesalePricePerMeter == null) this.wholesalePricePerMeter = BigDecimal.ZERO;
        if (this.isRemnant == null) this.isRemnant = false;
        if (this.remnantDiscountPct == null) this.remnantDiscountPct = 0.0;
        if (this.warehouseBinLocation == null) this.warehouseBinLocation = "Rack A-01";
        if (this.hsnCode == null) this.hsnCode = "5007";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQualityCode() { return qualityCode; }
    public void setQualityCode(String qualityCode) { this.qualityCode = qualityCode; }

    public String getFabricName() { return fabricName; }
    public void setFabricName(String fabricName) { this.fabricName = fabricName; }

    public String getFabricType() { return fabricType; }
    public void setFabricType(String fabricType) { this.fabricType = fabricType; }

    public Integer getGsm() { return gsm; }
    public void setGsm(Integer gsm) { this.gsm = gsm; }

    public String getWarehouseBinLocation() { return warehouseBinLocation; }
    public void setWarehouseBinLocation(String warehouseBinLocation) { this.warehouseBinLocation = warehouseBinLocation; }

    public String getHsnCode() { return hsnCode; }
    public void setHsnCode(String hsnCode) { this.hsnCode = hsnCode; }

    public String getSeasonCollection() { return seasonCollection; }
    public void setSeasonCollection(String seasonCollection) { this.seasonCollection = seasonCollection; }

    public String getRecommendedGarment() { return recommendedGarment; }
    public void setRecommendedGarment(String recommendedGarment) { this.recommendedGarment = recommendedGarment; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getWholesalePricePerMeter() { return wholesalePricePerMeter; }
    public void setWholesalePricePerMeter(BigDecimal wholesalePricePerMeter) { this.wholesalePricePerMeter = wholesalePricePerMeter; }

    public Double getTotalStockMeters() { return totalStockMeters; }
    public void setTotalStockMeters(Double totalStockMeters) { this.totalStockMeters = totalStockMeters; }

    public Double getMinStockAlert() { return minStockAlert; }
    public void setMinStockAlert(Double minStockAlert) { this.minStockAlert = minStockAlert; }

    // Reorder Alert Level Aliases (Ensures fail-safe compilation across all controllers)
    public Double getReorderAlertLevel() { return minStockAlert; }
    public void setReorderAlertLevel(Double reorderAlertLevel) { this.minStockAlert = reorderAlertLevel; }

    public Double getGstRate() { return gstRate; }
    public void setGstRate(Double gstRate) { this.gstRate = gstRate; }

    public Boolean getIsRemnant() { return isRemnant; }
    public void setIsRemnant(Boolean isRemnant) { this.isRemnant = isRemnant; }

    public Double getRemnantDiscountPct() { return remnantDiscountPct; }
    public void setRemnantDiscountPct(Double remnantDiscountPct) { this.remnantDiscountPct = remnantDiscountPct; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}