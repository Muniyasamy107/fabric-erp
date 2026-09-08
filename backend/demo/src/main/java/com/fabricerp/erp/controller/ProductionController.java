package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.WeavingLoom;
import com.fabricerp.erp.entity.ProductionJob;
import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.repository.WeavingLoomRepository;
import com.fabricerp.erp.repository.ProductionJobRepository;
import com.fabricerp.erp.repository.FabricRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production")
public class ProductionController {

    private final WeavingLoomRepository loomRepository;
    private final ProductionJobRepository productionJobRepository;
    private final FabricRepository fabricRepository;

    public ProductionController(WeavingLoomRepository loomRepository,
                                ProductionJobRepository productionJobRepository,
                                FabricRepository fabricRepository) {
        this.loomRepository = loomRepository;
        this.productionJobRepository = productionJobRepository;
        this.fabricRepository = fabricRepository;
    }

    // --- Weaving Looms with Auto-Seed of 16 Factory Looms ---
    @GetMapping("/looms")
    public List<WeavingLoom> getAllLooms() {
        List<WeavingLoom> list = loomRepository.findAll();
        if (list.isEmpty()) {
            for (int i = 1; i <= 16; i++) {
                WeavingLoom l = new WeavingLoom();
                l.setLoomNumber(String.format("LOOM-A%02d", i));
                l.setMachineType(i % 3 == 0 ? "Air Jet 550" : i % 2 == 0 ? "Rapier High Speed" : "Electronic Jacquard");
                l.setRpmSpeed(550 + (i * 5));
                l.setMaximumWeavingWidthInches(68.0);
                l.setCurrentYarnSpecification("Cotton 80s / Silk 20/22D");
                l.setActiveOperatorName("Weaver " + (i <= 8 ? "Palani" : "Murugan"));
                l.setLoomStatus("ACTIVE_RUNNING");
                loomRepository.save(l);
            }
            return loomRepository.findAll();
        }
        return list;
    }

    @PostMapping("/looms")
    public WeavingLoom saveLoom(@RequestBody WeavingLoom loom) {
        return loomRepository.save(loom);
    }

    // --- Production Jobs ---
    @GetMapping("/jobs")
    public List<ProductionJob> getAllJobs() {
        return productionJobRepository.findAll();
    }

    @PostMapping("/jobs")
    @Transactional
    public ProductionJob createJob(@RequestBody ProductionJob job) {
        job.setBatchNumber("LOT-" + System.currentTimeMillis() % 100000);
        job.setJobStatus("WEAVING");

        // Update assigned loom status
        if (job.getAssignedLoomNumber() != null && !job.getAssignedLoomNumber().isBlank()) {
            WeavingLoom loom = loomRepository.findAll().stream()
                    .filter(l -> job.getAssignedLoomNumber().equalsIgnoreCase(l.getLoomNumber()))
                    .findFirst().orElse(null);
            if (loom != null) {
                loom.setLoomStatus("ACTIVE_RUNNING");
                if (job.getMasterWeaverName() != null) {
                    loom.setActiveOperatorName(job.getMasterWeaverName());
                }
                loomRepository.save(loom);
            }
        }

        return productionJobRepository.save(job);
    }

    @PutMapping("/jobs/{id}/status")
    @Transactional
    public ResponseEntity<?> updateJobStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) Double producedMeters,
            @RequestParam(required = false) Double wasteMeters,
            @RequestParam(required = false) String grade) {

        ProductionJob job = productionJobRepository.findById(id).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();

        job.setJobStatus(status);
        if (producedMeters != null) job.setProducedMeters(producedMeters);
        if (wasteMeters != null) job.setDefectWastageMeters(wasteMeters);
        if (grade != null) job.setFabricQualityGrade(grade);

        if ("COMPLETED".equalsIgnoreCase(status) && producedMeters != null && job.getFabricProductId() != null) {
            FabricProduct fp = fabricRepository.findById(job.getFabricProductId()).orElse(null);
            if (fp != null) {
                double current = fp.getTotalStockMeters() != null ? fp.getTotalStockMeters() : 0.0;
                fp.setTotalStockMeters(current + producedMeters);
                fabricRepository.save(fp);
            }
        }

        return ResponseEntity.ok(productionJobRepository.save(job));
    }
}