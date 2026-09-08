package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.WarpingSizingBeam;
import com.fabricerp.erp.entity.WeavingLoom;
import com.fabricerp.erp.repository.WarpingSizingBeamRepository;
import com.fabricerp.erp.repository.WeavingLoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/beams")
public class WarpingSizingController {

    private final WarpingSizingBeamRepository beamRepository;
    private final WeavingLoomRepository loomRepository;

    public WarpingSizingController(WarpingSizingBeamRepository beamRepository, WeavingLoomRepository loomRepository) {
        this.beamRepository = beamRepository;
        this.loomRepository = loomRepository;
    }

    @GetMapping
    public List<WarpingSizingBeam> getAllBeams() {
        return beamRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBeam(@RequestBody WarpingSizingBeam beam) {
        if (beam.getBeamNumber() == null || beam.getBeamNumber().isBlank()) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
            beam.setBeamNumber("BEAM-" + timestamp);
        }
        if (beam.getBeamStatus() == null) {
            beam.setBeamStatus("READY_IN_BEAM_BANK");
        }
        return ResponseEntity.ok(beamRepository.save(beam));
    }

    @PutMapping("/{id}/mount-on-loom")
    @Transactional
    public ResponseEntity<?> mountBeamOnLoom(@PathVariable Long id, @RequestParam String loomNumber) {
        WarpingSizingBeam beam = beamRepository.findById(id).orElse(null);
        if (beam == null) return ResponseEntity.notFound().build();

        beam.setAssignedLoomNumber(loomNumber);
        beam.setBeamStatus("MOUNTED_ON_LOOM");

        // Update loom active status & yarn specification
        WeavingLoom loom = loomRepository.findAll().stream()
                .filter(l -> loomNumber.equalsIgnoreCase(l.getLoomNumber()))
                .findFirst().orElse(null);

        if (loom != null) {
            loom.setLoomStatus("ACTIVE_RUNNING");
            loom.setCurrentYarnSpecification(beam.getYarnCountSpecification() + " (" + beam.getTotalWarpEnds() + " Ends - " + beam.getBeamNumber() + ")");
            loomRepository.save(loom);
        }

        return ResponseEntity.ok(beamRepository.save(beam));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBeamStatus(@PathVariable Long id, @RequestParam String status) {
        WarpingSizingBeam beam = beamRepository.findById(id).orElse(null);
        if (beam == null) return ResponseEntity.notFound().build();
        beam.setBeamStatus(status);
        return ResponseEntity.ok(beamRepository.save(beam));
    }
}