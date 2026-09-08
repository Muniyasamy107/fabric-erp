package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.FabricProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FabricRepository extends JpaRepository<FabricProduct, Long> {
    Optional<FabricProduct> findByQualityCode(String qualityCode);
}