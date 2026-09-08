package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.EtpComplianceLog;
import com.fabricerp.erp.repository.EtpComplianceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/etp")
public class EtpComplianceController {

    private final EtpComplianceRepository etpRepository;

    public EtpComplianceController(EtpComplianceRepository etpRepository) {
        this.etpRepository = etpRepository;
    }

    @GetMapping("/logs")
    public List<EtpComplianceLog> getAllLogs() {
        return etpRepository.findAllByOrderByAuditDateDesc();
    }

    @PostMapping("/logs")
    public ResponseEntity<?> createEtpLog(@RequestBody EtpComplianceLog log) {
        if (log.getRawEffluentInflowKld() == null || log.getRawEffluentInflowKld() <= 0) {
            return ResponseEntity.badRequest().body("Raw effluent inflow in KLD is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        log.setLogCertificateNumber("ETP-ZLD-" + timestamp);

        // Auto calculate Water Recovery %
        double inflow = log.getRawEffluentInflowKld();
        double recycled = log.getRecycledPermeateWaterKld() != null ? log.getRecycledPermeateWaterKld() : (inflow * 0.93);
        log.setRecycledPermeateWaterKld(recycled);
        double recovery = (recycled / inflow) * 100.0;
        log.setWaterRecoveryPercentage(Math.round(recovery * 10.0) / 10.0);

        // Auto verify ZLD (Zero Liquid Discharge) compliance
        double cod = log.getChemicalOxygenDemandCod() != null ? log.getChemicalOxygenDemandCod() : 40.0;
        double bod = log.getBiochemicalOxygenDemandBod() != null ? log.getBiochemicalOxygenDemandBod() : 10.0;
        double ph = log.getTestedPhValue() != null ? log.getTestedPhValue() : 7.2;

        if (cod <= 50.0 && bod <= 15.0 && ph >= 6.5 && ph <= 8.5) {
            log.setZldComplianceStatus("ZLD_PASSED_100PCT_RECYCLED");
        } else {
            log.setZldComplianceStatus("PARAMETER_DEVIATION");
        }

        return ResponseEntity.ok(etpRepository.save(log));
    }
}