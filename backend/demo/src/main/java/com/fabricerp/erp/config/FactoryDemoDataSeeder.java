package com.fabricerp.erp.config;

import com.fabricerp.erp.entity.*;
import com.fabricerp.erp.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * FACTORY DEMO DATA SEEDER — populates EVERY ERP module with realistic
 * demo records on a fresh database (each table is only seeded when empty,
 * so existing factory data is never touched on restart).
 */
@Component
@Order(3)
public class FactoryDemoDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(FactoryDemoDataSeeder.class);

    private final WeavingLoomRepository loomRepository;
    private final ProductionJobRepository jobRepository;
    private final ProductionPlanRepository planRepository;
    private final DyeRecipeRepository dyeRecipeRepository;
    private final WarpingSizingBeamRepository beamRepository;
    private final LoomShiftProductionRepository shiftProductionRepository;
    private final MillShiftReportRepository millShiftReportRepository;
    private final FabricCostSheetRepository costSheetRepository;
    private final BoilerSteamLogRepository boilerRepository;
    private final FinishingBatchRepository finishingRepository;
    private final QualityInspectionRepository qcRepository;
    private final EtpComplianceRepository etpRepository;
    private final FabricRollPackingRepository rollRepository;
    private final MachineMaintenanceLogRepository maintenanceRepository;
    private final WorkerShiftAttendanceRepository attendanceRepository;
    private final FactoryGatePassRepository gatePassRepository;
    private final ExportContractRepository exportRepository;
    private final WholesaleClientRepository clientRepository;
    private final WholesaleInvoiceRepository invoiceRepository;
    private final WeaverWageRepository wageRepository;
    private final DailyShiftSettlementRepository settlementRepository;
    private final CadSampleDesignRepository cadRepository;
    private final PurchaseOrderRepository poRepository;
    private final FabricRepository fabricRepository;

    public FactoryDemoDataSeeder(WeavingLoomRepository loomRepository,
                                 ProductionJobRepository jobRepository,
                                 ProductionPlanRepository planRepository,
                                 DyeRecipeRepository dyeRecipeRepository,
                                 WarpingSizingBeamRepository beamRepository,
                                 LoomShiftProductionRepository shiftProductionRepository,
                                 MillShiftReportRepository millShiftReportRepository,
                                 FabricCostSheetRepository costSheetRepository,
                                 BoilerSteamLogRepository boilerRepository,
                                 FinishingBatchRepository finishingRepository,
                                 QualityInspectionRepository qcRepository,
                                 EtpComplianceRepository etpRepository,
                                 FabricRollPackingRepository rollRepository,
                                 MachineMaintenanceLogRepository maintenanceRepository,
                                 WorkerShiftAttendanceRepository attendanceRepository,
                                 FactoryGatePassRepository gatePassRepository,
                                 ExportContractRepository exportRepository,
                                 WholesaleClientRepository clientRepository,
                                 WholesaleInvoiceRepository invoiceRepository,
                                 WeaverWageRepository wageRepository,
                                 DailyShiftSettlementRepository settlementRepository,
                                 CadSampleDesignRepository cadRepository,
                                 PurchaseOrderRepository poRepository,
                                 FabricRepository fabricRepository) {
        this.loomRepository = loomRepository;
        this.jobRepository = jobRepository;
        this.planRepository = planRepository;
        this.dyeRecipeRepository = dyeRecipeRepository;
        this.beamRepository = beamRepository;
        this.shiftProductionRepository = shiftProductionRepository;
        this.millShiftReportRepository = millShiftReportRepository;
        this.costSheetRepository = costSheetRepository;
        this.boilerRepository = boilerRepository;
        this.finishingRepository = finishingRepository;
        this.qcRepository = qcRepository;
        this.etpRepository = etpRepository;
        this.rollRepository = rollRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.attendanceRepository = attendanceRepository;
        this.gatePassRepository = gatePassRepository;
        this.exportRepository = exportRepository;
        this.clientRepository = clientRepository;
        this.invoiceRepository = invoiceRepository;
        this.wageRepository = wageRepository;
        this.settlementRepository = settlementRepository;
        this.cadRepository = cadRepository;
        this.poRepository = poRepository;
        this.fabricRepository = fabricRepository;
    }

    @Override
    public void run(String... args) {
        try {
            seedRemnantIfMissing();
            seedLooms();
            seedClients();
            seedPurchaseOrders();
            seedProductionPlans();
            seedProductionJobs();
            seedDyeRecipes();
            seedWarpingBeams();
            seedShiftProduction();
            seedMillShiftReport();
            seedCostSheets();
            seedBoilerLogs();
            seedFinishingBatches();
            seedQualityInspections();
            seedEtpLogs();
            seedRollPacking();
            seedMaintenance();
            seedAttendance();
            seedGatePasses();
            seedExportContracts();
            seedInvoices();
            seedWeaverWages();
            seedSettlement();
            seedCadDesigns();
            log.info("FACTORY DEMO DATA SEEDER COMPLETE — every module populated.");
        } catch (Exception e) {
            log.error("Demo seeder issue (non-fatal): {}", e.getMessage());
        }
    }

    // ---------------- REMNANT (works even when catalog already exists) ----------------
    private void seedRemnantIfMissing() {
        if (!fabricRepository.findByIsRemnantTrue().isEmpty()) return;
        if (fabricRepository.findByQualityCode("RF-COT-002-R1").isPresent()) return;

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
        clearance.setRecommendedGarment("Sample & Job-work Lots");
        clearance.setWarehouseBinLocation("Remnant Rack R-01");
        clearance.setIsRemnant(true);
        clearance.setRemnantDiscountPct(15.0);
        clearance.setImageUrl("/fabrics/cotton-cambric.jpg");
        fabricRepository.save(clearance);
        log.info("Demo Remnant Seeded: RF-COT-002-R1 (42.5 m, 15% clearance)");
    }

    // ---------------- LOOMS ----------------
    private void seedLooms() {
        if (loomRepository.count() > 0) return;
        String[] statuses = {"RUNNING", "RUNNING", "RUNNING", "RUNNING", "STOPPED", "RUNNING",
                "MAINTENANCE_DOWN", "RUNNING", "RUNNING", "RUNNING", "STOPPED", "RUNNING"};
        for (int i = 1; i <= 12; i++) {
            WeavingLoom loom = new WeavingLoom();
            loom.setLoomNumber(String.format("LOOM-A%02d", i));
            loom.setMachineType(i % 3 == 0 ? "Air-Jet Toyota JAT810" : "Rapier Picanol OptiMax-i");
            loom.setRpmSpeed(statuses[i - 1].equals("RUNNING") ? 520 + i * 5 : 0);
            loom.setMaximumWeavingWidthInches(74.0);
            loom.setCurrentYarnSpecification(i % 2 == 0 ? "2/60s Combed Cotton" : "2/100s Giza Cotton");
            loom.setActiveOperatorName("Weaver #" + i);
            loom.setLoomStatus(statuses[i - 1]);
            loom.setMaintenanceNotes(statuses[i - 1].equals("MAINTENANCE_DOWN")
                    ? "Warp beam brake assembly replacement in progress" : "Healthy");
            loomRepository.save(loom);
        }
        log.info("Demo Looms Seeded: 12 machines");
    }

    // ---------------- CLIENTS ----------------
    private void seedClients() {
        if (clientRepository.count() > 0) return;
        addClient("Arvind Fashions Ltd", "080-44557700", "buyer@arvindfashions.in",
                "12 MG Road, Bengaluru 560001, Karnataka", "29AABCA1234F1Z5", "Apparel Retail");
        addClient("Raymond Apparel Division", "022-66601234", "sourcing@raymond.in",
                "James Mill Compound, Lower Parel, Mumbai 400013", "27AAACR5678B1Z2", "Premium Shirting");
        addClient("FabIndia Overseas Pvt Ltd", "011-41558899", "purchase@fabindia.net",
                "D-210 Okhla Phase 1, New Delhi 110020", "07AAACF9012C1Z8", "Ethnic Retail");
        log.info("Demo Wholesale Clients Seeded: 3");
    }

    private void addClient(String name, String phone, String email, String address, String gstin, String segment) {
        WholesaleClient c = new WholesaleClient();
        c.setCompanyName(name);
        c.setContactPhone(phone);
        c.setEmail(email);
        c.setBillingAddress(address);
        c.setGstin(gstin);
        c.setClientSegment(segment);
        clientRepository.save(c);
    }

    // ---------------- PURCHASE ORDERS ----------------
    private void seedPurchaseOrders() {
        if (poRepository.count() > 0) return;
        addPo("PO-2026-0001", 1L, "Lakshmi Mills Coimbatore", "Mr. Palanisamy", "9843012345",
                "Coimbatore", "DELIVERED", LocalDate.now().minusDays(12), new BigDecimal("210000"),
                "2/60s Combed Cotton — 500 kg. Moisture within 8.5%.");
        addPo("PO-2026-0002", 2L, "Sri Valli Spinning Mills", "Mr. Karthik", "9791055667",
                "Tirupur", "IN_TRANSIT", LocalDate.now().plusDays(3), new BigDecimal("186000"),
                "2/100s Giza Cotton — 400 kg. Mill certificate attached.");
        log.info("Demo Purchase Orders Seeded: 2");
    }

    private void addPo(String po, Long supplierId, String mill, String contact, String phone, String city,
                       String status, LocalDate eta, BigDecimal cost, String notes) {
        PurchaseOrder p = new PurchaseOrder();
        p.setPoNumber(po);
        p.setSupplierId(supplierId);
        p.setSupplierMillName(mill);
        p.setMillContactPerson(contact);
        p.setMillPhone(phone);
        p.setMillCity(city);
        p.setStatus(status);
        p.setExpectedDeliveryDate(eta);
        p.setTotalEstimatedCost(cost);
        p.setNotes(notes);
        poRepository.save(p);
    }

    // ---------------- PRODUCTION PLANS ----------------
    private void seedProductionPlans() {
        if (planRepository.count() > 0) return;
        addPlan("PLAN-2026-0101", "WO-2026-221", "Arvind Fashions Ltd", "Cotton Poplin 60s x 60s",
                "RF-COT-001", 5000.0, 4, "WEAVING_RUN", "Priority shirting run for festive season");
        addPlan("PLAN-2026-0102", "WO-2026-228", "Raymond Apparel Division", "Oxford Shirting 40s x 40s",
                "RF-COT-003", 3500.0, 3, "WARPING_BEAMS", "Beam preparation in progress");
        log.info("Demo Production Plans Seeded: 2");
    }

    private void addPlan(String planNo, String orderRef, String client, String fabric, String code,
                         Double meters, Integer looms, String stage, String remarks) {
        ProductionPlan p = new ProductionPlan();
        p.setPlanNumber(planNo);
        p.setOrderReferenceNumber(orderRef);
        p.setTargetClientName(client);
        p.setFabricProductName(fabric);
        p.setQualityCode(code);
        p.setTargetMeterage(meters);
        p.setRequiredWarpYarnKg(meters * 0.35);
        p.setRequiredWeftYarnKg(meters * 0.28);
        p.setRequiredSizingChemicalKg(meters * 0.04);
        p.setRequiredDyesAndAuxiliariesKg(meters * 0.02);
        p.setAllocatedLoomsCount(looms);
        p.setEstimatedLoomDays(6);
        p.setCommittedDeliveryDate(LocalDate.now().plusDays(18));
        p.setCurrentStage(stage);
        p.setPlannedByManager("K. Govindaraj");
        p.setRemarks(remarks);
        planRepository.save(p);
    }

    // ---------------- PRODUCTION JOBS ----------------
    private void seedProductionJobs() {
        if (jobRepository.count() > 0) return;
        addJob("BATCH-2026-0401", 1L, "Cotton Poplin 60s x 60s", "LOOM-A01", "Murugesan K",
                1200.0, 860.0, 6.5, "A", "IN_PROGRESS");
        addJob("BATCH-2026-0402", 3L, "Oxford Shirting 40s x 40s", "LOOM-A04", "Selvam R",
                900.0, 900.0, 4.0, "A", "COMPLETED");
        addJob("BATCH-2026-0403", 8L, "Silk Crepe 20/22D", "LOOM-A08", "Anitha P",
                600.0, 210.0, 2.0, "B", "IN_PROGRESS");
        log.info("Demo Production Jobs Seeded: 3");
    }

    private void addJob(String batch, Long fabricId, String fabric, String loom, String weaver,
                        Double target, Double produced, Double waste, String grade, String status) {
        ProductionJob j = new ProductionJob();
        j.setBatchNumber(batch);
        j.setFabricProductId(fabricId);
        j.setFabricProductName(fabric);
        j.setAssignedLoomNumber(loom);
        j.setMasterWeaverName(weaver);
        j.setTargetMeters(target);
        j.setProducedMeters(produced);
        j.setDefectWastageMeters(waste);
        j.setFabricQualityGrade(grade);
        j.setStartDate(LocalDate.now().minusDays(3));
        j.setTargetCompletionDate(LocalDate.now().plusDays(4));
        j.setJobStatus(status);
        jobRepository.save(j);
    }

    // ---------------- DYE RECIPES ----------------
    private void seedDyeRecipes() {
        if (dyeRecipeRepository.count() > 0) return;
        addRecipe("DR-2026-011", "Midnight Navy", "19-4034 TCX", "#101f3c", "REACTIVE",
                "1:10", 60, "1. Dyestuff Navy Blue 3R 2.45% o.w.f\n2. Glauber Salt 45 g/L\n3. Soda Ash 18 g/L\n4. Acetic Acid rinse 85C",
                "APPROVED", 0.8, "Selvam M");
        addRecipe("DR-2026-012", "Crimson Red", "19-1762 TCX", "#9e1b32", "REACTIVE",
                "1:12", 65, "1. Dyestuff Crimson HE-7B 2.10% o.w.f\n2. Salt 50 g/L\n3. Fixing agent 2 g/L",
                "LAB_DIP_REVIEW", 0.6, "Priya D");
        addRecipe("DR-2026-013", "Forest Green", "19-5511 TCX", "#1d4a32", "VAT",
                "1:8", 70, "1. Vat Green 1 1.85% o.w.f\n2. Hydrosulphite 6 g/L\n3. Caustic soda 4 g/L",
                "APPROVED", 0.9, "Selvam M");
        log.info("Demo Dye Recipes Seeded: 3");
    }

    private void addRecipe(String code, String shade, String pantone, String hex, String dyeClass,
                           String liquor, Integer temp, String formula, String status, Double deltaE, String dyer) {
        DyeRecipe r = new DyeRecipe();
        r.setRecipeCode(code);
        r.setShadeName(shade);
        r.setPantoneTcxCode(pantone);
        r.setColorHex(hex);
        r.setDyeClass(dyeClass);
        r.setLiquorRatio(liquor);
        r.setDyeingTemperatureCelsius(temp);
        r.setChemicalFormulationRecipe(formula);
        r.setLabDipStatus(status);
        r.setDeltaETolerance(deltaE);
        r.setMasterDyerName(dyer);
        dyeRecipeRepository.save(r);
    }

    // ---------------- WARPING BEAMS ----------------
    private void seedWarpingBeams() {
        if (beamRepository.count() > 0) return;
        addBeam("BEAM-2026-071", "RF-COT-001", "Cotton Poplin 60s x 60s", "YL-2-60S-COMBED",
                "2/60s Combed Cotton", 4800, 12000.0, 72.0, "PVA 12kg + Acrylate 4kg",
                9.5, 7.2, 110, "LOOM-A01", "READY_FOR_WEAVING", "Kumar S");
        addBeam("BEAM-2026-072", "RF-COT-003", "Oxford Shirting 40s x 40s", "YL-2-40S-COMBED",
                "2/40s Combed Cotton", 4200, 10000.0, 70.0, "PVA 10kg + Starch 6kg",
                10.1, 7.8, 115, "LOOM-A04", "WARPING_IN_PROGRESS", "Kumar S");
        log.info("Demo Warping Beams Seeded: 2");
    }

    private void addBeam(String beamNo, String code, String fabric, String yarnLot, String yarnSpec,
                         Integer ends, Double length, Double flange, String sizing, Double pickUp,
                         Double moisture, Integer dryTemp, String loom, String status, String supervisor) {
        WarpingSizingBeam b = new WarpingSizingBeam();
        b.setBeamNumber(beamNo);
        b.setQualityCode(code);
        b.setFabricProductName(fabric);
        b.setYarnLotNumber(yarnLot);
        b.setYarnCountSpecification(yarnSpec);
        b.setTotalWarpEnds(ends);
        b.setBeamLengthMeters(length);
        b.setFlangeWidthInches(flange);
        b.setSizingChemicalMix(sizing);
        b.setSizePickUpPercentage(pickUp);
        b.setMoisturePercentage(moisture);
        b.setDryingCylinderTempCelsius(dryTemp);
        b.setAssignedLoomNumber(loom);
        b.setBeamStatus(status);
        b.setSupervisorName(supervisor);
        b.setBeamWarpingDate(LocalDate.now().minusDays(2));
        beamRepository.save(b);
    }

    // ---------------- SHIFT YIELD / OEE ----------------
    private void seedShiftProduction() {
        if (shiftProductionRepository.count() > 0) return;
        addShiftLog("SHIFT-LOG-2026-0301", LocalDate.now().minusDays(1), "SHIFT_A_MORNING", "Kannan V",
                10, 6200000L, 11800.0, 95.0, 12.0, 8.0, 0.0, 310.0,
                96.5, 92.4, 99.1, 88.4, "Smooth shift. Minor warp break on LOOM-A05 resolved in 6 min.", "CLOSED");
        addShiftLog("SHIFT-LOG-2026-0302", LocalDate.now(), "SHIFT_A_MORNING", "Kannan V",
                10, 2400000L, 4600.0, 38.0, 6.0, 4.0, 0.0, 120.0,
                97.2, 93.0, 99.3, 89.5, "Shift in progress — live counters.", "RUNNING");
        log.info("Demo Shift Yield/OEE Logs Seeded: 2");
    }

    private void addShiftLog(String logNo, LocalDate date, String shift, String supervisor, Integer looms,
                             Long picks, Double meters, Double waste, Double warpMin, Double weftMin,
                             Double elecMin, Double kwh, Double avail, Double perf, Double qual, Double oee,
                             String notes, String status) {
        LoomShiftProduction s = new LoomShiftProduction();
        s.setShiftLogNumber(logNo);
        s.setShiftDate(date);
        s.setShiftName(shift);
        s.setShiftSupervisorName(supervisor);
        s.setTotalActiveLooms(looms);
        s.setTotalPicksWoven(picks);
        s.setTotalMetersWoven(meters);
        s.setTotalWasteScrapMeters(waste);
        s.setWarpStoppageMinutes(warpMin);
        s.setWeftStoppageMinutes(weftMin);
        s.setElectricalDowntimeMinutes(elecMin);
        s.setPowerUnitsKwh(kwh);
        s.setAvailabilityRatePct(avail);
        s.setPerformanceRatePct(perf);
        s.setQualityRatePct(qual);
        s.setOverallOeePercentage(oee);
        s.setShiftHandoverNotes(notes);
        s.setShiftStatus(status);
        shiftProductionRepository.save(s);
    }

    private void seedMillShiftReport() {
        if (millShiftReportRepository.count() > 0) return;
        MillShiftReport r = new MillShiftReport();
        r.setShiftDate(LocalDate.now().minusDays(1));
        r.setShiftSupervisorName("Kannan V");
        r.setTotalMetersWoven(new BigDecimal("11800.00"));
        r.setTotalDefectMeters(new BigDecimal("95.00"));
        r.setActiveLoomsCount(10);
        r.setStatus("CLOSED");
        r.setClosingNotes("Target achieved. One breakdown on LOOM-A07 pending fitter parts.");
        r.setOpenedAt(LocalDateTime.now().minusDays(1).withHour(6));
        r.setClosedAt(LocalDateTime.now().minusDays(1).withHour(14));
        millShiftReportRepository.save(r);
        log.info("Demo Mill Shift Report Seeded: 1");
    }

    // ---------------- COST SHEETS ----------------
    private void seedCostSheets() {
        if (costSheetRepository.count() > 0) return;
        addCostSheet("COST-2026-051", "RF-COT-001", "Cotton Poplin 60s x 60s", "Plain 1/1",
                120, "2/100s", 68, "2/60s",
                new BigDecimal("48.00"), new BigDecimal("32.00"), new BigDecimal("6.00"),
                new BigDecimal("25.00"), new BigDecimal("30.00"), new BigDecimal("18.00"),
                22.0, new BigDecimal("194.00"));
        addCostSheet("COST-2026-052", "RF-SLK-001", "Silk Crepe 20/22D", "Crepe Twill",
                110, "20/22D Mulberry", 96, "20/22D Mulberry",
                new BigDecimal("145.00"), new BigDecimal("132.00"), new BigDecimal("9.00"),
                new BigDecimal("48.00"), new BigDecimal("55.00"), new BigDecimal("26.00"),
                28.0, new BigDecimal("529.00"));
        log.info("Demo Cost Sheets Seeded: 2");
    }

    private void addCostSheet(String no, String code, String fabric, String weave,
                              Integer ppi, String weftCount, Integer ppi2, String warpCount,
                              BigDecimal warpCost, BigDecimal weftCost, BigDecimal sizingCost,
                              BigDecimal labourCost, BigDecimal dyeCost, BigDecimal overhead,
                              Double margin, BigDecimal recommended) {
        FabricCostSheet c = new FabricCostSheet();
        c.setCostingSheetNumber(no);
        c.setQualityCode(code);
        c.setFabricName(fabric);
        c.setWeaveType(weave);
        c.setReedWidthInches(46.0);
        c.setFinishedWidthInches(44.0);
        c.setTotalWarpEnds(4800);
        c.setWarpCountNe(warpCount);
        c.setWarpCrimpPercentage(8.5);
        c.setPicksPerInch(ppi);
        c.setWeftCountNe(weftCount);
        c.setWeftCrimpPercentage(6.2);
        c.setCalculatedWarpWeightGrams(72.0);
        c.setCalculatedWeftWeightGrams(58.0);
        c.setCalculatedTotalGsm(130.0);
        c.setWarpYarnCostPerMeter(warpCost);
        c.setWeftYarnCostPerMeter(weftCost);
        c.setSizingChemicalCostPerMeter(sizingCost);
        c.setWeavingLoomCostPerMeter(labourCost);
        c.setDyeingAndFinishingCostPerMeter(dyeCost);
        c.setMillOverheadsPerMeter(overhead);
        c.setNetProductionCostPerMeter(warpCost.add(weftCost).add(sizingCost).add(labourCost).add(dyeCost).add(overhead));
        c.setTargetProfitMarginPct(margin);
        c.setRecommendedExMillPrice(recommended);
        c.setPreparedByMerchandiser("K. Govindaraj");
        c.setCostingDate(LocalDate.now().minusDays(5));
        c.setRemarks("Standard mill costing, power at ₹9.2/kWh");
        costSheetRepository.save(c);
    }

    // ---------------- BOILER ----------------
    private void seedBoilerLogs() {
        if (boilerRepository.count() > 0) return;
        addBoilerLog("STEAM-LOG-2026-091", LocalDate.now().minusDays(1), "6AM-2PM", "BLR-01",
                42.0, 8.5, 175.0, "Rice Husk", 12.4, 3.4, 18.0, 14.0, 10.0,
                180.0, 10.8, 2400.0, "Ramesh B", "SAFE", "Routine soot blowing completed.");
        addBoilerLog("STEAM-LOG-2026-092", LocalDate.now(), "6AM-2PM", "BLR-01",
                40.5, 8.3, 172.0, "Rice Husk", 12.0, 3.37, 17.5, 13.5, 9.5,
                175.0, 10.9, 2350.0, "Ramesh B", "SAFE", "Feed water hardness normal.");
        log.info("Demo Boiler Logs Seeded: 2");
    }

    private void addBoilerLog(String no, LocalDate date, String shift, String unit,
                              Double steam, Double pressure, Double temp, String fuel, Double fuelTons,
                              Double ratio, Double dye, Double stenter, Double sizing,
                              Double hardness, Double ph, Double tds, String engineer, String safety, String remarks) {
        BoilerSteamLog b = new BoilerSteamLog();
        b.setSteamLogNumber(no);
        b.setLogDate(date);
        b.setShiftTiming(shift);
        b.setBoilerUnitCode(unit);
        b.setTotalSteamGeneratedTons(steam);
        b.setAverageSteamPressureBar(pressure);
        b.setAverageSteamTempCelsius(temp);
        b.setFuelTypeUsed(fuel);
        b.setFuelConsumedTons(fuelTons);
        b.setEvaporationRatio(ratio);
        b.setDyeHouseSteamTons(dye);
        b.setStenterFinishingSteamTons(stenter);
        b.setSizingYarnSteamTons(sizing);
        b.setFeedWaterHardnessPpm(hardness);
        b.setBoilerWaterPh(ph);
        b.setBlowdownTdsPpm(tds);
        b.setBoilerAttendantEngineer(engineer);
        b.setSafetyStatus(safety);
        b.setLogRemarks(remarks);
        boilerRepository.save(b);
    }

    // ---------------- FINISHING ----------------
    private void seedFinishingBatches() {
        if (finishingRepository.count() > 0) return;
        addFinish("FIN-2026-021", 2L, "WV-LOT-0402", "Oxford Shirting 40s x 40s", "Stenter-1",
                "Soft Finish + Sanforize", 890.0, 882.0, 185, 35.0, 44.0,
                "Silicone softener 20 g/L + Anti-crease 8 g/L", "COMPLETED", "Dinesh K",
                "Uniform hand-feel, shrinkage within 1.5%.");
        addFinish("FIN-2026-022", 1L, "WV-LOT-0401", "Cotton Poplin 60s x 60s", "Stenter-2",
                "Mercerize + Calender", 850.0, 845.0, 180, 32.0, 44.5,
                "Wetting agent 5 g/L + Optical brightener 3 g/L", "IN_PROGRESS", "Dinesh K",
                "Calender pass 2 of 2 running.");
        log.info("Demo Finishing Batches Seeded: 2");
    }

    private void addFinish(String no, Long jobId, String lot, String fabric, String line, String treatment,
                           Double inM, Double outM, Integer temp, Double speed, Double width,
                           String chem, String status, String master, String notes) {
        FinishingBatch f = new FinishingBatch();
        f.setFinishBatchNumber(no);
        f.setProductionJobId(jobId);
        f.setRawBatchLotNumber(lot);
        f.setFabricProductName(fabric);
        f.setMachineLine(line);
        f.setFinishTreatmentType(treatment);
        f.setInputGreigeMeters(inM);
        f.setOutputFinishedMeters(outM);
        f.setStenterTemperatureCelsius(temp);
        f.setMachineSpeedMpm(speed);
        f.setTargetWidthInches(width);
        f.setChemicalRecipeApplied(chem);
        f.setFinishStatus(status);
        f.setOperatorMasterName(master);
        f.setProcessingDate(LocalDate.now().minusDays(1));
        f.setProcessNotes(notes);
        finishingRepository.save(f);
    }

    // ---------------- QC ----------------
    private void seedQualityInspections() {
        if (qcRepository.count() > 0) return;
        addQc("QC-CERT-2026-061", 2L, "WV-LOT-0402", "Oxford Shirting 40s x 40s", "Basket Weave",
                44.0, 882.0, 4, 0, 8.2, 140, 1.4, "4-5", 420.0, "EXPORT_APPROVED",
                "Lakshmi N", "4-point system pass. Fabric cleared for packing.");
        addQc("QC-CERT-2026-062", 3L, "WV-LOT-0403", "Silk Crepe 20/22D", "Crepe Twill",
                45.0, 210.0, 6, 1, 14.6, 92, 0.9, "4", 210.0, "REWORK_MINOR",
                "Lakshmi N", "One oil stain zone — spot clean and re-inspect 20m section.");
        log.info("Demo QC Inspections Seeded: 2");
    }

    private void addQc(String cert, Long jobId, String lot, String fabric, String weave, Double width,
                       Double meters, Integer minor, Integer major, Double fourPt, Integer gsm,
                       Double shrink, String fastness, Double tensile, String verdict, String inspector, String remarks) {
        QualityInspectionReport q = new QualityInspectionReport();
        q.setCertificateNumber(cert);
        q.setProductionJobId(jobId);
        q.setBatchLotNumber(lot);
        q.setFabricProductName(fabric);
        q.setWeaveType(weave);
        q.setStandardWidthInches(width);
        q.setTotalInspectedMeters(meters);
        q.setMinorDefectsCount(minor);
        q.setMajorDefectsCount(major);
        q.setFourPointScore(fourPt);
        q.setTestedGsm(gsm);
        q.setShrinkagePercentage(shrink);
        q.setColorFastnessRating(fastness);
        q.setTensileStrengthNewton(tensile);
        q.setFinalVerdict(verdict);
        q.setQcInspectorName(inspector);
        q.setInspectionDate(LocalDate.now().minusDays(1));
        q.setRemarks(remarks);
        qcRepository.save(q);
    }

    // ---------------- ETP ----------------
    private void seedEtpLogs() {
        if (etpRepository.count() > 0) return;
        addEtp("ETP-CERT-2026-071", LocalDate.now().minusDays(1), "6AM-6PM", 85.0, 78.2, 92.0,
                7.2, 1450.0, 210.0, 42.0, 11.0, 28.0, 320.0, 460.0, "COMPLIANT_ZLD",
                "Venkatesh R", "All parameters within PCB limits.");
        addEtp("ETP-CERT-2026-072", LocalDate.now(), "6AM-6PM", 82.0, 75.5, 92.1,
                7.4, 1380.0, 205.0, 39.0, 10.2, 26.0, 305.0, 445.0, "COMPLIANT_ZLD",
                "Venkatesh R", "RO membranes cleaned last night, TDS improved.");
        log.info("Demo ETP Logs Seeded: 2");
    }

    private void addEtp(String cert, LocalDate date, String shift, Double inflow, Double recycled,
                        Double recovery, Double ph, Double inletTds, Double roTds, Double cod,
                        Double bod, Double tss, Double sludge, Double kwh, String status, String chemist, String obs) {
        EtpComplianceLog e = new EtpComplianceLog();
        e.setLogCertificateNumber(cert);
        e.setAuditDate(date);
        e.setShiftTiming(shift);
        e.setRawEffluentInflowKld(inflow);
        e.setRecycledPermeateWaterKld(recycled);
        e.setWaterRecoveryPercentage(recovery);
        e.setTestedPhValue(ph);
        e.setInletTdsPpm(inletTds);
        e.setTreatedRoTdsPpm(roTds);
        e.setChemicalOxygenDemandCod(cod);
        e.setBiochemicalOxygenDemandBod(bod);
        e.setTotalSuspendedSolidsTss(tss);
        e.setDrySludgeGeneratedKg(sludge);
        e.setEtpPowerConsumedKwh(kwh);
        e.setZldComplianceStatus(status);
        e.setEnvironmentalChemistName(chemist);
        e.setObservations(obs);
        etpRepository.save(e);
    }

    // ---------------- ROLL PACKING ----------------
    private void seedRollPacking() {
        if (rollRepository.count() > 0) return;
        addRoll("ROLL-88231001", 2L, "WV-LOT-0402", "RF-COT-003", "Oxford Shirting 40s x 40s",
                "Basket Weave", 44.0, 98.5, 31.2, 29.8, "A", "FG-BAY-1", "PACKED", "BALE-009", "Suresh M");
        addRoll("ROLL-88231002", 2L, "WV-LOT-0402", "RF-COT-003", "Oxford Shirting 40s x 40s",
                "Basket Weave", 44.0, 101.0, 32.0, 30.6, "A", "FG-BAY-1", "PACKED", "BALE-009", "Suresh M");
        addRoll("ROLL-88231003", 1L, "WV-LOT-0401", "RF-COT-001", "Cotton Poplin 60s x 60s",
                "Plain 1/1", 44.5, 96.0, 28.4, 27.1, "A", "FG-BAY-2", "PACKING_IN_PROGRESS", "BALE-010", "Suresh M");
        log.info("Demo Roll Packing Seeded: 3 rolls");
    }

    private void addRoll(String barcode, Long jobId, String lot, String code, String fabric, String weave,
                         Double width, Double length, Double gross, Double net, String grade, String bin,
                         String status, String bale, String operator) {
        FabricRollPacking r = new FabricRollPacking();
        r.setRollBarcodeNumber(barcode);
        r.setProductionJobId(jobId);
        r.setBatchLotNumber(lot);
        r.setQualityCode(code);
        r.setFabricProductName(fabric);
        r.setWeaveType(weave);
        r.setFabricWidthInches(width);
        r.setNetLengthMeters(length);
        r.setGrossWeightKg(gross);
        r.setNetWeightKg(net);
        r.setQualityGrade(grade);
        r.setWarehouseBin(bin);
        r.setPackingStatus(status);
        r.setBalePackageNumber(bale);
        r.setPackedByOperatorName(operator);
        r.setPackingDate(LocalDate.now().minusDays(1));
        rollRepository.save(r);
    }

    // ---------------- MAINTENANCE ----------------
    private void seedMaintenance() {
        if (maintenanceRepository.count() > 0) return;
        addMaint("MNT-2026-031", "LOOM-A07", "Rapier Picanol OptiMax-i", "BREAKDOWN", "CRITICAL",
                "Warp beam brake assembly slipping under tension", "Ramesh Fitter",
                "Brake pad x2 + tension spring", 4.5, new BigDecimal("3200"), "IN_PROGRESS",
                "Parts received, refitting underway.", LocalDateTime.now().minusHours(5), null);
        addMaint("MNT-2026-030", "STENTER-1", "Stenter Bruckner 8-Chamber", "PREVENTIVE", "MINOR",
                "Scheduled chain lubrication and nozzle cleaning", "Vijay Tech",
                "Chain lube 2L", 1.0, new BigDecimal("450"), "RESOLVED",
                "Completed ahead of shift B.", LocalDateTime.now().minusDays(2), LocalDateTime.now().minusDays(2).plusHours(2));
        log.info("Demo Maintenance Tickets Seeded: 2");
    }

    private void addMaint(String ticket, String machine, String type, String mType, String priority,
                          String issue, String tech, String parts, Double downtime, BigDecimal cost,
                          String status, String notes, LocalDateTime reported, LocalDateTime resolved) {
        MachineMaintenanceLog m = new MachineMaintenanceLog();
        m.setTicketNumber(ticket);
        m.setMachineCode(machine);
        m.setMachineType(type);
        m.setMaintenanceType(mType);
        m.setPriority(priority);
        m.setIssueDescription(issue);
        m.setTechnicianName(tech);
        m.setPartsReplacedSummary(parts);
        m.setDowntimeHours(downtime);
        m.setTotalSpareAndLabourCost(cost);
        m.setStatus(status);
        m.setResolutionNotes(notes);
        m.setReportedAt(reported);
        m.setResolvedAt(resolved);
        maintenanceRepository.save(m);
    }

    // ---------------- ATTENDANCE ----------------
    private void seedAttendance() {
        if (attendanceRepository.count() > 0) return;
        addPunch("EMP-WEAVER-042", "Murugesan K", "LOOM_HALL_WEAVING", "SHIFT_A_MORNING",
                "LOOM-A01 to A03", "05:52 AM", "02:08 PM", "PRESENT", 0.0, 650.0);
        addPunch("EMP-WEAVER-057", "Selvam R", "LOOM_HALL_WEAVING", "SHIFT_A_MORNING",
                "LOOM-A04 to A06", "05:58 AM", "02:05 PM", "PRESENT", 1.5, 650.0);
        addPunch("EMP-DYER-014", "Priya D", "DYE_HOUSE", "SHIFT_A_MORNING",
                "DYE-JET-2", "05:45 AM", "02:15 PM", "PRESENT", 0.0, 720.0);
        addPunch("EMP-FIN-021", "Dinesh K", "FINISHING_STENTER", "SHIFT_B_EVENING",
                "STENTER-1", "01:55 PM", "10:10 PM", "PRESENT", 0.0, 680.0);
        addPunch("EMP-QC-008", "Lakshmi N", "QUALITY_INSPECT", "SHIFT_B_EVENING",
                "QC-BENCH-1", "02:02 PM", "10:05 PM", "LATE_ENTRY", 0.0, 600.0);
        addPunch("EMP-FIT-003", "Ramesh Fitter", "MAINTENANCE_FITTER", "SHIFT_A_MORNING",
                "WORKSHOP-BAY", "06:10 AM", "04:40 PM", "OVERTIME_DOUBLE_SHIFT", 4.0, 750.0);
        log.info("Demo Attendance Seeded: 6 punches");
    }

    private void addPunch(String badge, String name, String dept, String shift, String machine,
                          String inTime, String outTime, String status, Double ot, Double wage) {
        WorkerShiftAttendance a = new WorkerShiftAttendance();
        a.setWorkerBadgeNumber(badge);
        a.setWorkerFullName(name);
        a.setPlantDepartment(dept);
        a.setDesignatedShift(shift);
        a.setAttendanceDate(LocalDate.now());
        a.setPunchInTime(inTime);
        a.setPunchOutTime(outTime);
        a.setAttendanceStatus(status);
        a.setStandardShiftHours(8.0);
        a.setOvertimeHours(ot);
        a.setRegularDailyWage(BigDecimal.valueOf(wage));
        a.setOvertimeWagesEarned(BigDecimal.valueOf(wage / 8.0 * 2 * ot));
        a.setTotalGrossEarned(BigDecimal.valueOf(wage + wage / 8.0 * 2 * ot));
        a.setAssignedMachineCode(machine);
        a.setSupervisorNotes("Demo seeded entry");
        attendanceRepository.save(a);
    }

    // ---------------- GATE PASSES ----------------
    private void seedGatePasses() {
        if (gatePassRepository.count() > 0) return;
        addGate("GP-2026-0201", "DISPATCH", "TN 39 AB 1234", "VRL Logistics", "Kumar S", "9843099887",
                "Arvind Fashions Ltd, Bengaluru", "INV-2026-1101", "341008821455",
                42, 4100.0, 4200.0, 3800.0, 400.0, "Senthil Security", "GATE_OUT_COMPLETED",
                "Seals verified, tarpaulin intact.");
        addGate("GP-2026-0202", "RETURNABLE", "TN 39 CD 5678", "Safexpress", "Manoj T", "9787011223",
                "Raymond Mumbai — empty cores return", "PO-2026-0002", "341008821990",
                6, 0.0, 900.0, 860.0, 40.0, "Senthil Security", "PENDING_APPROVAL",
                "Awaiting dispatch manager signature.");
        log.info("Demo Gate Passes Seeded: 2");
    }

    private void addGate(String no, String type, String vehicle, String transporter, String driver,
                         String phone, String party, String ref, String eway, Integer packages,
                         Double meters, Double gross, Double tare, Double net, String officer,
                         String status, String remarks) {
        FactoryGatePass g = new FactoryGatePass();
        g.setGatePassNumber(no);
        g.setPassType(type);
        g.setVehicleNumber(vehicle);
        g.setTransporterName(transporter);
        g.setDriverName(driver);
        g.setDriverPhone(phone);
        g.setDestinationOrSourceParty(party);
        g.setReferenceInvoiceOrPoNumber(ref);
        g.seteWayBillNumber(eway);
        g.setTotalPackagesCount(packages);
        g.setTotalMeterageQuantity(meters);
        g.setGrossWeightKg(gross);
        g.setTareWeightKg(tare);
        g.setNetMaterialWeightKg(net);
        g.setSecurityOfficerName(officer);
        g.setGateStatus(status);
        g.setSecurityRemarks(remarks);
        g.setIssuedAt(LocalDateTime.now().minusHours(6));
        gatePassRepository.save(g);
    }

    // ---------------- EXPORT CONTRACTS ----------------
    private void seedExportContracts() {
        if (exportRepository.count() > 0) return;
        addExport("EXP-2026-011", "Hugo Boss AG", "Germany", "sourcing@hugoboss.de",
                "Cotton Poplin 60s x 60s", 25000.0, "EUR", new BigDecimal("3.10"),
                new BigDecimal("77500"), new BigDecimal("6975000"), "FOB Chennai",
                "Chennai", "Hamburg", "40ft HQ", "LC-DE-88214", "Deutsche Bank",
                "IN_PRODUCTION", LocalDate.now().plusDays(21));
        addExport("EXP-2026-012", "Marks & Spencer", "United Kingdom", "textiles@marksandspencer.com",
                "Oxford Shirting 40s x 40s", 18000.0, "USD", new BigDecimal("3.65"),
                new BigDecimal("65700"), new BigDecimal("5453100"), "CIF Southampton",
                "Chennai", "Southampton", "20ft GP", "LC-UK-55102", "HSBC London",
                "AWAITING_LC", LocalDate.now().plusDays(35));
        log.info("Demo Export Contracts Seeded: 2");
    }

    private void addExport(String no, String buyer, String country, String email, String fabric,
                           Double meters, String currency, BigDecimal rate, BigDecimal total,
                           BigDecimal inr, String incoterms, String pol, String pod, String mode,
                           String lc, String bank, String status, LocalDate shipDate) {
        ExportContract e = new ExportContract();
        e.setExportContractNumber(no);
        e.setBuyerCompanyName(buyer);
        e.setBuyerCountry(country);
        e.setBuyerContactEmail(email);
        e.setFabricProductName(fabric);
        e.setContractedMeters(meters);
        e.setTradeCurrency(currency);
        e.setPricePerMeterForeignCurrency(rate);
        e.setTotalContractValueForeign(total);
        e.setTotalInrRealizationValue(inr);
        e.setIncoterms(incoterms);
        e.setPortOfLoading(pol);
        e.setPortOfDischarge(pod);
        e.setShippingContainerMode(mode);
        e.setLcNumber(lc);
        e.setLcIssuingBank(bank);
        e.setLcExpiryDate(shipDate.plusDays(15));
        e.setContractStatus(status);
        e.setExpectedShipmentDate(shipDate);
        e.setBankSwiftCode("KAKTINBB001");
        e.setCustomDeclarationRemarks("Demo seeded contract");
        exportRepository.save(e);
    }

    // ---------------- WHOLESALE INVOICES ----------------
    private void seedInvoices() {
        if (invoiceRepository.count() > 0) return;
        addInvoice("INV-2026-1101", "Arvind Fashions Ltd", "080-44557700", "VRL-2026-9912",
                new BigDecimal("430500"), new BigDecimal("21525"), new BigDecimal("452025"),
                "30 Days Credit", LocalDateTime.now().minusDays(2));
        addInvoice("INV-2026-1102", "FabIndia Overseas Pvt Ltd", "011-41558899", "SAF-2026-3321",
                new BigDecimal("268000"), new BigDecimal("13400"), new BigDecimal("281400"),
                "Advance Received", LocalDateTime.now().minusDays(1));
        log.info("Demo Wholesale Invoices Seeded: 2");
    }

    private void addInvoice(String no, String client, String phone, String lr, BigDecimal taxable,
                            BigDecimal gst, BigDecimal total, String terms, LocalDateTime date) {
        WholesaleInvoice i = new WholesaleInvoice();
        i.setInvoiceNumber(no);
        i.setClientCompanyName(client);
        i.setClientPhone(phone);
        i.setTransportLRNumber(lr);
        i.setTotalTaxableValue(taxable);
        i.setGstAmount(gst);
        i.setGrandTotalValue(total);
        i.setPaymentTerms(terms);
        i.setDispatchDate(date);
        invoiceRepository.save(i);
    }

    // ---------------- WEAVER WAGES ----------------
    private void seedWeaverWages() {
        if (wageRepository.count() > 0) return;
        addWage(2L, "BATCH-2026-0402", "Oxford Shirting 40s x 40s", "Selvam R", 900.0,
                new BigDecimal("4.50"), "PAID", "WV-2026-0088");
        addWage(1L, "BATCH-2026-0401", "Cotton Poplin 60s x 60s", "Murugesan K", 860.0,
                new BigDecimal("4.20"), "PENDING", null);
        log.info("Demo Weaver Wages Seeded: 2");
    }

    private void addWage(Long jobId, String batch, String fabric, String weaver, Double meters,
                         BigDecimal rate, String status, String voucher) {
        WeaverWageEntry w = new WeaverWageEntry();
        w.setProductionJobId(jobId);
        w.setBatchNumber(batch);
        w.setFabricProductName(fabric);
        w.setWeaverName(weaver);
        w.setTotalWovenMeters(meters);
        w.setRatePerMeter(rate);
        w.setTotalPayableWage(rate.multiply(BigDecimal.valueOf(meters)));
        w.setPaymentStatus(status);
        w.setDisbursementDate("PAID".equals(status) ? LocalDate.now().minusDays(1) : null);
        w.setVoucherNumber(voucher);
        wageRepository.save(w);
    }

    // ---------------- DAY-END SETTLEMENT ----------------
    private void seedSettlement() {
        if (settlementRepository.count() > 0) return;
        DailyShiftSettlement s = new DailyShiftSettlement();
        s.setZReportNumber("Z-2026-0241");
        s.setShiftDate(LocalDate.now().minusDays(1));
        s.setCashierUsername("admin");
        s.setCashierFullName("Plant General Manager");
        s.setOpeningFloat(new BigDecimal("5000"));
        s.setCashSales(new BigDecimal("84250"));
        s.setCardSales(new BigDecimal("42300"));
        s.setUpiSales(new BigDecimal("118400"));
        s.setTotalGrossSales(new BigDecimal("244950"));
        s.setTotalBillsCount(18);
        s.setTotalMetersSold(new BigDecimal("1180.00"));
        s.setActualCashCounted(new BigDecimal("89250"));
        s.setExpectedCashInDrawer(new BigDecimal("89250"));
        s.setCashDifference(BigDecimal.ZERO);
        s.setClosingNotes("Tallied. Two UPI refunds adjusted in evening batch.");
        s.setStatus("CLOSED");
        s.setClosedAt(LocalDateTime.now().minusDays(1).withHour(19).withMinute(30));
        settlementRepository.save(s);
        log.info("Demo Day-End Settlement Seeded: 1");
    }

    // ---------------- CAD DESIGNS ----------------
    private void seedCadDesigns() {
        if (cadRepository.count() > 0) return;
        addCad("CAD-2026-015", "Herringbone Twill V2", "Raymond Apparel Division", "Winter 2026",
                "Twill 2/2", 4, 120, 68, "2/60s Combed", "2/60s Combed", "2-end navy / 2-end ecru",
                50.0, 48.5, "SAMPLE_APPROVED", "Hand-feel approved, proceed to bulk.",
                "AWB-772881", "Arjun CAD");
        addCad("CAD-2026-016", "Dobby Floral Poplin", "FabIndia Overseas Pvt Ltd", "Spring 2027",
                "Dobby", 8, 132, 72, "2/80s Giza", "2/80s Giza", "Ivory base + marigold figure",
                40.0, 0.0, "IN_WEAVING", "Sample loom running, ETA 3 days.", null, "Arjun CAD");
        log.info("Demo CAD Designs Seeded: 2");
    }

    private void addCad(String code, String name, String buyer, String season, String weave,
                        Integer shafts, Integer epi, Integer ppi, String warpSpec, String weftSpec,
                        String repeat, Double reqYd, Double prodYd, String status, String feedback,
                        String awb, String designer) {
        CadSampleDesign c = new CadSampleDesign();
        c.setDesignCode(code);
        c.setDesignName(name);
        c.setTargetBuyerBrand(buyer);
        c.setSeasonCollection(season);
        c.setWeaveType(weave);
        c.setNumberOfHealdShafts(shafts);
        c.setEndsPerInchEpi(epi);
        c.setPicksPerInchPpi(ppi);
        c.setWarpYarnSpec(warpSpec);
        c.setWeftYarnSpec(weftSpec);
        c.setColorRepeatSequence(repeat);
        c.setSampleYardageRequiredMeters(reqYd);
        c.setSampleYardageProducedMeters(prodYd);
        c.setSampleDevelopmentStatus(status);
        c.setBuyerFeedbackComments(feedback);
        c.setCourierAwbTrackingNumber(awb);
        c.setCadTextileDesignerName(designer);
        c.setCreationDate(LocalDate.now().minusDays(6));
        cadRepository.save(c);
    }
}
