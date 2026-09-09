package com.fabricerp.erp.config;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.ProductionPlan;
import com.fabricerp.erp.entity.StockMovement;
import com.fabricerp.erp.entity.SystemNotification;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.ProductionPlanRepository;
import com.fabricerp.erp.repository.StockMovementRepository;
import com.fabricerp.erp.repository.SystemNotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * AUTO-PILOT MANUFACTURING ENGINE — closed-loop, real-time replenishment.
 *
 * When a fabric falls below its minimum stock alert level the engine
 * automatically:
 *   1. Raises a production plan (AUTO-REPLENISH) for the shortfall.
 *   2. Advances the plan through every manufacturing stage on a live cadence:
 *      YARN_PROCUREMENT -> WARPING_BEAMS -> WEAVING_RUN -> DYEING_STENTER
 *      -> INSPECTION_PACK -> COMPLETED
 *   3. Books the finished meters back into inventory (INWARD movement).
 *   4. Raises notifications at every milestone so the alert bell shows the
 *      whole loop in real time. The low-stock condition clears itself.
 */
@Component
public class AutoReplenishmentEngine {

    private static final Logger log = LoggerFactory.getLogger(AutoReplenishmentEngine.class);

    private static final String AUTO_MARK = "AUTO-REPLENISH";
    private static final String[] STAGES = {
            "YARN_PROCUREMENT", "WARPING_BEAMS", "WEAVING_RUN",
            "DYEING_STENTER", "INSPECTION_PACK", "COMPLETED"
    };

    private final FabricRepository fabricRepository;
    private final ProductionPlanRepository planRepository;
    private final StockMovementRepository movementRepository;
    private final SystemNotificationRepository notificationRepository;

    public AutoReplenishmentEngine(FabricRepository fabricRepository,
                                   ProductionPlanRepository planRepository,
                                   StockMovementRepository movementRepository,
                                   SystemNotificationRepository notificationRepository) {
        this.fabricRepository = fabricRepository;
        this.planRepository = planRepository;
        this.movementRepository = movementRepository;
        this.notificationRepository = notificationRepository;
    }

    @Scheduled(fixedRate = 45000, initialDelay = 20000)
    public void runAutoPilot() {
        startNewReplenishments();
        advanceActivePlans();
    }

