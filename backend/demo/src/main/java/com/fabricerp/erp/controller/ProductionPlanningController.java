package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.ProductionPlan;
import com.fabricerp.erp.repository.ProductionPlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/planning")
public class ProductionPlanningController {

    private final ProductionPlanRepository planRepository;

    public ProductionPlanningController(ProductionPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @GetMapping("/plans")
    public List<ProductionPlan> getAllPlans() {
        return planRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/create-plan")
    public ResponseEntity<?> createPlan(@RequestBody ProductionPlan plan) {
        if (plan.getTargetMeterage() == null || plan.getTargetMeterage() <= 0) {
            return ResponseEntity.badRequest().body("Valid target meterage is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        plan.setPlanNumber("PLAN-MRP-" + timestamp);

        // --- Automatic MRP Formula Engine ---
        double meters = plan.getTargetMeterage();

        // 1. Warp Yarn Requirement (approx 85g/m + 3% creel waste)
        double warpKg = (meters * 0.088);
        plan.setRequiredWarpYarnKg(Math.round(warpKg * 10.0) / 10.0);

        // 2. Weft Yarn Requirement (approx 65g/m + 2% waste)
        double weftKg = (meters * 0.067);
        plan.setRequiredWeftYarnKg(Math.round(weftKg * 10.0) / 10.0);

        // 3. Sizing Chemicals (approx 8g/m)
        double sizingKg = (meters * 0.008);
        plan.setRequiredSizingChemicalKg(Math.round(sizingKg * 10.0) / 10.0);

        // 4. Dyeing & Finishing Auxiliaries (approx 15g/m)
        double dyesKg = (meters * 0.015);
        plan.setRequiredDyesAndAuxiliariesKg(Math.round(dyesKg * 10.0) / 10.0);

        // 5. Loom Capacity Estimation (1 Loom produces approx 250m/day)
        int looms = plan.getAllocatedLoomsCount() != null && plan.getAllocatedLoomsCount() > 0 ? plan.getAllocatedLoomsCount() : 6;
        plan.setAllocatedLoomsCount(looms);
        int days = (int) Math.ceil(meters / (looms * 250.0));
        plan.setEstimatedLoomDays(Math.max(1, days));

        if (plan.getCurrentStage() == null) {
            plan.setCurrentStage("YARN_PROCUREMENT");
        }

        return ResponseEntity.ok(planRepository.save(plan));
    }

    @PutMapping("/plans/{id}/stage")
    public ResponseEntity<?> updatePlanStage(@PathVariable Long id, @RequestParam String stage) {
        ProductionPlan p = planRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        p.setCurrentStage(stage);
        return ResponseEntity.ok(planRepository.save(p));
    }
}