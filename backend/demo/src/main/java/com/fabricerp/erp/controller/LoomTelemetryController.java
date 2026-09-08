package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.LoomTelemetryLog;
import com.fabricerp.erp.entity.WeavingLoom;
import com.fabricerp.erp.repository.LoomTelemetryRepository;
import com.fabricerp.erp.repository.WeavingLoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
public class LoomTelemetryController {

    private final LoomTelemetryRepository telemetryRepository;
    private final WeavingLoomRepository loomRepository;

    public LoomTelemetryController(LoomTelemetryRepository telemetryRepository, WeavingLoomRepository loomRepository) {
        this.telemetryRepository = telemetryRepository;
        this.loomRepository = loomRepository;
    }

    // Get live grid telemetry of all looms
    @GetMapping("/floor-matrix")
    public List<LoomTelemetryLog> getLoomFloorMatrix() {
        List<LoomTelemetryLog> list = telemetryRepository.findAllByOrderByLoomNumberAsc();
        // If empty, auto-seed 16 high-speed looms for immediate visual testing
        if (list.isEmpty()) {
            for (int i = 1; i <= 16; i++) {
                String num = String.format("LOOM-A%02d", i);
                LoomTelemetryLog log = new LoomTelemetryLog();
                log.setLoomNumber(num);
                log.setMachineType(i % 3 == 0 ? "AIR_JET_550" : "RAPIER_HIGH_SPEED");
                log.setCurrentRpmSpeed(550 + (i * 5));
                log.setCurrentPicksCounter(350000L + (i * 12000));
                log.setCurrentWovenMeters(280.0 + (i * 10));
                log.setCurrentLotBatchNumber("LOT-2026-" + (80 + i));
                log.setFabricQualityName(i % 2 == 0 ? "Royal Silk Crepe 900" : "Cotton Oxford 80s");
                log.setAllocatedWeaverName("Weaver " + (i <= 8 ? "Palani Bay 1" : "Muthu Bay 2"));
                log.setLiveStatus(i == 3 ? "WARP_BREAK_STOP" : i == 7 ? "WEFT_FEEDER_STOP" : i == 11 ? "BEAM_GAITING_CHANGE" : "ACTIVE_RUNNING");
                log.setCurrentShiftEfficiencyPct(94.5 - (i * 0.3));
                log.setTelemetrySensorAlert(i == 3 ? "Warp Dropper Pin #204 Trip" : i == 7 ? "Weft Accumulator No.2 Empty" : "Sensor Normal OK");
                telemetryRepository.save(log);
            }
            return telemetryRepository.findAllByOrderByLoomNumberAsc();
        }
        return list;
    }

    // Update loom status / trigger sensor stop event
    @PutMapping("/loom/{loomNumber}/status")
    @Transactional
    public ResponseEntity<?> updateLoomStatus(
            @PathVariable String loomNumber,
            @RequestParam String status,
            @RequestParam(required = false) String alertMessage) {

        LoomTelemetryLog log = telemetryRepository.findByLoomNumber(loomNumber).orElse(null);
        if (log == null) return ResponseEntity.notFound().build();

        log.setLiveStatus(status);
        if (alertMessage != null) log.setTelemetrySensorAlert(alertMessage);
        log.setLastSensorPingAt(LocalDateTime.now());

        // Sync with WeavingLoom registry
        WeavingLoom loom = loomRepository.findAll().stream()
                .filter(l -> loomNumber.equalsIgnoreCase(l.getLoomNumber()))
                .findFirst().orElse(null);
        if (loom != null) {
            loom.setLoomStatus("ACTIVE_RUNNING".equalsIgnoreCase(status) ? "ACTIVE_RUNNING" : "MAINTENANCE");
            loomRepository.save(loom);
        }

        return ResponseEntity.ok(telemetryRepository.save(log));
    }
}