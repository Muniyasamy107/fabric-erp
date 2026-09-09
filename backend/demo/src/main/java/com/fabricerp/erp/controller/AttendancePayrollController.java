package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.User;
import com.fabricerp.erp.entity.Worker;
import com.fabricerp.erp.entity.WorkerShiftAttendance;
import com.fabricerp.erp.repository.UserRepository;
import com.fabricerp.erp.repository.WorkerRepository;
import com.fabricerp.erp.repository.WorkerShiftAttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendancePayrollController {

    private final WorkerShiftAttendanceRepository attendanceRepository;
    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;

    public AttendancePayrollController(WorkerShiftAttendanceRepository attendanceRepository,
                                       WorkerRepository workerRepository,
                                       UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
    }

    /**
     * UNIVERSAL BIOMETRIC BADGE SCAN — works for everyone:
     *  1. Factory worker badges (EMP-XXX roster)
     *  2. Office/admin/staff ERP logins (scan their username as badge)
     */
    @GetMapping("/badge/{badge}")
    public ResponseEntity<?> scanBadge(@PathVariable String badge) {
        String q = badge != null ? badge.trim() : "";
        if (q.isEmpty()) {
            return ResponseEntity.badRequest().body("Badge is required");
        }

        // 1) Factory worker roster
        Worker worker = workerRepository.findByBadgeNumber(q).orElse(null);
        if (worker != null) {
            if (worker.getActive() != null && !worker.getActive()) {
                return ResponseEntity.status(403).body(Map.of("error", "This worker badge is disabled."));
            }
            Map<String, Object> res = new LinkedHashMap<>();
            res.put("badgeNumber", worker.getBadgeNumber());
            res.put("fullName", worker.getFullName());
            res.put("plantDepartment", worker.getPlantDepartment());
            res.put("baseDailyWage", worker.getBaseDailyWage());
            res.put("assignedMachineCode", worker.getAssignedMachineCode());
            res.put("active", true);
            res.put("source", "WORKER");
            res.put("role", "FACTORY WORKER");
            return ResponseEntity.ok(res);
        }

        // 2) ERP login user — admin / supervisor / staff punch with their username
        User user = userRepository.findByUsername(q)
                .or(() -> userRepository.findByUsername(q.toLowerCase()))
                .orElse(null);
        if (user != null) {
            if (user.getActive() != null && !user.getActive()) {
                return ResponseEntity.status(403).body(Map.of("error", "This staff account is disabled."));
            }
            String role = user.getRole() != null ? user.getRole() : "WEAVER";
            String dept;
            BigDecimal wage;
            String machine;
            switch (role) {
                case "ADMIN":
                    dept = "OFFICE_ADMINISTRATION"; wage = BigDecimal.valueOf(1500); machine = "FRONT OFFICE"; break;
                case "SUPERVISOR":
                    dept = "PRODUCTION_OFFICE"; wage = BigDecimal.valueOf(1100); machine = "PLANNING OFFICE"; break;
                case "DYEING_MASTER":
                    dept = "DYE_HOUSE"; wage = BigDecimal.valueOf(720); machine = "DYE-JET-2"; break;
                case "FINISHING_MASTER":
                    dept = "FINISHING_STENTER"; wage = BigDecimal.valueOf(680); machine = "STENTER-1"; break;
                case "FITTER":
                    dept = "MAINTENANCE_FITTER"; wage = BigDecimal.valueOf(750); machine = "WORKSHOP-BAY"; break;
                case "DISPATCHER":
                    dept = "PACKING_BAY"; wage = BigDecimal.valueOf(600); machine = "DISPATCH DOCK"; break;
                default:
                    dept = "LOOM_HALL_WEAVING"; wage = BigDecimal.valueOf(650); machine = "LOOM-A01"; break;
            }
            Map<String, Object> res = new LinkedHashMap<>();
            res.put("badgeNumber", user.getUsername().toUpperCase());
            res.put("fullName", user.getFullName());
            res.put("plantDepartment", dept);
            res.put("baseDailyWage", wage);
            res.put("assignedMachineCode", machine);
            res.put("active", true);
            res.put("source", "USER");
            res.put("role", role.replace('_', ' '));
            return ResponseEntity.ok(res);
        }

        return ResponseEntity.status(404)
                .body(Map.of("error", "Badge not registered. Workers use their EMP badge; office staff scan their login username."));
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

        // DUPLICATE GUARD — same day + same shift + same badge (or same name on same machine)
        WorkerShiftAttendance duplicate = findDuplicate(record);
        if (duplicate != null) {
            return ResponseEntity.status(409).body(duplicateMessage(duplicate));
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

    /**
     * Duplicate detection: a worker cannot be registered twice for the same
     * date + shift with the same badge, nor twice with the same name on the
     * same machine. Returns the conflicting existing record (if any).
     */
    private WorkerShiftAttendance findDuplicate(WorkerShiftAttendance record) {
        if (record.getAttendanceDate() == null || record.getDesignatedShift() == null) {
            return null;
        }
        List<WorkerShiftAttendance> sameDay =
                attendanceRepository.findByAttendanceDateOrderByPlantDepartmentAsc(record.getAttendanceDate());
        if (sameDay == null) return null;

        for (WorkerShiftAttendance existing : sameDay) {
            if (matchesDuplicate(existing, record)) {
                return existing;
            }
        }
        return null;
    }

    /**
     * BIOMETRIC PUNCH-OUT — closes the shift for a worker who already punched in.
     * Recalculates overtime and gross pay from the final out-time.
     */
    @PutMapping("/punch-out")
    public ResponseEntity<?> punchOut(@RequestBody Map<String, String> body) {
        String badge = body.get("badgeNumber");
        String shift = body.get("designatedShift");
        String dateStr = body.get("attendanceDate");
        String outTime = body.get("punchOutTime");

        if (badge == null || shift == null || dateStr == null) {
            return ResponseEntity.badRequest().body("badgeNumber, designatedShift and attendanceDate are required");
        }

        LocalDate date;
        try {
            date = LocalDate.parse(dateStr.trim());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid attendance date");
        }

        double otHours = 0;
        try {
            otHours = Double.parseDouble(body.getOrDefault("overtimeHours", "0"));
        } catch (Exception ignored) {
        }

        List<WorkerShiftAttendance> sameDay =
                attendanceRepository.findByAttendanceDateOrderByPlantDepartmentAsc(date);
        if (sameDay != null) {
            for (WorkerShiftAttendance record : sameDay) {
                if (!sameText(record.getWorkerBadgeNumber(), badge)) continue;
                if (!sameText(record.getDesignatedShift(), shift)) continue;

                record.setPunchOutTime(outTime);
                record.setOvertimeHours(otHours);

                BigDecimal dailyWage = record.getRegularDailyWage() != null
                        ? record.getRegularDailyWage() : BigDecimal.valueOf(650.0);
                BigDecimal hourlyRate = dailyWage.divide(BigDecimal.valueOf(8.0), 2, RoundingMode.HALF_UP);
                BigDecimal otEarned = hourlyRate.multiply(BigDecimal.valueOf(2.0))
                        .multiply(BigDecimal.valueOf(otHours)).setScale(2, RoundingMode.HALF_UP);
                record.setOvertimeWagesEarned(otEarned);
                record.setTotalGrossEarned("ABSENT".equalsIgnoreCase(record.getAttendanceStatus())
                        ? BigDecimal.ZERO : dailyWage.add(otEarned));

                return ResponseEntity.ok(attendanceRepository.save(record));
            }
        }

        return ResponseEntity.status(404)
                .body("No punch-in found for this badge and shift today. Punch IN first.");
    }

    /** True when the two records describe the same worker, same day, same shift (badge match, or name+machine match). */
    private boolean matchesDuplicate(WorkerShiftAttendance existing, WorkerShiftAttendance record) {
        if (existing.getAttendanceDate() == null || record.getAttendanceDate() == null) return false;
        if (!existing.getAttendanceDate().equals(record.getAttendanceDate())) return false;
        if (!sameText(existing.getDesignatedShift(), record.getDesignatedShift())) return false;

        boolean badgeMatch = sameText(existing.getWorkerBadgeNumber(), record.getWorkerBadgeNumber());
        boolean nameMatch = sameText(existing.getWorkerFullName(), record.getWorkerFullName());
        boolean machineMatch = sameText(existing.getAssignedMachineCode(), record.getAssignedMachineCode());

        return badgeMatch || (nameMatch && machineMatch);
    }

    private boolean sameText(String a, String b) {
        String x = a == null ? "" : a.trim();
        String y = b == null ? "" : b.trim();
        return !x.isEmpty() && x.equalsIgnoreCase(y);
    }

    private String duplicateMessage(WorkerShiftAttendance existing) {
        String who = existing.getWorkerFullName() != null ? existing.getWorkerFullName().trim() : "This worker";
        String badge = existing.getWorkerBadgeNumber() != null && !existing.getWorkerBadgeNumber().isBlank()
                ? " (" + existing.getWorkerBadgeNumber().trim() + ")" : "";
        String machine = existing.getAssignedMachineCode() != null && !existing.getAssignedMachineCode().isBlank()
                ? " on machine " + existing.getAssignedMachineCode().trim() : "";
        return "DUPLICATE BLOCKED: " + who + badge + " is already registered for "
                + existing.getDesignatedShift() + " on " + existing.getAttendanceDate() + machine
                + ". One attendance entry per worker per shift is allowed.";
    }

    @PostMapping("/bulk-punch")
    @Transactional
    public ResponseEntity<?> saveBulkAttendance(@RequestBody List<WorkerShiftAttendance> records) {
        if (records == null || records.isEmpty()) {
            return ResponseEntity.badRequest().body("No attendance records provided");
        }

        // DUPLICATE GUARD — check against existing records AND inside the batch itself
        List<String> duplicates = new ArrayList<>();
        List<WorkerShiftAttendance> seenInBatch = new ArrayList<>();
        for (WorkerShiftAttendance record : records) {
            WorkerShiftAttendance existing = findDuplicate(record);
            if (existing != null) {
                duplicates.add(duplicateMessage(existing));
                continue;
            }
            boolean inBatchDup = false;
            for (WorkerShiftAttendance seen : seenInBatch) {
                if (matchesDuplicate(seen, record)) { inBatchDup = true; break; }
            }
            if (inBatchDup) {
                duplicates.add("DUPLICATE INSIDE BATCH: " + record.getWorkerFullName()
                        + " appears more than once for the same shift.");
                continue;
            }
            seenInBatch.add(record);
        }
        if (!duplicates.isEmpty()) {
            return ResponseEntity.status(409).body(String.join(" | ", duplicates));
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