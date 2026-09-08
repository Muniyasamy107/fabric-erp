package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricRollPacking;
import com.fabricerp.erp.repository.FabricRollPackingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/roll-packing")
public class FabricRollPackingController {

    private final FabricRollPackingRepository rollRepository;

    public FabricRollPackingController(FabricRollPackingRepository rollRepository) {
        this.rollRepository = rollRepository;
    }

    @GetMapping("/rolls")
    public List<FabricRollPacking> getAllPackedRolls() {
        return rollRepository.findAllByOrderByIdDesc();
    }

    @GetMapping("/rolls/lot/{batchLotNumber}")
    public List<FabricRollPacking> getRollsByLot(@PathVariable String batchLotNumber) {
        return rollRepository.findByBatchLotNumberOrderByIdDesc(batchLotNumber);
    }

    @GetMapping("/rolls/bale/{balePackageNumber}")
    public List<FabricRollPacking> getRollsByBale(@PathVariable String balePackageNumber) {
        return rollRepository.findByBalePackageNumber(balePackageNumber);
    }

    @PostMapping("/pack-roll")
    public ResponseEntity<?> packNewRoll(@RequestBody FabricRollPacking roll) {
        if (roll.getNetLengthMeters() == null || roll.getNetLengthMeters() <= 0) {
            return ResponseEntity.badRequest().body("Valid net meter length is required");
        }

        // Generate Roll Serial e.g. ROLL-260904-883
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        roll.setRollBarcodeNumber("ROLL-" + timestamp);

        if (roll.getNetWeightKg() == null && roll.getGrossWeightKg() != null) {
            roll.setNetWeightKg(roll.getGrossWeightKg() - 0.8); // deduct 800g paper core
        }

        return ResponseEntity.ok(rollRepository.save(roll));
    }

    @PutMapping("/rolls/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        FabricRollPacking r = rollRepository.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();
        r.setPackingStatus(status);
        return ResponseEntity.ok(rollRepository.save(r));
    }
}