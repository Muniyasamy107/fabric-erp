package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.BoilerSteamLog;
import com.fabricerp.erp.repository.BoilerSteamLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/boiler")
public class BoilerEnergyController {

    private final BoilerSteamLogRepository boilerRepository;

    public BoilerEnergyController(BoilerSteamLogRepository boilerRepository) {
        this.boilerRepository = boilerRepository;
    }

    @GetMapping("/logs")
    public List<BoilerSteamLog> getAllLogs() {
        return boilerRepository.findAllByOrderByLogDateDesc();
    }

    @PostMapping("/logs")
    public ResponseEntity<?> createSteamLog(@RequestBody BoilerSteamLog log) {
        if (log.getTotalSteamGeneratedTons() == null || log.getTotalSteamGeneratedTons() <= 0) {
            return ResponseEntity.badRequest().body("Total Steam generated in Tons is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        log.setSteamLogNumber("STEAM-LOG-" + timestamp);

        // Auto calculate Evaporation Ratio = Steam Tons / Fuel Tons
        double steam = log.getTotalSteamGeneratedTons();
        double fuel = (log.getFuelConsumedTons() != null && log.getFuelConsumedTons() > 0) ? log.getFuelConsumedTons() : 10.0;
        double ratio = steam / fuel;
        log.setEvaporationRatio(Math.round(ratio * 100.0) / 100.0);

        // Auto calculate Departmental Steam Allocation if not specified (65% Dyeing, 20% Stenter, 15% Sizing)
        if (log.getDyeHouseSteamTons() == null) {
            log.setDyeHouseSteamTons(Math.round(steam * 0.65 * 10.0) / 10.0);
        }
        if (log.getStenterFinishingSteamTons() == null) {
            log.setStenterFinishingSteamTons(Math.round(steam * 0.20 * 10.0) / 10.0);
        }
        if (log.getSizingYarnSteamTons() == null) {
            log.setSizingYarnSteamTons(Math.round(steam * 0.15 * 10.0) / 10.0);
        }

        return ResponseEntity.ok(boilerRepository.save(log));
    }
}