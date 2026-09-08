package com.fabricerp.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wholesale_invoices")
public class WholesaleInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String invoiceNumber; // e.g. ROYAL-DISPATCH-90214

    private String clientCompanyName;
    private String clientPhone;
    private String transportLRNumber; // Lorry Receipt Number / Shipping Ref

    @Column(precision = 10, scale = 2)
    private BigDecimal totalTaxableValue;

    @Column(precision = 10, scale = 2)
    private BigDecimal gstAmount;

    @Column(precision = 10, scale = 2)
    private BigDecimal grandTotalValue;

    private String paymentTerms; // ADVANCE, CREDIT_30_DAYS, CREDIT_60_DAYS
    private LocalDateTime dispatchDate;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "wholesale_invoice_id")
    private List<InvoiceItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dispatchDate = LocalDateTime.now();
        if (this.paymentTerms == null) this.paymentTerms = "CREDIT_30_DAYS";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getClientCompanyName() { return clientCompanyName; }
    public void setClientCompanyName(String clientCompanyName) { this.clientCompanyName = clientCompanyName; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public String getTransportLRNumber() { return transportLRNumber; }
    public void setTransportLRNumber(String transportLRNumber) { this.transportLRNumber = transportLRNumber; }

    public BigDecimal getTotalTaxableValue() { return totalTaxableValue; }
    public void setTotalTaxableValue(BigDecimal totalTaxableValue) { this.totalTaxableValue = totalTaxableValue; }

    public BigDecimal getGstAmount() { return gstAmount; }
    public void setGstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; }

    public BigDecimal getGrandTotalValue() { return grandTotalValue; }
    public void setGrandTotalValue(BigDecimal grandTotalValue) { this.grandTotalValue = grandTotalValue; }

    public String getPaymentTerms() { return paymentTerms; }
    public void setPaymentTerms(String paymentTerms) { this.paymentTerms = paymentTerms; }

    public LocalDateTime getDispatchDate() { return dispatchDate; }
    public void setDispatchDate(LocalDateTime dispatchDate) { this.dispatchDate = dispatchDate; }

    public List<InvoiceItem> getItems() { return items; }
    public void setItems(List<InvoiceItem> items) { this.items = items; }
}