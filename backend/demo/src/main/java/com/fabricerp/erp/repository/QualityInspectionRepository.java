package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.QualityInspectionReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QualityInspectionRepository extends JpaRepository<QualityInspectionReport, Long> {
    List<QualityInspectionReport> findAllByOrderByIdDesc();
    Optional<QualityInspectionReport> findByCertificateNumber(String certificateNumber);
}