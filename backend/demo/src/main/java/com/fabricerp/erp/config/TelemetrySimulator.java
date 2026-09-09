package com.fabricerp.erp.config;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.LoomTelemetryLog;
import com.fabricerp.erp.entity.SystemNotification;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.LoomTelemetryRepository;
import com.fabricerp.erp.repository.SystemNotificationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * Live mill telemetry engine.
 *
 * Every 5 seconds each loom's SCADA reading moves: RPM jitters, woven meters
 * accumulate, efficiency drifts, and occasionally a warp/weft break occurs or a
 * stopped loom is repaired. Every transition raises a real-time notification
 * that appears in the navbar alert bell. A 60-second sweep also raises
 * LOW_STOCK alerts for fabrics below their minimum level.
 */
@Component
public class TelemetrySimulator {

    private static final int PICKS_PER_METER = 5200;

    private final LoomTelemetryRepository loomRepository;
    private final SystemNotificationRepository notificationRepository;
    private final FabricRepository fabricRepository;
    private final Random random = new Random();
    private volatile LocalDateTime lastRemnantAlertAt = null;

    public TelemetrySimulator(LoomTelemetryRepository loomRepository,
                              SystemNotificationRepository notificationRepository,
                              FabricRepository fabricRepository) {
        this.loomRepository = loomRepository;
        this.notificationRepository = notificationRepository;
        this.fabricRepository = fabricRepository;
    }

    // ------------------------------------------------------------------
    // Live loom SCADA tick — every 5 seconds
    // ------------------------------------------------------------------
    @Scheduled(fixedRate = 5000)
    public void telemetryTick() {
        List<LoomTelemetryLog> looms = loomRepository.findAll();
        for (LoomTelemetryLog loom : looms) {
            loom.setLastSensorPingAt(LocalDateTime.now());
            String status = loom.getLiveStatus();

            if ("ACTIVE_RUNNING".equals(status)) {
                runningTick(loom);
            } else if ("WARP_BREAK_STOP".equals(status) || "WEFT_FEEDER_STOP".equals(status)) {
                stoppedTick(loom, 0.18, "Break repaired by fitter");
            } else if ("BEAM_GAITING_CHANGE".equals(status)) {
                stoppedTick(loom, 0.25, "New beam gaited and loom restarted");
            }
            // MAINTENANCE_DOWN looms stay down until a user changes them

            loomRepository.save(loom);
        }
    }

    private void runningTick(LoomTelemetryLog loom) {
        int rpm = orDefault(loom.getCurrentRpmSpeed(), 550);
        // RPM jitter like a real drive
        rpm = clamp(rpm + (random.nextInt(25) - 12), 470, 660);
        loom.setCurrentRpmSpeed(rpm);

        // Cloth accumulation: meters = rpm / picks-per-meter * seconds
        double gained = (rpm / (double) PICKS_PER_METER) * 5;
        double woven = orDefaultD(loom.getCurrentWovenMeters(), 0) + gained;
        loom.setCurrentWovenMeters(Math.round(woven * 100.0) / 100.0);

        long picks = orDefaultL(loom.getCurrentPicksCounter(), 0) + (long) rpm * 5;
        loom.setCurrentPicksCounter(picks);

        // Efficiency drift
        double eff = orDefaultD(loom.getCurrentShiftEfficiencyPct(), 90);
        eff = clampD(eff + (random.nextDouble() * 0.8 - 0.4), 72, 99.5);
        loom.setCurrentShiftEfficiencyPct(Math.round(eff * 10.0) / 10.0);

        loom.setTelemetrySensorAlert("Sensor Normal OK");

        // Rare random breakdown (~1.5% per tick per loom)
        if (random.nextDouble() < 0.015) {
            boolean warp = random.nextBoolean();
            String newStatus = warp ? "WARP_BREAK_STOP" : "WEFT_FEEDER_STOP";
            loom.setLiveStatus(newStatus);
            loom.setCurrentRpmSpeed(0);
            String alert = warp
                    ? "Warp Dropper Pin #" + (150 + random.nextInt(150)) + " Trip"
                    : "Weft Accumulator No." + (1 + random.nextInt(4)) + " Empty";
            loom.setTelemetrySensorAlert(alert);

            notify(loom.getLoomNumber() + " " + (warp ? "Warp Break" : "Weft Stop"),
                    loom.getLoomNumber() + " stopped: " + alert + ". "
                            + orStr(loom.getFabricQualityName(), "quality") + " batch on hold.",
                    "BREAKDOWN", warp ? "CRITICAL" : "WARNING", "/loom-matrix");
        }
    }

