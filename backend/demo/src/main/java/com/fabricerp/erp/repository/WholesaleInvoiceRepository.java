package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.WholesaleInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WholesaleInvoiceRepository extends JpaRepository<WholesaleInvoice, Long> {
}