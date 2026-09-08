package com.fabricerp.erp.service;

import com.fabricerp.erp.entity.FabricProduct;
import java.util.List;
import java.util.Optional;

public interface FabricService {

    List<FabricProduct> getAllFabrics();

    List<FabricProduct> getRemnantFabrics();

    Optional<FabricProduct> getFabricById(Long id);

    Optional<FabricProduct> getFabricBySku(String itemCode);

    FabricProduct createFabric(FabricProduct fabric);

    FabricProduct updateFabric(Long id, FabricProduct fabric);

    FabricProduct toggleRemnant(Long id, Double discountPct);

    void deleteFabric(Long id);

    boolean existsByItemCode(String itemCode);

    void deductStock(Long fabricId, Double cutMeters);

    void addStock(Long fabricId, Double addedMeters, java.math.BigDecimal purchaseCost);
}