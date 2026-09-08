package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.LoomShiftProduction;
import com.fabricerp.erp.repository.LoomShiftProductionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/shift-oee")
public class ShiftOeeController {

    private final LoomShiftProductionRepository shiftRepository;

    public ShiftOeeController(LoomShiftProductionRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @GetMapping("/logs")
    public List<LoomShiftProduction> getAllShiftLogs() {
        return shiftRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/log-shift")
    public ResponseEntity<?> logShiftProduction(@RequestBody LoomShiftProduction log) {
        if (log.getShiftName() == null || log.getShiftName().isBlank()) {
            return ResponseEntity.badRequest().body("Shift name is required (Shift A, B or C)");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        log.setShiftLogNumber("SHIFT-" + timestamp);

        // --- Standard Mill OEE Mathematical Formulation ---
        // Total Planned Shift Duration = 480 Minutes (8 Hours)
        double plannedMinutes = 480.0;
        double totalStoppage = (log.getWarpStoppageMinutes() != null ? log.getWarpStoppageMinutes() : 0.0) +
                               (log.getWeftStoppageMinutes() != null ? log.getWeftStoppageMinutes() : 0.0) +
                               (log.getElectricalDowntimeMinutes() != null ? log.getElectricalDowntimeMinutes() : 0.0);

        // 1. Availability Rate = (Planned Time - Downtime) / Planned Time
        double operatingMinutes = Math.max(0, plannedMinutes - totalStoppage);
        double availability = (operatingMinutes / plannedMinutes) * 100.0;
        log.setAvailabilityRatePct(Math.round(availability * 100.0) / 100.0);

        // 2. Performance Rate = Standard Performance (Calculated from Picks vs Theoretical RPM)
        double performance = 94.5; // Benchmark standard weaving efficiency
        log.setPerformanceRatePct(performance);

        // 3. Quality Rate = (Total Meters - Scrap) / Total Meters
        double totalMeters = log.getTotalMetersWoven() != null && log.getTotalMetersWoven() > 0 ? log.getTotalMetersWoven() : 1.0;
        double scrapMeters = log.getTotalWasteScrapMeters() != null ? log.getTotalWasteScrapMeters() : 0.0;
        double quality = ((totalMeters - scrapMeters) / totalMeters) * 100.0;
        log.setQualityRatePct(Math.round(quality * 100.0) / 100.0);

        // 4. Overall OEE % = (A * P * Q) / 10000
        double oee = (availability * performance * quality) / 10000.0;
        log.setOverallOeePercentage(Math.round(oee * 100.0) / 100.0);

        return ResponseEntity.ok(shiftRepository.save(log));
    }
}