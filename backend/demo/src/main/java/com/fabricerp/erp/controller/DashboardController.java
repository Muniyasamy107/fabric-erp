package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.ProductionJob;
import com.fabricerp.erp.entity.WholesaleInvoice;
import com.fabricerp.erp.entity.InvoiceItem;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.ProductionJobRepository;
import com.fabricerp.erp.repository.WholesaleInvoiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final WholesaleInvoiceRepository invoiceRepository;
    private final FabricRepository fabricRepository;
    private final ProductionJobRepository productionJobRepository;

    public DashboardController(WholesaleInvoiceRepository invoiceRepository,
            FabricRepository fabricRepository,
            ProductionJobRepository productionJobRepository) {
        this.invoiceRepository = invoiceRepository;
        this.fabricRepository = fabricRepository;
        this.productionJobRepository = productionJobRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<WholesaleInvoice> allInvoices = invoiceRepository.findAll();
        List<FabricProduct> allFabrics = fabricRepository.findAll();
        List<ProductionJob> allJobs = productionJobRepository.findAll();

        BigDecimal totalRevenue = BigDecimal.ZERO;
        double totalMetersShipped = 0.0;

        for (WholesaleInvoice inv : allInvoices) {
            if (inv.getGrandTotalValue() != null) {
                totalRevenue = totalRevenue.add(inv.getGrandTotalValue());
            }
            if (inv.getItems() != null) {
                for (InvoiceItem item : inv.getItems()) {
                    if (item.getShippedMeters() != null) {
                        totalMetersShipped += item.getShippedMeters();
                    }
                }
            }
        }

        List<FabricProduct> lowStockList = new ArrayList<>();
        for (FabricProduct f : allFabrics) {
            double stock = f.getTotalStockMeters() != null ? f.getTotalStockMeters() : 0.0;
            double alert = f.getMinStockAlert() != null ? f.getMinStockAlert() : 50.0;
            if (stock <= alert) {
                lowStockList.add(f);
            }
        }

        long activeJobs = allJobs.stream()
                .filter(j -> j.getJobStatus() != null && !"COMPLETED".equalsIgnoreCase(j.getJobStatus()))
                .count();

        // --- Weekly OEE % Trend Series ---
        List<Map<String, Object>> weeklyOeeTrends = List.of(
                Map.of("day", "Mon", "oee", 86.4, "target", 85.0, "availability", 91.2),
                Map.of("day", "Tue", "oee", 88.2, "target", 85.0, "availability", 93.0),
                Map.of("day", "Wed", "oee", 84.7, "target", 85.0, "availability", 89.5),
                Map.of("day", "Thu", "oee", 89.6, "target", 85.0, "availability", 94.8),
                Map.of("day", "Fri", "oee", 91.3, "target", 85.0, "availability", 96.1),
                Map.of("day", "Sat", "oee", 87.8, "target", 85.0, "availability", 92.4),
                Map.of("day", "Sun", "oee", 90.1, "target", 85.0, "availability", 95.0));

        // --- Monthly Woven Yardage vs Yarn Consumption ---
        List<Map<String, Object>> monthlyProduction = List.of(
                Map.of("month", "Apr", "wovenMeters", 24500, "yarnConsumedKg", 2200),
                Map.of("month", "May", "wovenMeters", 28900, "yarnConsumedKg", 2600),
                Map.of("month", "Jun", "wovenMeters", 31200, "yarnConsumedKg", 2800),
                Map.of("month", "Jul", "wovenMeters", 35600, "yarnConsumedKg", 3200),
                Map.of("month", "Aug", "wovenMeters", 38400, "yarnConsumedKg", 3450),
                Map.of("month", "Sep", "wovenMeters", 42000, "yarnConsumedKg", 3780));

        // --- Plant Steam & Energy Distribution ---
        List<Map<String, Object>> energyDistribution = List.of(
                Map.of("name", "Dye House Jet Vessels", "value", 65, "color", "#D4AF37"),
                Map.of("name", "Stenter Calendering Line", "value", 20, "color", "#58A6FF"),
                Map.of("name", "Sizing Cylinder Drying", "value", 15, "color", "#3FB950"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrdersCount", allInvoices.size());
        stats.put("totalMetersSold", totalMetersShipped);
        stats.put("lowStockCount", lowStockList.size());
        stats.put("activeProductionJobs", activeJobs);
        stats.put("recentOrders", allInvoices.stream().limit(5).toList());
        stats.put("lowStockFabrics", lowStockList);
        stats.put("weeklyOeeTrends", weeklyOeeTrends);
        stats.put("monthlyProduction", monthlyProduction);
        stats.put("energyDistribution", energyDistribution);

        return ResponseEntity.ok(stats);
    }
}