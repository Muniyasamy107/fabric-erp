package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.DailyShiftSettlement;
import com.fabricerp.erp.entity.InvoiceItem;
import com.fabricerp.erp.entity.WholesaleInvoice;
import com.fabricerp.erp.repository.DailyShiftSettlementRepository;
import com.fabricerp.erp.repository.WholesaleInvoiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final DailyShiftSettlementRepository settlementRepository;
    private final WholesaleInvoiceRepository invoiceRepository;

    public ShiftController(DailyShiftSettlementRepository settlementRepository,
                           WholesaleInvoiceRepository invoiceRepository) {
        this.settlementRepository = settlementRepository;
        this.invoiceRepository = invoiceRepository;
    }

    /**
     * Past closed shift Z-Reports.
     */
    @GetMapping("/history")
    public List<DailyShiftSettlement> getHistory() {
        return settlementRepository.findAllByOrderByIdDesc();
    }

    /**
     * Live drawer summary for today, computed from invoices dispatched today.
     * Counter/retail channels (card, UPI) become non-zero once a retail POS
     * module records them; advance-paid dispatches count as cash inflow.
     */
    @GetMapping("/today")
    public Map<String, Object> getTodayLiveSummary() {
        LocalDate today = LocalDate.now();
        List<WholesaleInvoice> invoices = invoiceRepository.findByDispatchDateBetween(
                today.atStartOfDay(), today.atTime(LocalTime.MAX));

        BigDecimal gross = BigDecimal.ZERO;
        BigDecimal cash = BigDecimal.ZERO;
        BigDecimal meters = BigDecimal.ZERO;

        for (WholesaleInvoice invoice : invoices) {
            BigDecimal total = invoice.getGrandTotalValue() != null ? invoice.getGrandTotalValue() : BigDecimal.ZERO;
            gross = gross.add(total);
            if ("ADVANCE".equals(invoice.getPaymentTerms())) {
                cash = cash.add(total);
            }
            if (invoice.getItems() != null) {
                for (InvoiceItem item : invoice.getItems()) {
                    if (item.getShippedMeters() != null) {
                        meters = meters.add(BigDecimal.valueOf(item.getShippedMeters()));
                    }
                }
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("shiftDate", today);
        summary.put("totalGrossSales", gross);
        summary.put("cashSales", cash);
        summary.put("cardSales", BigDecimal.ZERO);
        summary.put("upiSales", BigDecimal.ZERO);
        summary.put("totalBillsCount", invoices.size());
        summary.put("totalMetersSold", meters);
        return summary;
    }

    /**
     * Close the day's shift register and generate the official Z-Report.
     */
    @PostMapping("/close")
    public ResponseEntity<DailyShiftSettlement> closeShiftRegister(@RequestBody DailyShiftSettlement settlement) {
        settlement.setId(null);
        if (settlement.getShiftDate() == null) {
            settlement.setShiftDate(LocalDate.now());
        }

        BigDecimal openingFloat = orZero(settlement.getOpeningFloat());
        BigDecimal cashSales = orZero(settlement.getCashSales());
        BigDecimal actualCounted = orZero(settlement.getActualCashCounted());

        BigDecimal expected = openingFloat.add(cashSales);
        settlement.setExpectedCashInDrawer(expected);
        settlement.setCashDifference(actualCounted.subtract(expected));
        settlement.setStatus("CLOSED");
        settlement.setClosedAt(LocalDateTime.now());

        String dayStamp = settlement.getShiftDate().format(DateTimeFormatter.BASIC_ISO_DATE);
        long seq = settlementRepository.countByShiftDate(settlement.getShiftDate()) + 1;
        settlement.setZReportNumber("Z-REP-" + dayStamp + "-" + String.format("%03d", seq));

        return ResponseEntity.ok(settlementRepository.save(settlement));
    }

    private BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
