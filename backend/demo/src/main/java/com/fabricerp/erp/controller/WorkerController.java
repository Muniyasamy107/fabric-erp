package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.Worker;
import com.fabricerp.erp.repository.WorkerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerRepository workerRepository;

    public WorkerController(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    @GetMapping
    public List<Worker> getAll() {
        List<Worker> list = workerRepository.findAll();
        return list != null ? list : new ArrayList<>();
    }

    /** Biometric kiosk badge scan lookup. */
    @GetMapping("/badge/{badge}")
    public ResponseEntity<?> getByBadge(@PathVariable String badge) {
        Worker worker = workerRepository.findByBadgeNumber(badge != null ? badge.trim() : "").orElse(null);
        if (worker == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Badge not registered in the mill roster."));
        }
        return ResponseEntity.ok(worker);
    }

    @GetMapping("/department/{dept}")
    public List<Worker> getByDept(@PathVariable String dept) {
        List<Worker> list = workerRepository.findByPlantDepartmentAndActiveTrue(dept);
        if (list == null || list.isEmpty()) {
            // Fallback to match all workers in department
            list = workerRepository.findAll().stream()
                    .filter(w -> dept.equalsIgnoreCase(w.getPlantDepartment()))
                    .toList();
        }
        return list != null ? list : new ArrayList<>();
    }

    @PostMapping
    public ResponseEntity<?> registerWorker(@RequestBody Worker worker) {
        if (worker.getBadgeNumber() == null || worker.getBadgeNumber().isBlank()) {
            return ResponseEntity.badRequest().body("Employee Badge Number is required");
        }
        if (workerRepository.findByBadgeNumber(worker.getBadgeNumber().trim()).isPresent()) {
            return ResponseEntity.badRequest().body("Badge Number already registered");
        }
        worker.setBadgeNumber(worker.getBadgeNumber().trim());
        if (worker.getActive() == null) worker.setActive(true);
        return ResponseEntity.ok(workerRepository.save(worker));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorker(@PathVariable Long id) {
        if (!workerRepository.existsById(id)) return ResponseEntity.notFound().build();
        workerRepository.deleteById(id);
        return ResponseEntity.ok("Worker deleted");
    }
}