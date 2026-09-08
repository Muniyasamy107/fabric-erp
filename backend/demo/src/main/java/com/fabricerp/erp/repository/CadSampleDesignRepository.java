package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.CadSampleDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CadSampleDesignRepository extends JpaRepository<CadSampleDesign, Long> {
    List<CadSampleDesign> findAllByOrderByIdDesc();
    Optional<CadSampleDesign> findByDesignCode(String designCode);
    List<CadSampleDesign> findBySampleDevelopmentStatus(String sampleDevelopmentStatus);
}