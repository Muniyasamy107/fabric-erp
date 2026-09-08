package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.CadSampleDesign;
import com.fabricerp.erp.repository.CadSampleDesignRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/cad-designs")
public class CadDesignController {

    private final CadSampleDesignRepository designRepository;

    public CadDesignController(CadSampleDesignRepository designRepository) {
        this.designRepository = designRepository;
    }

    @GetMapping
    public List<CadSampleDesign> getAllDesigns() {
        return designRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createSampleDesign(@RequestBody CadSampleDesign design) {
        if (design.getDesignName() == null || design.getDesignName().isBlank()) {
            return ResponseEntity.badRequest().body("Design concept name is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"));
        design.setDesignCode("CAD-DES-" + timestamp);
        if (design.getSampleDevelopmentStatus() == null) {
            design.setSampleDevelopmentStatus("DESIGN_DRAFTING");
        }

        return ResponseEntity.ok(designRepository.save(design));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) Double producedMeters,
            @RequestParam(required = false) String buyerComments,
            @RequestParam(required = false) String courierAwb) {

        CadSampleDesign d = designRepository.findById(id).orElse(null);
        if (d == null) return ResponseEntity.notFound().build();

        d.setSampleDevelopmentStatus(status);
        if (producedMeters != null) d.setSampleYardageProducedMeters(producedMeters);
        if (buyerComments != null) d.setBuyerFeedbackComments(buyerComments);
        if (courierAwb != null) d.setCourierAwbTrackingNumber(courierAwb);

        return ResponseEntity.ok(designRepository.save(d));
    }
}