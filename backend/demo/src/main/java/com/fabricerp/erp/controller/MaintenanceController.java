package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.MachineMaintenanceLog;
import com.fabricerp.erp.entity.SparePart;
import com.fabricerp.erp.entity.WeavingLoom;
import com.fabricerp.erp.repository.MachineMaintenanceLogRepository;
import com.fabricerp.erp.repository.SparePartRepository;
import com.fabricerp.erp.repository.WeavingLoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MachineMaintenanceLogRepository logRepository;
    private final SparePartRepository spareRepository;
    private final WeavingLoomRepository loomRepository;

    public MaintenanceController(MachineMaintenanceLogRepository logRepository,
                                 SparePartRepository spareRepository,
                                 WeavingLoomRepository loomRepository) {
        this.logRepository = logRepository;
        this.spareRepository = spareRepository;
        this.loomRepository = loomRepository;
    }

    // --- Maintenance Breakdown Tickets ---
    @GetMapping("/tickets")
    public List<MachineMaintenanceLog> getAllTickets() {
        return logRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/tickets")
    @Transactional
    public ResponseEntity<?> logBreakdownTicket(@RequestBody MachineMaintenanceLog log) {
        if (log.getMachineCode() == null || log.getMachineCode().isBlank()) {
            return ResponseEntity.badRequest().body("Machine code is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        log.setTicketNumber("TICKET-" + timestamp);
        if (log.getStatus() == null) log.setStatus("OPEN_DOWN");

        // If machine is a loom, update its status to MAINTENANCE in Loom Hall
        WeavingLoom loom = loomRepository.findAll().stream()
                .filter(l -> log.getMachineCode().equalsIgnoreCase(l.getLoomNumber()))
                .findFirst().orElse(null);

        if (loom != null) {
            loom.setLoomStatus("MAINTENANCE");
            loom.setMaintenanceNotes("Down: " + log.getIssueDescription());
            loomRepository.save(loom);
        }

        return ResponseEntity.ok(logRepository.save(log));
    }

    @PutMapping("/tickets/{id}/resolve")
    @Transactional
    public ResponseEntity<?> resolveTicket(
            @PathVariable Long id,
            @RequestParam Double downtimeHours,
            @RequestParam(required = false) String partsUsed,
            @RequestParam(required = false) String resolutionNotes) {

        MachineMaintenanceLog ticket = logRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.notFound().build();

        ticket.setStatus("RESOLVED_RUNNING");
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setDowntimeHours(downtimeHours != null ? downtimeHours : 1.0);
        if (partsUsed != null) ticket.setPartsReplacedSummary(partsUsed);
        if (resolutionNotes != null) ticket.setResolutionNotes(resolutionNotes);

        // Restore loom status to ACTIVE_RUNNING
        WeavingLoom loom = loomRepository.findAll().stream()
                .filter(l -> ticket.getMachineCode().equalsIgnoreCase(l.getLoomNumber()))
                .findFirst().orElse(null);

        if (loom != null) {
            loom.setLoomStatus("ACTIVE_RUNNING");
            loom.setMaintenanceNotes("Maintenance resolved & tested OK.");
            loomRepository.save(loom);
        }

        return ResponseEntity.ok(logRepository.save(ticket));
    }

    // --- Spare Parts Store ---
    @GetMapping("/spares")
    public List<SparePart> getAllSpareParts() {
        return spareRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/spares")
    public ResponseEntity<?> addSparePart(@RequestBody SparePart part) {
        if (part.getPartSku() == null || part.getPartSku().isBlank()) {
            part.setPartSku("SPARE-" + System.currentTimeMillis() % 10000);
        }
        return ResponseEntity.ok(spareRepository.save(part));
    }
}