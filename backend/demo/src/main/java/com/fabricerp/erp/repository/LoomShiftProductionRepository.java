package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.LoomShiftProduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoomShiftProductionRepository extends JpaRepository<LoomShiftProduction, Long> {
    List<LoomShiftProduction> findAllByOrderByIdDesc();
    Optional<LoomShiftProduction> findByShiftLogNumber(String shiftLogNumber);
}