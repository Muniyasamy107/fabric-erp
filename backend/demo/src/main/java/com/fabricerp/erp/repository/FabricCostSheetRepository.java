package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.FabricCostSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FabricCostSheetRepository extends JpaRepository<FabricCostSheet, Long> {
    List<FabricCostSheet> findAllByOrderByIdDesc();
    Optional<FabricCostSheet> findByCostingSheetNumber(String costingSheetNumber);
}