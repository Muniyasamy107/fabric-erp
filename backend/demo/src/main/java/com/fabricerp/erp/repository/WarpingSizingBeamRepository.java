package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.WarpingSizingBeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarpingSizingBeamRepository extends JpaRepository<WarpingSizingBeam, Long> {
    List<WarpingSizingBeam> findAllByOrderByIdDesc();
    Optional<WarpingSizingBeam> findByBeamNumber(String beamNumber);
    List<WarpingSizingBeam> findByBeamStatus(String beamStatus);
}