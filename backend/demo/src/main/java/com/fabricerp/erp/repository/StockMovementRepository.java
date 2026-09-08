package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByFabricIdOrderByIdDesc(Long fabricId);
    List<StockMovement> findAllByOrderByIdDesc();
}