package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FactoryGatePass;
import com.fabricerp.erp.repository.FactoryGatePassRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/gate-pass")
public class GatePassController {

    private final FactoryGatePassRepository gatePassRepository;

    public GatePassController(FactoryGatePassRepository gatePassRepository) {
        this.gatePassRepository = gatePassRepository;
    }

    @GetMapping
    public List<FactoryGatePass> getAllPasses() {
        return gatePassRepository.findAllByOrderByIdDesc();
    }

    @PostMapping
    public ResponseEntity<?> issueGatePass(@RequestBody FactoryGatePass pass) {
        if (pass.getVehicleNumber() == null || pass.getVehicleNumber().isBlank()) {
            return ResponseEntity.badRequest().body("Lorry / Vehicle registration number is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        pass.setGatePassNumber("GP-" + timestamp);

        // Auto-calculate Net Material Weight
        if (pass.getGrossWeightKg() != null && pass.getTareWeightKg() != null) {
            pass.setNetMaterialWeightKg(pass.getGrossWeightKg() - pass.getTareWeightKg());
        }

        return ResponseEntity.ok(gatePassRepository.save(pass));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        FactoryGatePass p = gatePassRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        p.setGateStatus(status);
        return ResponseEntity.ok(gatePassRepository.save(p));
    }
}