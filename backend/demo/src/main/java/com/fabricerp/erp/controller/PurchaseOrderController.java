package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.PurchaseOrder;
import com.fabricerp.erp.entity.PurchaseOrderItem;
import com.fabricerp.erp.entity.Supplier;
import com.fabricerp.erp.repository.PurchaseOrderRepository;
import com.fabricerp.erp.repository.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;

    public PurchaseOrderController(PurchaseOrderRepository purchaseOrderRepository,
                                   SupplierRepository supplierRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<PurchaseOrder> getAll() {
        return purchaseOrderRepository.findAllByOrderByIdDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return purchaseOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createPurchaseOrder(@RequestBody PurchaseOrder po) {
        if (po.getSupplierId() == null) {
            return ResponseEntity.badRequest().body("Supplier Mill is required");
        }
        if (po.getItems() == null || po.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("At least one fabric roll item is required");
        }

        Supplier supplier = supplierRepository.findById(po.getSupplierId()).orElse(null);
        if (supplier != null) {
            po.setSupplierMillName(supplier.getMillName());
            po.setMillContactPerson(supplier.getContactPerson());
            po.setMillPhone(supplier.getPhone());
            po.setMillCity(supplier.getCity());
        }

        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        po.setPoNumber("PO-" + time);

        BigDecimal total = BigDecimal.ZERO;
        for (PurchaseOrderItem item : po.getItems()) {
            double meters = item.getOrderedMeters() != null ? item.getOrderedMeters() : 0.0;
            BigDecimal rate = item.getEstimatedCostPerMeter() != null ? item.getEstimatedCostPerMeter() : BigDecimal.ZERO;
            BigDecimal lineTotal = rate.multiply(BigDecimal.valueOf(meters)).setScale(2, RoundingMode.HALF_UP);
            item.setSubTotal(lineTotal);
            total = total.add(lineTotal);
        }

        po.setTotalEstimatedCost(total);
        if (po.getStatus() == null) {
            po.setStatus("ISSUED_TO_MILL");
        }

        return ResponseEntity.ok(purchaseOrderRepository.save(po));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        PurchaseOrder po = purchaseOrderRepository.findById(id).orElse(null);
        if (po == null) {
            return ResponseEntity.notFound().build();
        }
        po.setStatus(status);
        return ResponseEntity.ok(purchaseOrderRepository.save(po));
    }
}