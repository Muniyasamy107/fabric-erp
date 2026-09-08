package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.EtpComplianceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtpComplianceRepository extends JpaRepository<EtpComplianceLog, Long> {
    List<EtpComplianceLog> findAllByOrderByAuditDateDesc();
    Optional<EtpComplianceLog> findByLogCertificateNumber(String logCertificateNumber);
}