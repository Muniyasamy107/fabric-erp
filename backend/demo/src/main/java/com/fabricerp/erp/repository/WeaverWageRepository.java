package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.WeaverWageEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeaverWageRepository extends JpaRepository<WeaverWageEntry, Long> {
    List<WeaverWageEntry> findByWeaverNameOrderByIdDesc(String weaverName);
}