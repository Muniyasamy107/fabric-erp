package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.StockMovement;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.StockMovementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    private final StockMovementRepository stockMovementRepository;
    private final FabricRepository fabricRepository;

    public StockMovementController(StockMovementRepository stockMovementRepository, FabricRepository fabricRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.fabricRepository = fabricRepository;
    }

    @GetMapping
    public List<StockMovement> getAllMovements() {
        return stockMovementRepository.findAllByOrderByIdDesc();
    }

    @GetMapping("/fabric/{fabricId}")
    public List<StockMovement> getMovementsByFabric(@PathVariable Long fabricId) {
        return stockMovementRepository.findByFabricIdOrderByIdDesc(fabricId);
    }

    @PostMapping("/record-wastage")
    @Transactional
    public ResponseEntity<?> recordWastage(@RequestBody StockMovement request) {
        if (request.getFabricId() == null || request.getMeters() == null || request.getMeters() <= 0) {
            return ResponseEntity.badRequest().body("Fabric ID and positive wastage meters required");
        }

        FabricProduct fabric = fabricRepository.findById(request.getFabricId())
                .orElseThrow(() -> new RuntimeException("Fabric product not found: " + request.getFabricId()));

        double current = fabric.getTotalStockMeters() != null ? fabric.getTotalStockMeters() : 0.0;
        if (current < request.getMeters()) {
            return ResponseEntity.badRequest().body("Wastage cannot exceed current stock balance (" + current + "m)");
        }

        double newBalance = current - request.getMeters();
        fabric.setTotalStockMeters(newBalance);
        fabricRepository.save(fabric);

        StockMovement entry = new StockMovement();
        entry.setFabricId(fabric.getId());
        entry.setItemCode(fabric.getQualityCode());
        entry.setFabricName(fabric.getFabricName());
        entry.setMovementType("WASTAGE");
        entry.setMeters(-request.getMeters());
        entry.setBalanceAfter(newBalance);
        entry.setReferenceNumber(request.getReferenceNumber() != null ? request.getReferenceNumber() : "WASTE-LOG");
        entry.setNotes(request.getNotes() != null ? request.getNotes() : "Weaving loom defect write-off");

        return ResponseEntity.ok(stockMovementRepository.save(entry));
    }
}