package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.ProductionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductionPlanRepository extends JpaRepository<ProductionPlan, Long> {
    List<ProductionPlan> findAllByOrderByIdDesc();
    Optional<ProductionPlan> findByPlanNumber(String planNumber);
    List<ProductionPlan> findByCurrentStage(String currentStage);
}