package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Official end-of-day cash drawer settlement / Z-Report for the mill sales counter.
 */
@Entity
@Table(name = "daily_shift_settlements")
public class DailyShiftSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String zReportNumber; // e.g. Z-REP-20260908-001

    private LocalDate shiftDate;
    private String cashierUsername;
    private String cashierFullName;

    @Column(precision = 12, scale = 2)
    private BigDecimal openingFloat;

    @Column(precision = 12, scale = 2)
    private BigDecimal cashSales;

    @Column(precision = 12, scale = 2)
    private BigDecimal cardSales;

    @Column(precision = 12, scale = 2)
    private BigDecimal upiSales;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalGrossSales;

    private Integer totalBillsCount;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalMetersSold;

    @Column(precision = 12, scale = 2)
    private BigDecimal actualCashCounted;

    @Column(precision = 12, scale = 2)
    private BigDecimal expectedCashInDrawer;

    @Column(precision = 12, scale = 2)
    private BigDecimal cashDifference;

    @Column(length = 1000)
    private String closingNotes;

    private String status;
    private LocalDateTime closedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getZReportNumber() { return zReportNumber; }
    public void setZReportNumber(String zReportNumber) { this.zReportNumber = zReportNumber; }

    public LocalDate getShiftDate() { return shiftDate; }
    public void setShiftDate(LocalDate shiftDate) { this.shiftDate = shiftDate; }

    public String getCashierUsername() { return cashierUsername; }
    public void setCashierUsername(String cashierUsername) { this.cashierUsername = cashierUsername; }

    public String getCashierFullName() { return cashierFullName; }
    public void setCashierFullName(String cashierFullName) { this.cashierFullName = cashierFullName; }

    public BigDecimal getOpeningFloat() { return openingFloat; }
    public void setOpeningFloat(BigDecimal openingFloat) { this.openingFloat = openingFloat; }

    public BigDecimal getCashSales() { return cashSales; }
    public void setCashSales(BigDecimal cashSales) { this.cashSales = cashSales; }

    public BigDecimal getCardSales() { return cardSales; }
    public void setCardSales(BigDecimal cardSales) { this.cardSales = cardSales; }

    public BigDecimal getUpiSales() { return upiSales; }
    public void setUpiSales(BigDecimal upiSales) { this.upiSales = upiSales; }

    public BigDecimal getTotalGrossSales() { return totalGrossSales; }
    public void setTotalGrossSales(BigDecimal totalGrossSales) { this.totalGrossSales = totalGrossSales; }

    public Integer getTotalBillsCount() { return totalBillsCount; }
    public void setTotalBillsCount(Integer totalBillsCount) { this.totalBillsCount = totalBillsCount; }

    public BigDecimal getTotalMetersSold() { return totalMetersSold; }
    public void setTotalMetersSold(BigDecimal totalMetersSold) { this.totalMetersSold = totalMetersSold; }

    public BigDecimal getActualCashCounted() { return actualCashCounted; }
    public void setActualCashCounted(BigDecimal actualCashCounted) { this.actualCashCounted = actualCashCounted; }

    public BigDecimal getExpectedCashInDrawer() { return expectedCashInDrawer; }
    public void setExpectedCashInDrawer(BigDecimal expectedCashInDrawer) { this.expectedCashInDrawer = expectedCashInDrawer; }

    public BigDecimal getCashDifference() { return cashDifference; }
    public void setCashDifference(BigDecimal cashDifference) { this.cashDifference = cashDifference; }

    public String getClosingNotes() { return closingNotes; }
    public void setClosingNotes(String closingNotes) { this.closingNotes = closingNotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }
}
