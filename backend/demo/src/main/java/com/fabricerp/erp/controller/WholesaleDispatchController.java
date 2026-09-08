package com.fabricerp.erp.controller;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.WholesaleInvoice;
import com.fabricerp.erp.entity.InvoiceItem;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.WholesaleInvoiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/dispatch")
public class WholesaleDispatchController {

    private final WholesaleInvoiceRepository invoiceRepository;
    private final FabricRepository fabricRepository;

    public WholesaleDispatchController(WholesaleInvoiceRepository invoiceRepository,
                                       FabricRepository fabricRepository) {
        this.invoiceRepository = invoiceRepository;
        this.fabricRepository = fabricRepository;
    }

    @GetMapping("/invoices")
    public List<WholesaleInvoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> dispatchConsignment(@RequestBody WholesaleInvoice invoice) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        invoice.setInvoiceNumber("ROYAL-DISPATCH-" + timestamp);

        BigDecimal taxable = BigDecimal.ZERO;

        if (invoice.getItems() != null) {
            for (InvoiceItem item : invoice.getItems()) {
                FabricProduct fp = fabricRepository.findById(item.getFabricProductId())
                        .orElseThrow(() -> new RuntimeException("Fabric Product Not Found: " + item.getFabricProductId()));

                double available = fp.getTotalStockMeters() != null ? fp.getTotalStockMeters() : 0.0;
                double shipped = item.getShippedMeters() != null ? item.getShippedMeters() : 0.0;

                if (available < shipped) {
                    return ResponseEntity.badRequest().body("Insufficient warehouse stock for: " + fp.getFabricName());
                }

                BigDecimal price = fp.getWholesalePricePerMeter() != null ? fp.getWholesalePricePerMeter() : BigDecimal.ZERO;
                BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(shipped)).setScale(2, RoundingMode.HALF_UP);

                item.setPricePerMeter(price);
                item.setFabricProductName(fp.getFabricName());
                item.setLineTotal(lineTotal);
                taxable = taxable.add(lineTotal);

                fp.setTotalStockMeters(available - shipped);
                fabricRepository.save(fp);
            }
        }

        double gstPct = 5.0;
        BigDecimal gst = taxable.multiply(BigDecimal.valueOf(gstPct / 100)).setScale(2, RoundingMode.HALF_UP);
        invoice.setTotalTaxableValue(taxable);
        invoice.setGstAmount(gst);
        invoice.setGrandTotalValue(taxable.add(gst));

        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }
}