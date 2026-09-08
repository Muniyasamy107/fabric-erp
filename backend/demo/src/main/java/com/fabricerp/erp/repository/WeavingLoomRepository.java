package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.WeavingLoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeavingLoomRepository extends JpaRepository<WeavingLoom, Long> {
}