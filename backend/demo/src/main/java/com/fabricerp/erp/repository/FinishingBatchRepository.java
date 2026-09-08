package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.FinishingBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinishingBatchRepository extends JpaRepository<FinishingBatch, Long> {
    List<FinishingBatch> findAllByOrderByIdDesc();
}