package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByPlantDepartmentAndActiveTrue(String plantDepartment);
    Optional<Worker> findByBadgeNumber(String badgeNumber);
    List<Worker> findAllByOrderByIdDesc();
}