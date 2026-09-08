package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    List<SparePart> findAllByOrderByIdDesc();
    Optional<SparePart> findByPartSku(String partSku);
}