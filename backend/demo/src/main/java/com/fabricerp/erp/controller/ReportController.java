package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.*;
import com.fabricerp.erp.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final WholesaleInvoiceRepository invoiceRepository;
    private final ProductionJobRepository productionJobRepository;
    private final QualityInspectionRepository qcRepository;
    private final WeaverWageRepository wageRepository;
    private final YarnInventoryRepository yarnRepository;

    public ReportController(WholesaleInvoiceRepository invoiceRepository,
                            ProductionJobRepository productionJobRepository,
                            QualityInspectionRepository qcRepository,
                            WeaverWageRepository wageRepository,
                            YarnInventoryRepository yarnRepository) {
        this.invoiceRepository = invoiceRepository;
        this.productionJobRepository = productionJobRepository;
        this.qcRepository = qcRepository;
        this.wageRepository = wageRepository;
        this.yarnRepository = yarnRepository;
    }

    @GetMapping("/financial-summary")
    public ResponseEntity<Map<String, Object>> getFinancialSummary() {
        List<WholesaleInvoice> invoices = invoiceRepository.findAll();
        List<ProductionJob> jobs = productionJobRepository.findAll();
        List<QualityInspectionReport> qcReports = qcRepository.findAll();
        List<WeaverWageEntry> wages = wageRepository.findAll();
        List<YarnInventory> yarnStock = yarnRepository.findAll();

        BigDecimal totalSales = BigDecimal.ZERO;
        double totalMetersSold = 0.0;

        for (WholesaleInvoice inv : invoices) {
            if (inv.getGrandTotalValue() != null) {
                totalSales = totalSales.add(inv.getGrandTotalValue());
            }
            if (inv.getItems() != null) {
                for (InvoiceItem item : inv.getItems()) {
                    if (item.getShippedMeters() != null) {
                        totalMetersSold += item.getShippedMeters();
                    }
                }
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalSales);
        summary.put("totalMetersSold", totalMetersSold);
        summary.put("totalInvoicesCount", invoices.size());
        summary.put("invoicesList", invoices);
        summary.put("productionJobsList", jobs);
        summary.put("qcReportsList", qcReports);
        summary.put("weaverWagesList", wages);
        summary.put("yarnStockList", yarnStock);

        return ResponseEntity.ok(summary);
    }
}