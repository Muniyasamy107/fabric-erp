package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.repository.FabricRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/fabrics")
public class FabricController {

    private final FabricRepository fabricRepository;

    public FabricController(FabricRepository fabricRepository) {
        this.fabricRepository = fabricRepository;
    }

    @GetMapping
    public List<FabricProduct> getAllFabrics() {
        return fabricRepository.findAll();
    }

    @GetMapping("/remnants")
    public List<FabricProduct> getRemnantFabrics() {
        return fabricRepository.findByIsRemnantTrue();
    }

    @PutMapping("/{id}/toggle-remnant")
    public ResponseEntity<?> toggleRemnant(@PathVariable Long id,
                                           @RequestParam(required = false) Double discountPct) {
        return fabricRepository.findById(id)
                .map(fabric -> {
                    boolean nowRemnant = !Boolean.TRUE.equals(fabric.getIsRemnant());
                    fabric.setIsRemnant(nowRemnant);
                    fabric.setRemnantDiscountPct(nowRemnant ? (discountPct != null ? discountPct : 10.0) : null);
                    return ResponseEntity.ok(fabricRepository.save(fabric));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/sku/{qualityCode}")
    public ResponseEntity<?> getBySku(@PathVariable String qualityCode) {
        return fabricRepository.findByQualityCode(qualityCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFabric(@PathVariable Long id) {
        return fabricRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addFabric(@RequestBody FabricProduct fabric) {
        try {
            String code = fabric.getQualityCode();
            String name = fabric.getFabricName();

            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Item Code (SKU) is required");
            }
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Fabric Name is required");
            }

            if (fabricRepository.findByQualityCode(code.trim()).isPresent()) {
                return ResponseEntity.badRequest().body("Item Code (SKU) already exists: " + code.trim());
            }

            fabric.setQualityCode(code.trim());
            fabric.setFabricName(name.trim());
            if (fabric.getWholesalePricePerMeter() == null) fabric.setWholesalePricePerMeter(BigDecimal.ZERO);
            if (fabric.getTotalStockMeters() == null) fabric.setTotalStockMeters(0.0);
            if (fabric.getMinStockAlert() == null) fabric.setMinStockAlert(10.0);
            if (fabric.getGstRate() == null) fabric.setGstRate(5.0);
            if (fabric.getWarehouseBinLocation() == null) fabric.setWarehouseBinLocation("Rack A-01");
            if (fabric.getHsnCode() == null) fabric.setHsnCode("5007");

            FabricProduct saved = fabricRepository.save(fabric);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving fabric: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFabric(@PathVariable Long id, @RequestBody FabricProduct incoming) {
        try {
            FabricProduct existing = fabricRepository.findById(id).orElse(null);
            if (existing == null) {
                return ResponseEntity.badRequest().body("Fabric not found with ID: " + id);
            }

            if (incoming.getQualityCode() != null && !incoming.getQualityCode().trim().isEmpty()
                    && !incoming.getQualityCode().trim().equalsIgnoreCase(existing.getQualityCode())) {
                if (fabricRepository.findByQualityCode(incoming.getQualityCode().trim()).isPresent()) {
                    return ResponseEntity.badRequest().body("Item Code (SKU) already exists for another product.");
                }
                existing.setQualityCode(incoming.getQualityCode().trim());
            }

            if (incoming.getFabricName() != null) existing.setFabricName(incoming.getFabricName().trim());
            if (incoming.getFabricType() != null) existing.setFabricType(incoming.getFabricType());
            if (incoming.getGsm() != null) existing.setGsm(incoming.getGsm());
            if (incoming.getWarehouseBinLocation() != null) existing.setWarehouseBinLocation(incoming.getWarehouseBinLocation());
            if (incoming.getHsnCode() != null) existing.setHsnCode(incoming.getHsnCode());
            if (incoming.getSeasonCollection() != null) existing.setSeasonCollection(incoming.getSeasonCollection());
            if (incoming.getRecommendedGarment() != null) existing.setRecommendedGarment(incoming.getRecommendedGarment());
            if (incoming.getImageUrl() != null) existing.setImageUrl(incoming.getImageUrl().trim());
            if (incoming.getWholesalePricePerMeter() != null) existing.setWholesalePricePerMeter(incoming.getWholesalePricePerMeter());
            if (incoming.getTotalStockMeters() != null) existing.setTotalStockMeters(incoming.getTotalStockMeters());
            if (incoming.getMinStockAlert() != null) existing.setMinStockAlert(incoming.getMinStockAlert());
            if (incoming.getGstRate() != null) existing.setGstRate(incoming.getGstRate());
            if (incoming.getIsRemnant() != null) existing.setIsRemnant(incoming.getIsRemnant());
            if (incoming.getRemnantDiscountPct() != null) existing.setRemnantDiscountPct(incoming.getRemnantDiscountPct());

            FabricProduct updated = fabricRepository.save(existing);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating fabric: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFabric(@PathVariable Long id) {
        try {
            if (!fabricRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            fabricRepository.deleteById(id);
            return ResponseEntity.ok("Deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Cannot delete. Fabric is referenced in order records.");
        }
    }
}