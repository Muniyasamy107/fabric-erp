package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.LoomTelemetryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoomTelemetryRepository extends JpaRepository<LoomTelemetryLog, Long> {
    List<LoomTelemetryLog> findAllByOrderByLoomNumberAsc();
    Optional<LoomTelemetryLog> findByLoomNumber(String loomNumber);
}