    private void stoppedTick(LoomTelemetryLog loom, double recoverChance, String recoverNote) {
        loom.setCurrentRpmSpeed(0);
        if (random.nextDouble() < recoverChance) {
            loom.setLiveStatus("ACTIVE_RUNNING");
            loom.setCurrentRpmSpeed(480 + random.nextInt(80));
            loom.setTelemetrySensorAlert("Sensor Normal OK");
            notify(loom.getLoomNumber() + " Back Online",
                    loom.getLoomNumber() + " " + recoverNote + " — weaving resumed.",
                    "BREAKDOWN", "INFO", "/loom-matrix");
        }
    }

    // ------------------------------------------------------------------
    // Low stock sweep — every 60 seconds
    // ------------------------------------------------------------------
    @Scheduled(fixedRate = 60000)
    public void lowStockSweep() {
        for (FabricProduct fabric : fabricRepository.findAll()) {
            if (Boolean.TRUE.equals(fabric.getIsRemnant())) continue;
            double stock = orDefaultD(fabric.getTotalStockMeters(), 0);
            double min = orDefaultD(fabric.getMinStockAlert(), 0);
            if (min > 0 && stock < min) {
                String title = "Low Stock: " + fabric.getQualityCode();
                if (!notificationRepository.existsByTitleAndIsReadFalse(title)) {
                    notify(title,
                            fabric.getFabricName() + " is at " + stock + " m (minimum "
                                    + min + " m). Plan yarn replenishment.",
                            "LOW_STOCK", "WARNING", "/fabrics");
                }
            }
        }
        remnantYardAlert();
    }

    /**
     * Remnant Clearance yard digest — reminds sales that discounted end-bit
     * rolls are available. Throttled to once every 30 minutes.
     */
    private void remnantYardAlert() {
        if (lastRemnantAlertAt != null
                && lastRemnantAlertAt.isAfter(LocalDateTime.now().minusMinutes(30))) {
            return;
        }
        List<FabricProduct> remnants = fabricRepository.findByIsRemnantTrue();
        if (remnants.isEmpty()) return;

        double meters = 0;
        double value = 0;
        for (FabricProduct r : remnants) {
            double m = orDefaultD(r.getTotalStockMeters(), 0);
            double price = r.getWholesalePricePerMeter() != null
                    ? r.getWholesalePricePerMeter().doubleValue() : 0;
            double disc = orDefaultD(r.getRemnantDiscountPct(), 0);
            meters += m;
            value += m * price * (1 - disc / 100.0);
        }

        notify("Remnant Clearance Yard — " + remnants.size() + " rolls ready",
                String.format("%.1f", meters) + " m of end-bit rolls available at clearance discounts ("
                        + String.format("%.0f", value) + " recoverable). Offer them to job-work buyers.",
                "DISPATCH", "INFO", "/remnant-clearance");
        lastRemnantAlertAt = LocalDateTime.now();
    }

    // ------------------------------------------------------------------
    // Notification housekeeping — hourly. Old unread alerts auto-archive and
    // stale read alerts are pruned, so the bell never accumulates hundreds.
    // ------------------------------------------------------------------
    @Scheduled(fixedRate = 3600000, initialDelay = 45000)
    public void notificationHousekeeping() {
        LocalDateTime readCutoff = LocalDateTime.now().minusDays(2);
        LocalDateTime deleteCutoff = LocalDateTime.now().minusDays(7);

        List<SystemNotification> all = notificationRepository.findAll();
        int archived = 0;
        int deleted = 0;
        for (SystemNotification n : all) {
            LocalDateTime created = n.getCreatedAt() != null ? n.getCreatedAt() : LocalDateTime.now();
            boolean isRead = Boolean.TRUE.equals(n.getIsRead());
            if (isRead && created.isBefore(deleteCutoff)) {
                notificationRepository.delete(n);
                deleted++;
            } else if (!isRead && created.isBefore(readCutoff)) {
                n.setIsRead(true);
                notificationRepository.save(n);
                archived++;
            }
        }
        if (archived + deleted > 0) {
            System.out.println("Notification housekeeping: " + archived + " archived, " + deleted + " pruned");
        }
    }

    // ------------------------------------------------------------------
    private void notify(String title, String message, String category, String severity, String actionUrl) {
        SystemNotification n = new SystemNotification();
        n.setTitle(title);
        n.setMessage(message);
        n.setAlertCategory(category);
        n.setSeverity(severity);
        n.setIsRead(false);
        n.setActionUrl(actionUrl);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    private int orDefault(Integer v, int d) { return v != null ? v : d; }
    private long orDefaultL(Long v, long d) { return v != null ? v : d; }
    private double orDefaultD(Double v, double d) { return v != null ? v : d; }
    private String orStr(String v, String d) { return v != null ? v : d; }
    private int clamp(int v, int lo, int hi) { return Math.max(lo, Math.min(hi, v)); }
    private double clampD(double v, double lo, double hi) { return Math.max(lo, Math.min(hi, v)); }
}
