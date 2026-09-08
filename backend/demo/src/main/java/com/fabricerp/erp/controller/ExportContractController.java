package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.ExportContract;
import com.fabricerp.erp.repository.ExportContractRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/exports")
public class ExportContractController {

    private final ExportContractRepository exportRepository;

    public ExportContractController(ExportContractRepository exportRepository) {
        this.exportRepository = exportRepository;
    }

    @GetMapping("/contracts")
    public List<ExportContract> getAllExportContracts() {
        return exportRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/contracts")
    public ResponseEntity<?> createExportContract(@RequestBody ExportContract contract) {
        if (contract.getBuyerCompanyName() == null || contract.getBuyerCompanyName().isBlank()) {
            return ResponseEntity.badRequest().body("International buyer company name is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        contract.setExportContractNumber("EXP-" + timestamp);

        // Compute Total Foreign Contract Value = Meters * Price
        double meters = contract.getContractedMeters() != null ? contract.getContractedMeters() : 0.0;
        BigDecimal rate = contract.getPricePerMeterForeignCurrency() != null ? contract.getPricePerMeterForeignCurrency() : BigDecimal.ZERO;
        BigDecimal totalForeign = rate.multiply(BigDecimal.valueOf(meters)).setScale(2, RoundingMode.HALF_UP);
        contract.setTotalContractValueForeign(totalForeign);

        // Approximate Exchange Rate Realization (USD: 83.0, EUR: 90.0, GBP: 105.0)
        double exchangeRate = 83.0;
        if ("EUR".equalsIgnoreCase(contract.getTradeCurrency())) exchangeRate = 90.0;
        else if ("GBP".equalsIgnoreCase(contract.getTradeCurrency())) exchangeRate = 105.0;

        contract.setTotalInrRealizationValue(totalForeign.multiply(BigDecimal.valueOf(exchangeRate)).setScale(2, RoundingMode.HALF_UP));

        return ResponseEntity.ok(exportRepository.save(contract));
    }

    @PutMapping("/contracts/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        ExportContract contract = exportRepository.findById(id).orElse(null);
        if (contract == null) return ResponseEntity.notFound().build();
        contract.setContractStatus(status);
        return ResponseEntity.ok(exportRepository.save(contract));
    }
}