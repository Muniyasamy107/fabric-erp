package com.fabricerp.erp.repository;

import com.fabricerp.erp.entity.FabricRollPacking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FabricRollPackingRepository extends JpaRepository<FabricRollPacking, Long> {
    List<FabricRollPacking> findAllByOrderByIdDesc();
    List<FabricRollPacking> findByBatchLotNumberOrderByIdDesc(String batchLotNumber);
    List<FabricRollPacking> findByBalePackageNumber(String balePackageNumber);
    Optional<FabricRollPacking> findByRollBarcodeNumber(String rollBarcodeNumber);
}