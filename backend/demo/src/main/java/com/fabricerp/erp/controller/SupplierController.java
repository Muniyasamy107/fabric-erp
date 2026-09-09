package com.fabricerp.erp.controller;

import com.fabricerp.erp.dto.request.StockInwardRequest;
import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.StockMovement;
import com.fabricerp.erp.entity.Supplier;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.StockMovementRepository;
import com.fabricerp.erp.repository.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository supplierRepository;
    private final FabricRepository fabricRepository;
    private final StockMovementRepository stockMovementRepository;

    public SupplierController(SupplierRepository supplierRepository,
                              FabricRepository fabricRepository,
                              StockMovementRepository stockMovementRepository) {
        this.supplierRepository = supplierRepository;
        this.fabricRepository = fabricRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    /**
     * Receive a yarn/fabric consignment from a supplier: increases warehouse
     * stock and records an INWARD stock movement for the ledger.
     */
    @PostMapping("/stock-inward")
    @Transactional
    public ResponseEntity<?> stockInward(@RequestBody StockInwardRequest request) {
        if (request.getFabricId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fabric is required"));
        }
        if (request.getAddedMeters() == null || request.getAddedMeters() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Added meters must be greater than zero"));
        }

        FabricProduct fabric = fabricRepository.findById(request.getFabricId()).orElse(null);
        if (fabric == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fabric not found with ID: " + request.getFabricId()));
        }

        String supplierName = null;
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId()).orElse(null);
            if (supplier == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Supplier not found with ID: " + request.getSupplierId()));
            }
            supplierName = supplier.getMillName();
        }

        double current = fabric.getTotalStockMeters() != null ? fabric.getTotalStockMeters() : 0.0;
        double newBalance = current + request.getAddedMeters();
        fabric.setTotalStockMeters(newBalance);

        BigDecimal cost = request.getPurchaseCostPerMeter();
        if (cost != null && cost.compareTo(BigDecimal.ZERO) > 0
                && (fabric.getWholesalePricePerMeter() == null
                    || fabric.getWholesalePricePerMeter().compareTo(BigDecimal.ZERO) <= 0)) {
            fabric.setWholesalePricePerMeter(cost);
        }
        fabricRepository.save(fabric);

        StockMovement movement = new StockMovement();
        movement.setFabricId(fabric.getId());
        movement.setItemCode(fabric.getQualityCode());
        movement.setFabricName(fabric.getFabricName());
        movement.setMovementType("INWARD");
        movement.setMeters(request.getAddedMeters());
        movement.setBalanceAfter(newBalance);
        movement.setReferenceNumber(request.getConsignmentNumber() != null && !request.getConsignmentNumber().isBlank()
                ? request.getConsignmentNumber()
                : "INWARD-" + System.currentTimeMillis());
        movement.setNotes(supplierName != null ? "Consignment received from " + supplierName : "Consignment received");
        stockMovementRepository.save(movement);

        return ResponseEntity.ok(fabric);
    }
}
