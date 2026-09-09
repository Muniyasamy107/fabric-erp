# 🔬 ஒவ்வொரு Page-உம் உள்ளே என்ன இருக்கு? (Internal Elements)

Sidebar order-படி, ஒவ்வொரு page-க்குள் இருக்கும் buttons / tabs / tables / live widgets விளக்கம்.

---

### 1. Mill Dashboard
- **LIVE SCADA pill** — பச்சை pulse = data நேரலை
- **4 KPI cards** — Revenue ₹ / Meters sold / OEE % / Water recycle %
- **4 charts** — OEE weekly bars · Steam donut · Monthly output bars · **Warehouse Re-order Alerts** (low stock red list)

### 2. Fabric Catalog
- **Search + filter bar** — பெயர்/code தேடல்
- **Cards / Table toggle** — பார்வை மாற்று buttons
- **+ Add Product** → modal form (SKU, name, GSM, price, stock, alert...)
- ஒவ்வொரு card-லும்: photo, stock, price, **LOW STOCK ribbon**, **Tag** button → barcode sticker print

### 3. Swatch Gallery
- பெரிய photo showcase cards — client presentation-க்கு

### 4. Remnant Clearance
- Remnant roll cards (original m, remnant m, discount %)
- **Set Discount** button → % மாற்று · **View in Catalog**

### 5. CAD Weave Studio
- Design concept cards
- **New Sample Design** modal (name, buyer, EPI/PPI, shafts)
- **Tech Sheet print** button

### 6. Production Planning
- Plans table + **Stage dropdown** (Yarn→...→Done) live update
- **New Plan** modal · **Route Card print**

### 7. Yarn & Dye House
- **Yarn Cone Store** table + **Inward Raw Yarn** modal
- **Dye Kitchen** recipe cards + **New Dye Recipe** modal + **Recipe print**

### 8. Warping & Sizing
- Beam bank table + **Prepare New Weaver's Beam** modal + **Beam Ticket print**

### 9. Loom 2D Floor Matrix 🎥
- 2D tile grid — 🟢 pulse running (meters counting) · 🔴 breakdown · 🟡 maintenance
- Tile click → **Telemetry modal** (RPM, efficiency, temp, meters)
- **Floor print** · 10s live refresh

### 10. Loom Control Room
- Loom cards + **Active Production Batches** table
- **Schedule Job** modal (weaver, loom, target)
- **Update Loom Batch Progress** modal (produced, scrap, grade) → **Save Production Yield**

### 11. Shift Yield & OEE
- Shift logs table + **Log Shift Yield** modal + **OEE print**

### 12. Fabric Costing & BOM
- Cost sheet cards + **New Cost Sheet** modal (warp/weft/labour/dye... → total + recommended price auto)
- **Cost Sheet print**

### 13. Boiler & Steam Power
- Boiler logs table + **Log Daily Boiler** modal + **Boiler print**

### 14. Stenter & Finishing
- Finishing batches table + **Queue Finishing Batch** modal + **Batch print**

### 15. QC & Lab Test
- Inspections list + **New Inspection** modal (ASTM 4-Point: flaws, GSM, shrinkage, fastness → verdict auto)
- **Lab Certificate print**

### 16. ETP & Water Recycling
- ETP logs table + **Log Daily ETP Audit** modal + **ZLD Certificate print**

### 17. Roll Packing & Bales
- Rolls table + **Pack & Tag Finished Roll** modal
- **Roll Sticker print** + **Bale Manifest print**

### 18. Plant Maintenance
- Tickets table + **Log Breakdown / PM Ticket** modal + **Ticket print**

### 19. Attendance Register & OT
- **3 tabs:** Bulk Attendance Entry Grid · Master Worker Directory · Daily Muster Logs
- Header gold button: **Open Biometric Punch Kiosk**
- Directory tab: **Register Factory Operator** form (badge ⚡ Auto) + workers table + Delete
- Bulk tab: date+shift+dept select → team grid → one-click save
- **Form 25 / Muster print**

### 20. Biometric Punch Kiosk
- **Live clock** (1s) + **auto shift chip** (A/B/C)
- **Badge input** + scan → **ID card view** (gold band, role chip)
- **PUNCH IN / PUNCH OUT** buttons (duplicate block, OT 2x auto)
- **Stats row:** ON DUTY NOW · PUNCHED TODAY · SHIFT CLOSED
- **Demo badge strips** (office + factory) · **live punch feed** (10s)

### 21. Security Gate Pass
- Passes table + **Issue Gate Pass** modal (vehicle, driver, e-way, weights)
- **Gate Pass print** (lorry manifest)

### 22. Global B2B Exports
- Contracts table (buyer, country, LC, Incoterms)
- **Draft Export Contract** modal + **Commercial Invoice print**

### 23. B2B Wholesale Clients
- Clients directory table + **+ Register Brand Client** modal

### 24. Wholesale Dispatch
- **Select Fabrics for Dispatch** picker (checkbox + meters)
- **Wholesale Invoicing Desk** → invoice create → **stock auto deduct** + GST + **Invoice print**

### 25. Weaver Payroll
- Wage ledger table + **Log Machine Operator Wages** modal (meters × rate = wage auto)

### 26. Day-End Settlement
- Opening float input → sales **auto total** → reconciliation
- **Z-Lock** button (shift close) + **Past Z-Reports** list + **Z print**

### 27. Stock Movement Ledger
- Movements table (INWARD / SALE / WASTAGE / ADJUSTMENT) — full traceability
- **Record Fabric Damage / Wastage** form (roll, meters, reason)

### 28. Purchase Orders
- PO list + **Issue Purchase Order** modal + **PO print**
- **Stock Inward** modal — goods வந்ததும் yarn stock **auto increase**

### 29. Yarn Suppliers
- Supplier cards + **Register Supplier** modal

### 30. Shift Staff
- **Register Plant Operator** form (username, password, role)
- **Mill Operator Directory** table + Disable/Enable + **Reset PW** (temp password)
- Non-admin-க்கு "Access Restricted" screen

### 31. Production Reports
- 5 audit registers: B2B invoices · Loom lots · QC certificates · Wage register · Yarn inventory
- **Excel export** + prints

---

**விதி:** பார்க்கும் pages-ல் (Dashboard, Matrix, Gallery, Reports) input இல்லை;
வேலை செய்யும் pages-ல் modal form → save → print என்ற flow.
