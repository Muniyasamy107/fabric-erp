package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.FinishingBatch;
import com.fabricerp.erp.entity.ProductionJob;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.FinishingBatchRepository;
import com.fabricerp.erp.repository.ProductionJobRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/finishing")
public class FinishingBatchController {

    private final FinishingBatchRepository finishingRepository;
    private final ProductionJobRepository jobRepository;
    private final FabricRepository fabricRepository;

    public FinishingBatchController(FinishingBatchRepository finishingRepository,
                                    ProductionJobRepository jobRepository,
                                    FabricRepository fabricRepository) {
        this.finishingRepository = finishingRepository;
        this.jobRepository = jobRepository;
        this.fabricRepository = fabricRepository;
    }

    @GetMapping("/batches")
    public List<FinishingBatch> getAllBatches() {
        return finishingRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/batches")
    @Transactional
    public ResponseEntity<?> createFinishingBatch(@RequestBody FinishingBatch batch) {
        if (batch.getRawBatchLotNumber() == null || batch.getRawBatchLotNumber().isBlank()) {
            return ResponseEntity.badRequest().body("Raw Batch Lot is required");
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        batch.setFinishBatchNumber("FINISH-" + timestamp);
        if (batch.getOutputFinishedMeters() == null) {
            batch.setOutputFinishedMeters(batch.getInputGreigeMeters());
        }

        return ResponseEntity.ok(finishingRepository.save(batch));
    }

    @PutMapping("/batches/{id}/status")
    @Transactional
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) Double outputMeters) {

        FinishingBatch batch = finishingRepository.findById(id).orElse(null);
        if (batch == null) return ResponseEntity.notFound().build();

        batch.setFinishStatus(status);
        if (outputMeters != null) {
            batch.setOutputFinishedMeters(outputMeters);
        }

        // If batch completed, update production job status
        if ("COMPLETED".equalsIgnoreCase(status) && batch.getProductionJobId() != null) {
            ProductionJob job = jobRepository.findById(batch.getProductionJobId()).orElse(null);
            if (job != null) {
                job.setJobStatus("CALENDERING_FINISH");
                jobRepository.save(job);
            }
        }

        return ResponseEntity.ok(finishingRepository.save(batch));
    }
}