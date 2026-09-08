package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.ExportContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExportContractRepository extends JpaRepository<ExportContract, Long> {
    List<ExportContract> findAllByOrderByIdDesc();
    Optional<ExportContract> findByExportContractNumber(String exportContractNumber);
    List<ExportContract> findByContractStatus(String contractStatus);
}