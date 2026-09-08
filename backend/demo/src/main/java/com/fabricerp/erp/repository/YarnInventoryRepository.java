package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.YarnInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface YarnInventoryRepository extends JpaRepository<YarnInventory, Long> {
    List<YarnInventory> findAllByOrderByIdDesc();
    Optional<YarnInventory> findByYarnLotNumber(String yarnLotNumber);
}