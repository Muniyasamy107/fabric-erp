package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cad_sample_designs")
public class CadSampleDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String designCode; // e.g. "CAD-2026-HERRINGBONE-01"

    @Column(nullable = false)
    private String designName; // e.g. "Royal Italian Silk Herringbone Twill"

    private String targetBuyerBrand; // e.g. "Armani Group Milan / Raymond Suiting"
    private String seasonCollection; // e.g. "Fall/Winter 2026", "Royal Wedding Collection"

    // Technical Weave Parameters
    private String weaveType; // HERRINGBONE_TWILL, SATIN_STRIPE, GLEN_PLAID_CHECK, DOBBY_TEXTURE, JACQUARD_DAMASK
    private Integer numberOfHealdShafts; // e.g. 16 Shafts Dobby
    private Integer endsPerInchEpi; // e.g. 110 EPI
    private Integer picksPerInchPpi; // e.g. 84 PPI

    private String warpYarnSpec; // e.g. "Mulberry Silk 20/22D Midnight Navy"
    private String weftYarnSpec; // e.g. "Cashmere Wool 2/80s Champagne Gold"

    @Column(length = 1000)
    private String colorRepeatSequence; // e.g. "24 Ends Navy + 4 Ends Gold + 24 Ends Navy"

    private Double sampleYardageRequiredMeters; // e.g. 8.0 meters sample strike-off
    private Double sampleYardageProducedMeters;

    private String sampleDevelopmentStatus; // DESIGN_DRAFTING, SAMPLE_WARPING, SAMPLE_LOOM_WEAVING, FINISHED_SAMPLE, BUYER_APPROVED, RE_SAMPLE_REQUESTED

    private String buyerFeedbackComments;
    private String courierAwbTrackingNumber; // e.g. "DHL-EXP-88902144"

    private String cadTextileDesignerName;
    private LocalDate creationDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.creationDate == null) this.creationDate = LocalDate.now();
        if (this.sampleDevelopmentStatus == null) this.sampleDevelopmentStatus = "DESIGN_DRAFTING";
        if (this.numberOfHealdShafts == null) this.numberOfHealdShafts = 16;
        if (this.endsPerInchEpi == null) this.endsPerInchEpi = 110;
        if (this.picksPerInchPpi == null) this.picksPerInchPpi = 84;
        if (this.sampleYardageProducedMeters == null) this.sampleYardageProducedMeters = 0.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDesignCode() { return designCode; }
    public void setDesignCode(String designCode) { this.designCode = designCode; }

    public String getDesignName() { return designName; }
    public void setDesignName(String designName) { this.designName = designName; }

    public String getTargetBuyerBrand() { return targetBuyerBrand; }
    public void setTargetBuyerBrand(String targetBuyerBrand) { this.targetBuyerBrand = targetBuyerBrand; }

    public String getSeasonCollection() { return seasonCollection; }
    public void setSeasonCollection(String seasonCollection) { this.seasonCollection = seasonCollection; }

    public String getWeaveType() { return weaveType; }
    public void setWeaveType(String weaveType) { this.weaveType = weaveType; }

    public Integer getNumberOfHealdShafts() { return numberOfHealdShafts; }
    public void setNumberOfHealdShafts(Integer numberOfHealdShafts) { this.numberOfHealdShafts = numberOfHealdShafts; }

    public Integer getEndsPerInchEpi() { return endsPerInchEpi; }
    public void setEndsPerInchEpi(Integer endsPerInchEpi) { this.endsPerInchEpi = endsPerInchEpi; }

    public Integer getPicksPerInchPpi() { return picksPerInchPpi; }
    public void setPicksPerInchPpi(Integer picksPerInchPpi) { this.picksPerInchPpi = picksPerInchPpi; }

    public String getWarpYarnSpec() { return warpYarnSpec; }
    public void setWarpYarnSpec(String warpYarnSpec) { this.warpYarnSpec = warpYarnSpec; }

    public String getWeftYarnSpec() { return weftYarnSpec; }
    public void setWeftYarnSpec(String weftYarnSpec) { this.weftYarnSpec = weftYarnSpec; }

    public String getColorRepeatSequence() { return colorRepeatSequence; }
    public void setColorRepeatSequence(String colorRepeatSequence) { this.colorRepeatSequence = colorRepeatSequence; }

    public Double getSampleYardageRequiredMeters() { return sampleYardageRequiredMeters; }
    public void setSampleYardageRequiredMeters(Double sampleYardageRequiredMeters) { this.sampleYardageRequiredMeters = sampleYardageRequiredMeters; }

    public Double getSampleYardageProducedMeters() { return sampleYardageProducedMeters; }
    public void setSampleYardageProducedMeters(Double sampleYardageProducedMeters) { this.sampleYardageProducedMeters = sampleYardageProducedMeters; }

    public String getSampleDevelopmentStatus() { return sampleDevelopmentStatus; }
    public void setSampleDevelopmentStatus(String sampleDevelopmentStatus) { this.sampleDevelopmentStatus = sampleDevelopmentStatus; }

    public String getBuyerFeedbackComments() { return buyerFeedbackComments; }
    public void setBuyerFeedbackComments(String buyerFeedbackComments) { this.buyerFeedbackComments = buyerFeedbackComments; }

    public String getCourierAwbTrackingNumber() { return courierAwbTrackingNumber; }
    public void setCourierAwbTrackingNumber(String courierAwbTrackingNumber) { this.courierAwbTrackingNumber = courierAwbTrackingNumber; }

    public String getCadTextileDesignerName() { return cadTextileDesignerName; }
    public void setCadTextileDesignerName(String cadTextileDesignerName) { this.cadTextileDesignerName = cadTextileDesignerName; }

    public LocalDate getCreationDate() { return creationDate; }
    public void setCreationDate(LocalDate creationDate) { this.creationDate = creationDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}