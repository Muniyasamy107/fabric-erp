package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.WeaverWageEntry;
import com.fabricerp.erp.repository.WeaverWageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/weaver-wages")
public class WeaverWageController {

    private final WeaverWageRepository wageRepository;

    public WeaverWageController(WeaverWageRepository wageRepository) {
        this.wageRepository = wageRepository;
    }

    @GetMapping
    public List<WeaverWageEntry> getAllWages() {
        return wageRepository.findAll();
    }

    @PostMapping("/log")
    public ResponseEntity<?> logWage(@RequestBody WeaverWageEntry entry) {
        if (entry.getWeaverName() == null || entry.getWeaverName().isBlank()) {
            return ResponseEntity.badRequest().body("Weaver name is required");
        }
        double meters = entry.getTotalWovenMeters() != null ? entry.getTotalWovenMeters() : 0.0;
        BigDecimal rate = entry.getRatePerMeter() != null ? entry.getRatePerMeter() : BigDecimal.ZERO;
        entry.setTotalPayableWage(rate.multiply(BigDecimal.valueOf(meters)));
        entry.setPaymentStatus("PENDING");
        return ResponseEntity.ok(wageRepository.save(entry));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payWage(@PathVariable Long id, @RequestParam String paymentMethod) {
        WeaverWageEntry entry = wageRepository.findById(id).orElse(null);
        if (entry == null) return ResponseEntity.notFound().build();

        entry.setPaymentStatus("PAID");
        entry.setDisbursementDate(LocalDate.now());
        entry.setVoucherNumber("W-PAY-" + System.currentTimeMillis() % 100000);

        return ResponseEntity.ok(wageRepository.save(entry));
    }
}