package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.FactoryGatePass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactoryGatePassRepository extends JpaRepository<FactoryGatePass, Long> {
    List<FactoryGatePass> findAllByOrderByIdDesc();
    Optional<FactoryGatePass> findByGatePassNumber(String gatePassNumber);
    List<FactoryGatePass> findByPassType(String passType);
}