    /** Detect low-stock fabrics and launch a fresh AUTO-REPLENISH plan for each. */
    private void startNewReplenishments() {
        List<ProductionPlan> activePlans = planRepository.findAllByOrderByIdDesc();

        for (FabricProduct fabric : fabricRepository.findAll()) {
            if (Boolean.TRUE.equals(fabric.getIsRemnant())) continue;
            double stock = fabric.getTotalStockMeters() != null ? fabric.getTotalStockMeters() : 0;
            double minimum = fabric.getMinStockAlert() != null ? fabric.getMinStockAlert() : 0;
            if (minimum <= 0 || stock >= minimum) continue;

            // Skip if this quality already has an unfinished AUTO plan
            boolean alreadyRunning = activePlans.stream().anyMatch(p ->
                    p.getRemarks() != null && p.getRemarks().contains(AUTO_MARK)
                            && fabric.getQualityCode().equals(p.getQualityCode())
                            && !"COMPLETED".equals(p.getCurrentStage()));
            if (alreadyRunning) continue;

            // Replenish up to 150% of the safety level (at least 50 m)
            double target = Math.max(50.0, (minimum * 1.5) - stock);
            double targetRounded = Math.ceil(target / 10.0) * 10;

            ProductionPlan plan = new ProductionPlan();
            plan.setPlanNumber("AUTO-" + DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now())
                    + "-" + (1000 + (int) (Math.random() * 9000)));
            plan.setOrderReferenceNumber("STOCK-REPLENISH");
            plan.setTargetClientName("Internal Stock Replenishment");
            plan.setFabricProductName(fabric.getFabricName());
            plan.setQualityCode(fabric.getQualityCode());
            plan.setTargetMeterage(targetRounded);
            plan.setRequiredWarpYarnKg(Math.round(targetRounded * 0.35 * 100.0) / 100.0);
            plan.setRequiredWeftYarnKg(Math.round(targetRounded * 0.28 * 100.0) / 100.0);
            plan.setRequiredSizingChemicalKg(Math.round(targetRounded * 0.04 * 100.0) / 100.0);
            plan.setRequiredDyesAndAuxiliariesKg(Math.round(targetRounded * 0.02 * 100.0) / 100.0);
            plan.setAllocatedLoomsCount(2);
            plan.setEstimatedLoomDays(1);
            plan.setCommittedDeliveryDate(LocalDate.now().plusDays(2));
            plan.setCurrentStage(STAGES[0]);
            plan.setPlannedByManager("AUTO-PILOT ENGINE");
            plan.setRemarks(AUTO_MARK + ": stock " + String.format("%.0f", stock)
                    + " m below safety level " + String.format("%.0f", minimum) + " m");
            planRepository.save(plan);

            notify("🏭 Auto Manufacturing Started — " + fabric.getFabricName(),
                    "Low stock detected (" + String.format("%.0f", stock) + " m / min " + String.format("%.0f", minimum)
                            + " m). AUTO-PILOT launched plan " + plan.getPlanNumber() + " for "
                            + String.format("%.0f", targetRounded) + " m.",
                    "INFO", "/production");

            log.info("AUTO-PILOT: started replenishment {} for {} ({} m)",
                    plan.getPlanNumber(), fabric.getQualityCode(), targetRounded);
        }
    }

    /** Progress every active AUTO plan one stage further; complete stock booking at the end. */
    private void advanceActivePlans() {
        for (ProductionPlan plan : planRepository.findAllByOrderByIdDesc()) {
            if (plan.getRemarks() == null || !plan.getRemarks().contains(AUTO_MARK)) continue;
            if ("COMPLETED".equals(plan.getCurrentStage())) continue;

            int index = stageIndex(plan.getCurrentStage());
            if (index < 0 || index >= STAGES.length - 1) continue;

            String nextStage = STAGES[index + 1];
            plan.setCurrentStage(nextStage);
            planRepository.save(plan);

            if ("COMPLETED".equals(nextStage)) {
                completeReplenishment(plan);
            }
        }
    }

    /** Book finished goods into inventory and announce the closed loop. */
    private void completeReplenishment(ProductionPlan plan) {
        FabricProduct fabric = fabricRepository.findByQualityCode(plan.getQualityCode()).orElse(null);
        if (fabric == null) return;

        double produced = plan.getTargetMeterage() != null ? plan.getTargetMeterage() : 0;
        double newStock = (fabric.getTotalStockMeters() != null ? fabric.getTotalStockMeters() : 0) + produced;
        fabric.setTotalStockMeters(newStock);
        fabricRepository.save(fabric);

        StockMovement movement = new StockMovement();
        movement.setFabricId(fabric.getId());
        movement.setItemCode(fabric.getQualityCode());
        movement.setFabricName(fabric.getFabricName());
        movement.setMovementType("INWARD");
        movement.setMeters(produced);
        movement.setBalanceAfter(newStock);
        movement.setReferenceNumber(plan.getPlanNumber());
        movement.setNotes("AUTO-PILOT replenishment completed — full production cycle finished");
        movementRepository.save(movement);

        notify("✅ Replenishment Complete — " + fabric.getFabricName(),
                plan.getPlanNumber() + " finished: +" + String.format("%.0f", produced)
                        + " m added. Stock now " + String.format("%.0f", newStock)
                        + " m (safety level restored).",
                "INFO", "/inventory");

        log.info("AUTO-PILOT: completed {} — stock {} m", plan.getPlanNumber(), newStock);
    }

    private int stageIndex(String stage) {
        for (int i = 0; i < STAGES.length; i++) {
            if (STAGES[i].equals(stage)) return i;
        }
        return -1;
    }

    private void notify(String title, String message, String severity, String actionUrl) {
        SystemNotification n = new SystemNotification();
        n.setTitle(title);
        n.setMessage(message);
        n.setAlertCategory("QC_ALERT");
        n.setSeverity(severity);
        n.setIsRead(false);
        n.setActionUrl(actionUrl);
        notificationRepository.save(n);
    }
}
