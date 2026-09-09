package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.WholesaleInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WholesaleInvoiceRepository extends JpaRepository<WholesaleInvoice, Long> {
    List<WholesaleInvoice> findByDispatchDateBetween(LocalDateTime start, LocalDateTime end);
}