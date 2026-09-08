package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dye_recipes")
public class DyeRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String recipeCode; // e.g. DYE-NAVY-904

    @Column(nullable = false)
    private String shadeName; // e.g. "Royal Midnight Navy"

    private String pantoneTcxCode; // e.g. "Pantone 19-4052 TCX"
    private String colorHex; // e.g. "#1B2A4A" for visual swatch display

    private String dyeClass; // Reactive Dye, Acid Dye for Silk, Disperse Dye, Vat Dye
    private String liquorRatio; // e.g. "1:8" or "1:10"
    private Integer dyeingTemperatureCelsius; // e.g. 85°C

    @Column(length = 1500)
    private String chemicalFormulationRecipe; // Dyestuffs %, Salt g/l, Soda Ash g/l, Levelling agent

    private String labDipStatus; // LAB_DIP_APPROVED, SAMPLE_PENDING, RE_MATCH_REQUIRED
    private Double deltaETolerance; // e.g. 0.45 (Tolerance < 0.8)

    private String masterDyerName;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.liquorRatio == null) this.liquorRatio = "1:8";
        if (this.dyeingTemperatureCelsius == null) this.dyeingTemperatureCelsius = 85;
        if (this.labDipStatus == null) this.labDipStatus = "LAB_DIP_APPROVED";
        if (this.deltaETolerance == null) this.deltaETolerance = 0.50;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipeCode() { return recipeCode; }
    public void setRecipeCode(String recipeCode) { this.recipeCode = recipeCode; }

    public String getShadeName() { return shadeName; }
    public void setShadeName(String shadeName) { this.shadeName = shadeName; }

    public String getPantoneTcxCode() { return pantoneTcxCode; }
    public void setPantoneTcxCode(String pantoneTcxCode) { this.pantoneTcxCode = pantoneTcxCode; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public String getDyeClass() { return dyeClass; }
    public void setDyeClass(String dyeClass) { this.dyeClass = dyeClass; }

    public String getLiquorRatio() { return liquorRatio; }
    public void setLiquorRatio(String liquorRatio) { this.liquorRatio = liquorRatio; }

    public Integer getDyeingTemperatureCelsius() { return dyeingTemperatureCelsius; }
    public void setDyeingTemperatureCelsius(Integer dyeingTemperatureCelsius) { this.dyeingTemperatureCelsius = dyeingTemperatureCelsius; }

    public String getChemicalFormulationRecipe() { return chemicalFormulationRecipe; }
    public void setChemicalFormulationRecipe(String chemicalFormulationRecipe) { this.chemicalFormulationRecipe = chemicalFormulationRecipe; }

    public String getLabDipStatus() { return labDipStatus; }
    public void setLabDipStatus(String labDipStatus) { this.labDipStatus = labDipStatus; }

    public Double getDeltaETolerance() { return deltaETolerance; }
    public void setDeltaETolerance(Double deltaETolerance) { this.deltaETolerance = deltaETolerance; }

    public String getMasterDyerName() { return masterDyerName; }
    public void setMasterDyerName(String masterDyerName) { this.masterDyerName = masterDyerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}