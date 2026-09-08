package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricCostSheet;
import com.fabricerp.erp.repository.FabricCostSheetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/costing")
public class CostingController {

    private final FabricCostSheetRepository costRepository;

    public CostingController(FabricCostSheetRepository costRepository) {
        this.costRepository = costRepository;
    }

    @GetMapping("/sheets")
    public List<FabricCostSheet> getAllCostSheets() {
        return costRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateAndSaveCostSheet(@RequestBody FabricCostSheet sheet) {
        if (sheet.getFabricName() == null || sheet.getFabricName().isBlank()) {
            return ResponseEntity.badRequest().body("Fabric quality name is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        sheet.setCostingSheetNumber("COST-BOM-" + timestamp);

        // 1. Calculate Net Production Cost per meter
        BigDecimal totalCost = BigDecimal.ZERO;
        if (sheet.getWarpYarnCostPerMeter() != null) totalCost = totalCost.add(sheet.getWarpYarnCostPerMeter());
        if (sheet.getWeftYarnCostPerMeter() != null) totalCost = totalCost.add(sheet.getWeftYarnCostPerMeter());
        if (sheet.getSizingChemicalCostPerMeter() != null) totalCost = totalCost.add(sheet.getSizingChemicalCostPerMeter());
        if (sheet.getWeavingLoomCostPerMeter() != null) totalCost = totalCost.add(sheet.getWeavingLoomCostPerMeter());
        if (sheet.getDyeingAndFinishingCostPerMeter() != null) totalCost = totalCost.add(sheet.getDyeingAndFinishingCostPerMeter());
        if (sheet.getMillOverheadsPerMeter() != null) totalCost = totalCost.add(sheet.getMillOverheadsPerMeter());

        sheet.setNetProductionCostPerMeter(totalCost.setScale(2, RoundingMode.HALF_UP));

        // 2. Calculate Recommended Ex-Mill Price with Margin
        double marginPct = sheet.getTargetProfitMarginPct() != null ? sheet.getTargetProfitMarginPct() : 20.0;
        BigDecimal marginFactor = BigDecimal.valueOf(1.0 + (marginPct / 100.0));
        BigDecimal exMillPrice = totalCost.multiply(marginFactor).setScale(2, RoundingMode.HALF_UP);
        sheet.setRecommendedExMillPrice(exMillPrice);

        return ResponseEntity.ok(costRepository.save(sheet));
    }
}