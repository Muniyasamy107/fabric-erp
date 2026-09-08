package com.fabricerp.erp.dto.response;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.WholesaleInvoice;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardStatsDTO {
    private BigDecimal totalRevenue;
    private Long totalOrdersCount;
    private Double totalMetersSold;
    private Long lowStockCount;
    private Long activeTailoringCount;
    private List<WholesaleInvoice> recentOrders = new ArrayList<>();
    private List<FabricProduct> lowStockFabrics = new ArrayList<>();

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalOrdersCount() { return totalOrdersCount; }
    public void setTotalOrdersCount(Long totalOrdersCount) { this.totalOrdersCount = totalOrdersCount; }

    public Double getTotalMetersSold() { return totalMetersSold; }
    public void setTotalMetersSold(Double totalMetersSold) { this.totalMetersSold = totalMetersSold; }

    public Long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(Long lowStockCount) { this.lowStockCount = lowStockCount; }

    public Long getActiveTailoringCount() { return activeTailoringCount; }
    public void setActiveTailoringCount(Long activeTailoringCount) { this.activeTailoringCount = activeTailoringCount; }

    public List<WholesaleInvoice> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<WholesaleInvoice> recentOrders) { this.recentOrders = recentOrders; }

    public List<FabricProduct> getLowStockFabrics() { return lowStockFabrics; }
    public void setLowStockFabrics(List<FabricProduct> lowStockFabrics) { this.lowStockFabrics = lowStockFabrics; }
}