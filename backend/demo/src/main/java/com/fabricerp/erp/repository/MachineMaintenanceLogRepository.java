package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.MachineMaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineMaintenanceLogRepository extends JpaRepository<MachineMaintenanceLog, Long> {
    List<MachineMaintenanceLog> findAllByOrderByIdDesc();
    List<MachineMaintenanceLog> findByStatus(String status);
}