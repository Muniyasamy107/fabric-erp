package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.ProductionJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionJobRepository extends JpaRepository<ProductionJob, Long> {
}