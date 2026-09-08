package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.WorkerShiftAttendance;
import com.fabricerp.erp.repository.WorkerShiftAttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendancePayrollController {

    private final WorkerShiftAttendanceRepository attendanceRepository;

    public AttendancePayrollController(WorkerShiftAttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/logs")
    public List<WorkerShiftAttendance> getAllAttendanceLogs() {
        List<WorkerShiftAttendance> list = attendanceRepository.findAll();
        return list != null ? list : new ArrayList<>();
    }

    @GetMapping("/date/{date}")
    public List<WorkerShiftAttendance> getAttendanceByDate(@PathVariable String date) {
        try {
            LocalDate parsedDate = LocalDate.parse(date.trim());
            List<WorkerShiftAttendance> list = attendanceRepository.findByAttendanceDateOrderByPlantDepartmentAsc(parsedDate);
            return list != null ? list : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @PostMapping("/punch")
    public ResponseEntity<?> logShiftPunch(@RequestBody WorkerShiftAttendance record) {
        if (record.getWorkerFullName() == null || record.getWorkerFullName().isBlank()) {
            return ResponseEntity.badRequest().body("Worker name is required");
        }

        BigDecimal dailyWage = record.getRegularDailyWage() != null ? record.getRegularDailyWage() : BigDecimal.valueOf(650.0);
        double otHours = record.getOvertimeHours() != null ? record.getOvertimeHours() : 0.0;

        BigDecimal hourlyRate = dailyWage.divide(BigDecimal.valueOf(8.0), 2, RoundingMode.HALF_UP);
        BigDecimal doubleOtRate = hourlyRate.multiply(BigDecimal.valueOf(2.0));
        BigDecimal otEarned = doubleOtRate.multiply(BigDecimal.valueOf(otHours)).setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalGross = "ABSENT".equalsIgnoreCase(record.getAttendanceStatus())
                ? BigDecimal.ZERO
                : dailyWage.add(otEarned);

        record.setRegularDailyWage(dailyWage);
        record.setOvertimeWagesEarned(otEarned);
        record.setTotalGrossEarned(totalGross);

        return ResponseEntity.ok(attendanceRepository.save(record));
    }

    @PostMapping("/bulk-punch")
    @Transactional
    public ResponseEntity<?> saveBulkAttendance(@RequestBody List<WorkerShiftAttendance> records) {
        if (records == null || records.isEmpty()) {
            return ResponseEntity.badRequest().body("No attendance records provided");
        }

        for (WorkerShiftAttendance record : records) {
            BigDecimal dailyWage = record.getRegularDailyWage() != null ? record.getRegularDailyWage() : BigDecimal.valueOf(650.0);
            double otHours = record.getOvertimeHours() != null ? record.getOvertimeHours() : 0.0;

            BigDecimal hourlyRate = dailyWage.divide(BigDecimal.valueOf(8.0), 2, RoundingMode.HALF_UP);
            BigDecimal doubleOtRate = hourlyRate.multiply(BigDecimal.valueOf(2.0));
            BigDecimal otEarned = doubleOtRate.multiply(BigDecimal.valueOf(otHours)).setScale(2, RoundingMode.HALF_UP);

            BigDecimal totalGross = "ABSENT".equalsIgnoreCase(record.getAttendanceStatus())
                    ? BigDecimal.ZERO
                    : dailyWage.add(otEarned);

            record.setRegularDailyWage(dailyWage);
            record.setOvertimeWagesEarned(otEarned);
            record.setTotalGrossEarned(totalGross);
        }

        List<WorkerShiftAttendance> saved = attendanceRepository.saveAll(records);
        return ResponseEntity.ok(saved);
    }
}