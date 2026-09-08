package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.WholesaleClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WholesaleClientRepository extends JpaRepository<WholesaleClient, Long> {
    Optional<WholesaleClient> findByContactPhone(String contactPhone);
}