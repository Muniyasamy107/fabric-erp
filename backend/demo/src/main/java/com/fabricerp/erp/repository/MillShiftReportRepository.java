package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.MillShiftReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MillShiftReportRepository extends JpaRepository<MillShiftReport, Long> {
    List<MillShiftReport> findAllByOrderByIdDesc();
}