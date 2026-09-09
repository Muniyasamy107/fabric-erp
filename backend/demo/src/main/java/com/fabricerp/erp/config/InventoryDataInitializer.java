package com.fabricerp.erp.config;

import com.fabricerp.erp.entity.FabricProduct;
import com.fabricerp.erp.entity.StockMovement;
import com.fabricerp.erp.entity.Supplier;
import com.fabricerp.erp.entity.YarnInventory;
import com.fabricerp.erp.repository.FabricRepository;
import com.fabricerp.erp.repository.StockMovementRepository;
import com.fabricerp.erp.repository.SupplierRepository;
import com.fabricerp.erp.repository.YarnInventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Seeds realistic fabric-mill master data on first startup only:
 * fabric catalog with catalog photography, yarn inventory, yarn/fabric
 * suppliers and matching INWARD stock ledger entries.
 * Skipped automatically once data exists.
 */
@Component
@Order(2)
public class InventoryDataInitializer implements CommandLineRunner {

    private final FabricRepository fabricRepository;
    private final YarnInventoryRepository yarnRepository;
    private final SupplierRepository supplierRepository;
    private final StockMovementRepository stockMovementRepository;

    public InventoryDataInitializer(FabricRepository fabricRepository,
                                    YarnInventoryRepository yarnRepository,
                                    SupplierRepository supplierRepository,
                                    StockMovementRepository stockMovementRepository) {
        this.fabricRepository = fabricRepository;
        this.yarnRepository = yarnRepository;
        this.supplierRepository = supplierRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Override
    public void run(String... args) {
        seedFabrics();
        seedYarnInventory();
        seedSuppliers();
    }

    // ------------------------------------------------------------------
    // Fabric catalog — finished woven fabrics ready for sale/dispatch
    // ------------------------------------------------------------------
    private void seedFabrics() {
        if (fabricRepository.count() > 0) return;

        addFabric("RF-COT-001", "Cotton Poplin 60s x 60s", "COTTON_SHIRTING", 115,
                new BigDecimal("145.00"), 1850.0, "Rack A-01", "5208",
                "All-Season Classic", "Formal Shirts", "/fabrics/cotton-shirting.jpg");
        addFabric("RF-COT-002", "Cotton Cambric 40s x 40s", "COTTON_SHIRTING", 105,
                new BigDecimal("110.00"), 2400.0, "Rack A-02", "5208",
                "All-Season Classic", "Kurtas & Casual Shirts", "/fabrics/cotton-cambric.jpg");
        addFabric("RF-COT-003", "Oxford Shirting 40s x 40s", "COTTON_SHIRTING", 140,
                new BigDecimal("160.00"), 1320.0, "Rack A-03", "5208",
                "Autumn Weaves", "Oxford Shirts", "/fabrics/oxford-blue.jpg");
        addFabric("RF-COT-004", "Cotton Voile 80s x 80s", "COTTON_SHIRTING", 80,
                new BigDecimal("175.00"), 760.0, "Rack A-04", "5208",
                "Summer Breeze", "Summer Shirts & Dresses", "/fabrics/cotton-voile.jpg");
        addFabric("RF-COT-005", "Cotton Satin 60s", "COTTON_SHIRTING", 130,
                new BigDecimal("195.00"), 940.0, "Rack A-05", "5208",
                "Festive Lustre", "Premium Shirts", "/fabrics/cotton-satin.jpg");
        addFabric("RF-COT-010", "Cotton Canvas 10s x 10s", "COTTON_HEAVY", 285,
                new BigDecimal("185.00"), 1150.0, "Rack B-01", "5208",
                "Utility Range", "Bags, Upholstery & Jackets", "/fabrics/canvas-natural.jpg");
        addFabric("RF-COT-011", "Cotton Drill 3/1 Twill", "COTTON_HEAVY", 245,
                new BigDecimal("170.00"), 880.0, "Rack B-02", "5208",
                "Utility Range", "Workwear & Trousers", "/fabrics/cotton-drill.jpg");
        addFabric("RF-SLK-001", "Silk Crepe 20/22D", "PURE_SILK", 70,
                new BigDecimal("520.00"), 420.0, "Rack C-01", "5007",
                "Heritage Silk", "Sarees & Occasion Wear", "/fabrics/silk-crepe.jpg");
        addFabric("RF-SLK-002", "Silk Charmeuse 22 Momme", "PURE_SILK", 92,
                new BigDecimal("640.00"), 260.0, "Rack C-02", "5007",
                "Heritage Silk", "Evening Wear & Linings", "/fabrics/silk-charmeuse.jpg");
        addFabric("RF-BLD-001", "Poly-Cotton Poplin 65/35", "BLENDED", 110,
                new BigDecimal("85.00"), 3200.0, "Rack D-01", "5513",
                "Value Volume", "Uniforms & Daily Wear", "/fabrics/polycotton-poplin.jpg");
        addFabric("RF-BLD-002", "Viscose Crepe 30s", "BLENDED", 125,
                new BigDecimal("130.00"), 1540.0, "Rack D-02", "5516",
                "Monsoon Drape", "Kurtis & Dresses", "/fabrics/viscose-floral.jpg");
        addFabric("RF-BLD-003", "Polyester Crepe 75D", "SYNTHETIC", 118,
                new BigDecimal("78.00"), 2750.0, "Rack D-03", "5407",
                "Value Volume", "Ladies Wear & Linings", "/fabrics/poly-crepe.jpg");
        addFabric("RF-BLD-004", "Cotton-Linen 55/45", "BLENDED", 150,
                new BigDecimal("210.00"), 610.0, "Rack D-04", "5309",
                "Summer Breeze", "Resort Shirts & Trousers", "/fabrics/linen-blend.jpg");
        addFabric("RF-SUT-001", "Worsted Suiting 2/48s", "SUITING", 240,
                new BigDecimal("720.00"), 380.0, "Rack E-01", "5112",
                "Executive Range", "Suits & Blazers", "/fabrics/suiting-charcoal.jpg");
        addFabric("RF-SUT-002", "Poly-Wool Suiting 80/20", "SUITING", 230,
                new BigDecimal("480.00"), 540.0, "Rack E-02", "5112",
                "Executive Range", "Office Suits", "/fabrics/polywool-suiting.jpg");
        addFabric("RF-SUT-003", "Cotton Twill 2/20s Stretch", "COTTON_HEAVY", 210,
                new BigDecimal("180.00"), 990.0, "Rack B-03", "5208",
                "Utility Range", "Chinos & Casual Trousers", "/fabrics/stretch-twill.jpg");
        addFabric("RF-DNM-001", "Indigo Denim 3/1 Twill 10s", "COTTON_HEAVY", 320,
                new BigDecimal("240.00"), 1450.0, "Rack B-04", "5209",
                "Denim Works", "Jeans & Jackets", "/fabrics/denim-indigo.jpg");
        addFabric("RF-TRY-001", "Terry Cotton Loop 20s", "COTTON_HEAVY", 380,
                new BigDecimal("260.00"), 720.0, "Rack B-05", "5208",
                "Home Textiles", "Towels & Bathrobes", "/fabrics/terry-white.jpg");
        addFabric("RF-FLN-001", "Brushed Flannel Check", "COTTON_SHIRTING", 170,
                new BigDecimal("205.00"), 640.0, "Rack A-06", "5208",
                "Winter Comfort", "Flannel Shirts & Loungewear", "/fabrics/flannel-check.jpg");

        // One clearance remnant so the Remnant Clearance section has a live example
        FabricProduct remnant = fabricRepository.findByQualityCode("RF-COT-002").orElse(null);
        if (remnant != null) {
            FabricProduct clearance = new FabricProduct();
            clearance.setQualityCode("RF-COT-002-R1");
            clearance.setFabricName("Cotton Cambric 40s (Remnant Piece)");
            clearance.setFabricType("COTTON_SHIRTING");
            clearance.setGsm(105);
            clearance.setWholesalePricePerMeter(new BigDecimal("110.00"));
            clearance.setTotalStockMeters(42.5);
            clearance.setMinStockAlert(0.0);
            clearance.setGstRate(5.0);
            clearance.setHsnCode("5208");
            clearance.setSeasonCollection("Clearance Lots");
            clearance.setRecommendedGarment("Kurtas & Casual Shirts");
            clearance.setWarehouseBinLocation("Remnant Rack R-01");
            clearance.setIsRemnant(true);
            clearance.setRemnantDiscountPct(15.0);
            clearance.setImageUrl("/fabrics/cotton-cambric.jpg");
            fabricRepository.save(clearance);
        }

        System.out.println("Factory Fabric Catalog Initialized: " + fabricRepository.count() + " qualities");
    }

    private void addFabric(String sku, String name, String type, int gsm, BigDecimal pricePerMeter,
                           double stockMeters, String bin, String hsn, String season, String garment,
                           String imageUrl) {
        FabricProduct f = new FabricProduct();
        f.setQualityCode(sku);
        f.setFabricName(name);
        f.setFabricType(type);
        f.setGsm(gsm);
        f.setWholesalePricePerMeter(pricePerMeter);
        f.setTotalStockMeters(stockMeters);
        f.setMinStockAlert(100.0);
        f.setGstRate(5.0);
        f.setHsnCode(hsn);
        f.setSeasonCollection(season);
        f.setRecommendedGarment(garment);
        f.setWarehouseBinLocation(bin);
        f.setIsRemnant(false);
        f.setImageUrl(imageUrl);
        FabricProduct saved = fabricRepository.save(f);

        // Matching INWARD ledger entry so the Stock Movement Ledger is realistic
        StockMovement inward = new StockMovement();
        inward.setFabricId(saved.getId());
        inward.setItemCode(saved.getQualityCode());
        inward.setFabricName(saved.getFabricName());
        inward.setMovementType("INWARD");
        inward.setMeters(stockMeters);
        inward.setBalanceAfter(stockMeters);
        inward.setReferenceNumber("OPENING-STOCK");
        inward.setNotes("Opening stock from loom stockyard");
        stockMovementRepository.save(inward);
    }

    // ------------------------------------------------------------------
    // Yarn inventory — raw material feeding the looms
    // ------------------------------------------------------------------
    private void seedYarnInventory() {
        if (yarnRepository.count() > 0) return;

        addYarn("YARN-LOT-8821", "Cotton 40/1 Ne Combed", "Pure Cotton",
                "Lakshmi Mills, Coimbatore", 1250.0, 25, 48.0,
                new BigDecimal("310.00"), "Yarn Bay 01 - Shelf A", "RAW_GREIGE");
        addYarn("YARN-LOT-8822", "Cotton 60/1 Ne Combed", "Pure Cotton",
                "Lakshmi Mills, Coimbatore", 900.0, 18, 48.0,
                new BigDecimal("365.00"), "Yarn Bay 01 - Shelf B", "RAW_GREIGE");
        addYarn("YARN-LOT-8823", "Cotton 80/1 Ne Super Combed", "Pure Cotton",
                "Sri Shanmugha Spinning, Erode", 480.0, 10, 48.0,
                new BigDecimal("420.00"), "Yarn Bay 02 - Shelf A", "DYED_READY");
        addYarn("YARN-LOT-8830", "Polyester 75D/36F Filament", "Polyester",
                "Kongu Synthetics, Salem", 1600.0, 32, 60.0,
                new BigDecimal("145.00"), "Yarn Bay 03 - Shelf A", "RAW_GREIGE");
        addYarn("YARN-LOT-8831", "Viscose 30s Spun", "Viscose",
                "Kaveri Viscose, Karur", 720.0, 15, 50.0,
                new BigDecimal("225.00"), "Yarn Bay 03 - Shelf B", "RAW_GREIGE");
        addYarn("YARN-LOT-8840", "Mulberry Silk 20/22D", "Mulberry Silk",
                "Salem Silk Traders, Salem", 85.0, 2, 40.0,
                new BigDecimal("3850.00"), "Yarn Bay 04 - Locked Cage", "DYED_READY");

        System.out.println("Factory Yarn Inventory Initialized: " + yarnRepository.count() + " lots");
    }

    private void addYarn(String lot, String spec, String fiber, String origin, double weightKg,
                         int bags, double conesPerBag, BigDecimal pricePerKg, String rack, String status) {
        YarnInventory y = new YarnInventory();
        y.setYarnLotNumber(lot);
        y.setYarnCountSpecification(spec);
        y.setFiberType(fiber);
        y.setYarnOriginMill(origin);
        y.setTotalWeightKg(weightKg);
        y.setTotalBagsOrBoxes(bags);
        y.setConesPerBag(conesPerBag);
        y.setPurchasePricePerKg(pricePerKg);
        y.setWarehouseRackBay(rack);
        y.setYarnStatus(status);
        yarnRepository.save(y);
    }

    // ------------------------------------------------------------------
    // Suppliers — yarn mills & traders (Tamil Nadu textile belt)
    // ------------------------------------------------------------------
    private void seedSuppliers() {
        if (supplierRepository.count() > 0) return;

        addSupplier("Lakshmi Mills Pvt Ltd", "R. Palanisamy", "98430 12345",
                "sales@lakshmimills.in", "Coimbatore", "India",
                "Combed Cotton Yarn 20s - 100s", "33AACL1234F1Z5");
        addSupplier("Sri Shanmugha Spinning Mills", "K. Subramani", "94432 56789",
                "info@srishanmugha.com", "Erode", "India",
                "Super Combed & Compact Cotton Yarn", "33AASCS5678K1Z2");
        addSupplier("Kongu Synthetics", "V. Arunachalam", "96770 34567",
                "orders@kongusynthetics.in", "Salem", "India",
                "Polyester Filament & Texturised Yarn", "33AAKCK9012P1Z8");
        addSupplier("Kaveri Viscose Traders", "M. Selvaraj", "90031 78901",
                "kaveriviscose@gmail.com", "Karur", "India",
                "Viscose & Modal Spun Yarn", "33AAKCV3456Q1Z1");
        addSupplier("Salem Silk Traders", "D. Natarajan", "98650 23456",
                "salemsilk@outlook.com", "Salem", "India",
                "Mulberry Silk 20/22D & 22/25D", "33AASSS7890R1Z4");
        addSupplier("Bharat Dyes & Chemicals", "S. Venkatesh", "99420 45678",
                "bharatdyes@yahoo.in", "Erode", "India",
                "Reactive & Vat Dyes, Lab Chemicals", "33AABCB2345T1Z9");

        System.out.println("Factory Suppliers Initialized: " + supplierRepository.count() + " vendors");
    }

    private void addSupplier(String millName, String contact, String phone, String email,
                             String city, String country, String speciality, String gstin) {
        Supplier s = new Supplier();
        s.setMillName(millName);
        s.setContactPerson(contact);
        s.setPhone(phone);
        s.setEmail(email);
        s.setCity(city);
        s.setCountry(country);
        s.setFabricSpeciality(speciality);
        s.setGstin(gstin);
        supplierRepository.save(s);
    }
}
