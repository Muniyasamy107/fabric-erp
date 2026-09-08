package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.MillShiftReport;
import com.fabricerp.erp.repository.MillShiftReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final MillShiftReportRepository shiftRepository;

    public ShiftController(MillShiftReportRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @GetMapping("/history")
    public List<MillShiftReport> getAllShifts() {
        return shiftRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/close")
    public ResponseEntity<?> closeShift(@RequestBody MillShiftReport shift) {
        shift.setStatus("CLOSED");
        shift.setClosedAt(LocalDateTime.now());
        return ResponseEntity.ok(shiftRepository.save(shift));
    }
}