package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "export_contracts")
public class ExportContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String exportContractNumber; // e.g. "EXP-2026-9021"

    @Column(nullable = false)
    private String buyerCompanyName; // e.g. "Armani Group Milan / Ralph Lauren NYC"

    private String buyerCountry; // e.g. "Italy", "United States", "United Kingdom"
    private String buyerContactEmail;

    private String fabricProductName;
    private Double contractedMeters;

    private String tradeCurrency; // USD, EUR, GBP
    
    @Column(precision = 10, scale = 2)
    private BigDecimal pricePerMeterForeignCurrency; // e.g. $4.50 / meter

    @Column(precision = 12, scale = 2)
    private BigDecimal totalContractValueForeign; // e.g. $45,000.00

    @Column(precision = 12, scale = 2)
    private BigDecimal totalInrRealizationValue; // in INR (e.g. ₹37,35,000)

    // International Shipping & Trade Terms
    private String incoterms; // FOB_CHENNAI, CIF_HAMBURG, CIF_NEW_YORK, EX_MILL
    private String portOfLoading; // e.g. "Chennai Port (INMAA)"
    private String portOfDischarge; // e.g. "Port of Hamburg (DEHAM)"
    private String shippingContainerMode; // 20FT_FCL, 40FT_HQ, LCL_AIR_CARGO

    // Financial Letter of Credit (LC) Details
    private String lcNumber; // e.g. "LC-HSBC-889021"
    private String lcIssuingBank; // e.g. "HSBC Bank London"
    private LocalDate lcExpiryDate;

    private String contractStatus; // DRAFT, LC_CONFIRMED, UNDER_PRODUCTION, SHIPPED_ON_BOARD, SETTLED

    private LocalDate expectedShipmentDate;
    private String bankSwiftCode;
    private String customDeclarationRemarks;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.contractStatus == null) this.contractStatus = "LC_CONFIRMED";
        if (this.tradeCurrency == null) this.tradeCurrency = "USD";
        if (this.incoterms == null) this.incoterms = "FOB_CHENNAI";
        if (this.portOfLoading == null) this.portOfLoading = "Chennai Port (INMAA)";
        if (this.bankSwiftCode == null) this.bankSwiftCode = "KAKTINBB001";
        if (this.expectedShipmentDate == null) this.expectedShipmentDate = LocalDate.now().plusDays(45);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getExportContractNumber() { return exportContractNumber; }
    public void setExportContractNumber(String exportContractNumber) { this.exportContractNumber = exportContractNumber; }

    public String getBuyerCompanyName() { return buyerCompanyName; }
    public void setBuyerCompanyName(String buyerCompanyName) { this.buyerCompanyName = buyerCompanyName; }

    public String getBuyerCountry() { return buyerCountry; }
    public void setBuyerCountry(String buyerCountry) { this.buyerCountry = buyerCountry; }

    public String getBuyerContactEmail() { return buyerContactEmail; }
    public void setBuyerContactEmail(String buyerContactEmail) { this.buyerContactEmail = buyerContactEmail; }

    public String getFabricProductName() { return fabricProductName; }
    public void setFabricProductName(String fabricProductName) { this.fabricProductName = fabricProductName; }

    public Double getContractedMeters() { return contractedMeters; }
    public void setContractedMeters(Double contractedMeters) { this.contractedMeters = contractedMeters; }

    public String getTradeCurrency() { return tradeCurrency; }
    public void setTradeCurrency(String tradeCurrency) { this.tradeCurrency = tradeCurrency; }

    public BigDecimal getPricePerMeterForeignCurrency() { return pricePerMeterForeignCurrency; }
    public void setPricePerMeterForeignCurrency(BigDecimal pricePerMeterForeignCurrency) { this.pricePerMeterForeignCurrency = pricePerMeterForeignCurrency; }

    public BigDecimal getTotalContractValueForeign() { return totalContractValueForeign; }
    public void setTotalContractValueForeign(BigDecimal totalContractValueForeign) { this.totalContractValueForeign = totalContractValueForeign; }

    public BigDecimal getTotalInrRealizationValue() { return totalInrRealizationValue; }
    public void setTotalInrRealizationValue(BigDecimal totalInrRealizationValue) { this.totalInrRealizationValue = totalInrRealizationValue; }

    public String getIncoterms() { return incoterms; }
    public void setIncoterms(String incoterms) { this.incoterms = incoterms; }

    public String getPortOfLoading() { return portOfLoading; }
    public void setPortOfLoading(String portOfLoading) { this.portOfLoading = portOfLoading; }

    public String getPortOfDischarge() { return portOfDischarge; }
    public void setPortOfDischarge(String portOfDischarge) { this.portOfDischarge = portOfDischarge; }

    public String getShippingContainerMode() { return shippingContainerMode; }
    public void setShippingContainerMode(String shippingContainerMode) { this.shippingContainerMode = shippingContainerMode; }

    public String getLcNumber() { return lcNumber; }
    public void setLcNumber(String lcNumber) { this.lcNumber = lcNumber; }

    public String getLcIssuingBank() { return lcIssuingBank; }
    public void setLcIssuingBank(String lcIssuingBank) { this.lcIssuingBank = lcIssuingBank; }

    public LocalDate getLcExpiryDate() { return lcExpiryDate; }
    public void setLcExpiryDate(LocalDate lcExpiryDate) { this.lcExpiryDate = lcExpiryDate; }

    public String getContractStatus() { return contractStatus; }
    public void setContractStatus(String contractStatus) { this.contractStatus = contractStatus; }

    public LocalDate getExpectedShipmentDate() { return expectedShipmentDate; }
    public void setExpectedShipmentDate(LocalDate expectedShipmentDate) { this.expectedShipmentDate = expectedShipmentDate; }

    public String getBankSwiftCode() { return bankSwiftCode; }
    public void setBankSwiftCode(String bankSwiftCode) { this.bankSwiftCode = bankSwiftCode; }

    public String getCustomDeclarationRemarks() { return customDeclarationRemarks; }
    public void setCustomDeclarationRemarks(String customDeclarationRemarks) { this.customDeclarationRemarks = customDeclarationRemarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}