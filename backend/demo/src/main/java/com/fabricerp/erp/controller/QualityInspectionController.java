package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.ProductionJob;
import com.fabricerp.erp.entity.QualityInspectionReport;
import com.fabricerp.erp.repository.ProductionJobRepository;
import com.fabricerp.erp.repository.QualityInspectionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/quality")
public class QualityInspectionController {

    private final QualityInspectionRepository qcRepository;
    private final ProductionJobRepository jobRepository;

    public QualityInspectionController(QualityInspectionRepository qcRepository, ProductionJobRepository jobRepository) {
        this.qcRepository = qcRepository;
        this.jobRepository = jobRepository;
    }

    @GetMapping("/reports")
    public List<QualityInspectionReport> getAllReports() {
        return qcRepository.findAllByOrderByIdDesc();
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        return qcRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/inspect")
    @Transactional
    public ResponseEntity<?> createInspectionReport(@RequestBody QualityInspectionReport report) {
        if (report.getBatchLotNumber() == null || report.getBatchLotNumber().isBlank()) {
            return ResponseEntity.badRequest().body("Batch Lot Number is required for QC inspection");
        }

        // Generate Certificate No e.g. QC-CERT-240904-889
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        report.setCertificateNumber("QC-CERT-" + timestamp);

        // ASTM 4-Point Score Calculation:
        // Points = (Total Defect Points * 3600) / (Inspected Meters * Width in Inches)
        double totalDefectPoints = (report.getMinorDefectsCount() * 1.5) + (report.getMajorDefectsCount() * 4.0);
        double width = (report.getStandardWidthInches() != null && report.getStandardWidthInches() > 0) ? report.getStandardWidthInches() : 58.0;
        double inspectedMeters = (report.getTotalInspectedMeters() != null && report.getTotalInspectedMeters() > 0) ? report.getTotalInspectedMeters() : 100.0;

        double score = (totalDefectPoints * 3600.0) / (inspectedMeters * width);
        report.setFourPointScore(Math.round(score * 100.0) / 100.0);

        // Auto Grade Assessment
        if (score <= 20.0) {
            report.setFinalVerdict("GRADE_A_PASS");
        } else if (score <= 35.0) {
            report.setFinalVerdict("GRADE_B_ACCEPTABLE");
        } else {
            report.setFinalVerdict("REJECTED_SECONDS");
        }

        // Update corresponding production job quality grade
        if (report.getProductionJobId() != null) {
            ProductionJob job = jobRepository.findById(report.getProductionJobId()).orElse(null);
            if (job != null) {
                job.setFabricQualityGrade(report.getFinalVerdict());
                job.setJobStatus("QUALITY_INSPECT");
                jobRepository.save(job);
            }
        }

        return ResponseEntity.ok(qcRepository.save(report));
    }
}