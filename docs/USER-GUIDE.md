# 🏭 KAK TEXTILE PROCESSING — ERP User Guide (Full Explanation)

Bro, indha guide la **ovvoru button, ovvoru form field — enna meaning, example oda** explain pannirukku.
Side la vechuko — doubt vantha inga paaru!

---

## 📌 Daily Factory Flow (IPADI DHAAN SYSTEM WORK AAGUM)

```
Yarn vanguradhu (Suppliers + PO)
   → Production Plan poduradhu (enna fabric, evlo meters)
   → Yarn/Dye House (recipe ready)
   → Warping Beam (yarn beam la wind)
   → Loom la weaving (2D Floor Matrix la live paakalam)
   → Dyeing + Finishing (Stenter)
   → QC Lab test (Grade A/B/C)
   → Roll Packing (rolls + bales)
   → Dispatch Invoice + Gate Pass (lorry la anuppura)
   → Day-End Settlement (cash close)
```

**AUTO-PILOT**: stock low aana system automatic ah manufacturing start panni
stock full aakum (bell la notification varum)!

---

## 🔐 LOGIN PAGE

| Button | Enna pannum |
|--------|-------------|
| **← Back to Website** | Public company website ku pogum (client kaata) |
| **Enter Mill** | Login — username/password correct na dashboard open |
| **Forgot password?** | Password maranthaa: Username enter → Registered Full Name enter → **one-time password (RF-xxxxxx)** kidaikkum. Adha vechu login pannu |

**Logins:** `admin/admin123` · `supervisor/super123` · `weaver/weaver123` · `dyer/dyer123`

> Staff password reset aana admin bell la 🔔 instant alert varum.
> Admin: **Shift Staff → Reset PW** button la pudhu temp password generate pannalam.

---

## 📊 MILL DASHBOARD (`/dashboard`)
Oru glance la full factory status:
- **Revenue (₹)** — indha maasam sales total
- **Meters Sold** — dispatch aana meters
- **Active Looms / Efficiency** — live loom status
- **Low Stock Count** — evlo fabrics minimum level ku kela irukku (red la therinja → replenish pannanum. AUTO-PILOT automatic ah pannum!)
- Ellam **30 seconds ku oru thadava live refresh** aagum.

---

## 🧵 FABRIC CATALOG (`/fabrics`)
Full inventory list — photos, stock, price, low stock alerts.

### Buttons
| Button | Enna pannum |
|--------|-------------|
| **Add Fabric** | Pudhu fabric product add pannura form open aagum |
| **Search box** | Fabric name/code type panni filter |
| **LOW STOCK ribbon** | Red la therinja → stock minimum ku kela. AUTO-PILOT automatic production start pannum |

### Add Fabric Form — Field Meanings
| Field | Meaning | Example |
|-------|---------|---------|
| Item Code (SKU) * | Unique product code | `RF-COT-023` |
| Fabric Name * | Product name | `Cotton Twill 2/60s` |
| Fabric Material | Cotton/Silk/Poly/Linen | `100% Cotton` |
| GSM (Weight) | 1 sq meter weight (grams) — heavier = thicker | `145` |
| Rack / Vault Shelf Location | Godown la enga vechirukku | `BAY-4 / SHELF-B` |
| GST HSN Code | GST billing code (fabric ku 5208-5212) | `5208` |
| Season Collection | Entha season ku | `Winter 2026` |
| Recommended Garment | Enna dress ku use aagum | `Shirts, Dresses` |
| Swatch Texture Image URL | Product photo path | `/fabrics/cotton-drill.jpg` |
| Price / Meter (₹) * | Oru meter wholesale price (GST illama) | `210` |
| Total Available Meters * | Ippo stock la evlo meters | `1200` |
| Low Stock Alert (m) | Itha vida stock kela pona ALERT varum | `100` |
| GST Rate | GST percentage | `5` |
| Remnant Discount (%) | Remnant piece na discount | `25` |

---

## 🖼️ SWATCH GALLERY (`/lookbook`)
Client kaata — ella fabric photos um oru beautiful gallery la.
Click panna full-screen view. Public website ku direct link.

## 💰 REMNANT CLEARANCE (`/remnant-clearance`)
Oru roll la little left aana pieces (remnants) — discount la vikka.
Auto: ovvoru sale la 60m kela vara remnant flag aagum.

## 🎨 CAD WEAVE STUDIO (`/cad-studio`)
Pudhu weave design create panna:

| Field | Meaning | Example |
|-------|---------|---------|
| Concept Design Name | Design name | `Herringbone Twill V2` |
| Target Buyer | Entha brand ku | `Raymond` |
| Weave Architecture | Weave type | `Twill 2/2` |
| Season Collection | | `Winter 2026` |
| Heald Shafts | Loom shaft count | `4` |
| Warp Density (EPI) | Per inch ku evlo warp threads | `120` |
| Weft Density (PPI) | Per inch ku evlo weft picks | `68` |
| Sample Yardage | Sample evlo meters | `50` |
| Lead CAD Designer | Design ponna aal name | `Kumar` |

---

## 📋 PRODUCTION PLANNING (`/planning`)
Order vanthaa inga plan podu. **AUTO-PILOT plans inga dhaan live ah move aagum (🤖 badge)!**

### New Plan Form
| Field | Meaning | Example |
|-------|---------|---------|
| Order/Contract Reference | Entha order ku | `WO-2026-114` |
| Target Buyer | Client name | `Arvind Fashions` |
| Fabric Quality | Entha fabric weave panna | `Cotton Poplin 2/100s` |
| Target Volume (m) | Evlo meters produce panna | `5000` |
| Allocate Looms Count | Evlo looms use pannura | `4` |
| Start Date | Aarambika pora date | `2026-09-10` |
| Delivery Date | Client ku delivery date | `2026-09-28` |

### Stage Dropdown (ovvoru plan kum)
Plan live ah indha stages la move aagum:
`Yarn Requisition → Warping Beams → Weaving Run → Dyeing/Stenter → Inspection & Pack → Completed`

AUTO-PILOT plan na — **neenga onnum panna vendaam**, system automatic ah stages move panni stock add pannum!

---

## 🎨 YARN & DYE HOUSE (`/dye-house`)
Yarn stock + dye recipes manage panna.

### Add Yarn Lot
| Field | Meaning | Example |
|-------|---------|---------|
| Yarn Count & Spec | Yarn type/count | `2/60s Combed Cotton` |
| Fiber Class | | `Cotton` |
| Spinning Mill | Yarn vanguna mill | `Lakshmi Mills` |
| Net Inward Weight (KG) | Evlo kg vandhu | `500` |
| Cartons / Bag Count | Evlo bags | `25` |
| Rate / Kg (₹) | Oru kg price | `420` |
| Storage Bay | Godown location | `YARN-A1` |

### New Dye Recipe (color formula)
| Field | Meaning | Example |
|-------|---------|---------|
| Shade Name * | Color name | `Midnight Navy` |
| Pantone TCX Code * | International color code | `19-4034 TCX` |
| Visual Swatch | Color picker la select | dark blue |
| Dye Chemistry Class | Entha dye type | `Reactive` |
| Liquor Ratio | Water : fabric ratio | `1:10` |
| Peak Dye Temp (°C) | Maximum temperature | `60` |
| Delta E Tolerance | Color match tolerance | `0.8` |
| Formulation Recipe | Chemical measurements | `Dyestuff 2.45% o.w.f + Salt 45 g/L...` |
| Master Dyer | In-charge name | `Selvam` |

---

## 🌀 WARPING & SIZING (`/beam-preparation`)
Yarn ah beam la wind pannura section.

### New Beam Form
| Field | Meaning | Example |
|-------|---------|---------|
| Target Fabric Quality | Entha fabric ku beam | `Cotton Poplin 2/100s` |
| Source Yarn Lot | Entha yarn use pannura | `YL-2/60S-COMBED` |
| Total Warp Ends | Beam la evlo threads | `4800` |
| Warp Wound Length (m) | Beam la evlo meters wind | `12000` |
| Beam Flange Width (") | Beam width | `72` |
| Sizing Recipe | Starch chemical mix | `PVA 12kg + Acrylate 4kg` |
| Size Pick-up (%) | Yarn la starch evlo yerudhu | `9.5` |
| Residual Moisture (%) | | `7.2` |
| Drying Cyl Temp (°C) | Dry temperature | `110` |
| Allocate to Loom | Entha loom ku anuppura | `L-014` |

---

## 🖥️ LOOM 2D FLOOR MATRIX (`/loom-matrix`) ⭐ LIVE!
Factory floor oda **real-time map**. Ovvoru tile = ovvoru loom.

- 🟢 **Green + pulse** = Running (RPM, meters live ah move aagum!)
- 🔴 **Red** = Breakdown (alert bell la yum varum)
- 🟡 **Amber** = Maintenance
- Tile click panna → full telemetry detail modal
- **10 seconds ku oru thadava auto refresh** — just vechu paaru, numbers move aagum!

### Telemetry Detail Modal (tile click panna)
- Live RPM, Woven Meters, Picks, Efficiency
- Sensor fault log
- **Simulate/Override buttons** — test purpose: loom status ah manual ah change pannalam

---

## ⚙️ LOOM CONTROL ROOM (`/production`)
Production jobs schedule + update panna.

### Schedule Job Form
| Field | Meaning | Example |
|-------|---------|---------|
| Fabric Quality * | Entha fabric | `Cotton Poplin 2/100s` |
| Allocate Loom * | Entha loom | `L-003` |
| Weaver Operator | Weaving ponna aal | `Murugan` |
| Target Production (m) * | Target meters | `800` |
| Start / Completion Date | | dates |

### Update Batch (job la Update button)
| Field | Meaning | Example |
|-------|---------|---------|
| Produced Meters (Actual) | Nijama evlo meters vandhu | `795` |
| Scrap / Flaw (m) | Waste/defect meters | `5` |
| Quality Grade | Inspector grade | `A` |

---

## 📈 SHIFT YIELD & OEE (`/shift-oee`)
Shift performance record.

| Field | Meaning | Example |
|-------|---------|---------|
| Shift Period | | `6AM-2PM` |
| Supervisor | | `Kannan` |
| Active Looms | Run aana looms | `18` |
| Total Meters Woven | Shift la production | `12400` |
| Picks Counter | Total picks | `8.2M` |
| Scrap Wastage (m) | Waste | `120` |
| Warp Breaks (mins) | Breaks time | `14` |
| Weft Stoppage (mins) | | `9` |
| Power (kWh) | Power consumption | `340` |

---

## 🧮 FABRIC COSTING & BOM (`/costing`)
Oru fabric ku actual cost evlo, selling price evlo nu calculate.

| Field | Meaning | Example |
|-------|---------|---------|
| Warp Yarn Cost (₹/m) | | `48` |
| Weft Yarn Cost (₹/m) | | `32` |
| Sizing Cost (₹/m) | | `6` |
| Weaving Labour (₹/m) | | `25` |
| Dyeing & Finish (₹/m) | | `30` |
| Overheads/Power (₹/m) | | `18` |
| Target Margin (%) | Profit % | `22` |

→ System automatic ah **cost per meter + recommended price** calculate pannum.

---

## 🔥 BOILER & STEAM (`/boiler-energy`)
Steam plant daily log.

| Field | Meaning | Example |
|-------|---------|---------|
| Steam Generated (Tons) | | `42` |
| Header Pressure (Bar) | | `8.5` |
| Steam Temp (°C) | | `175` |
| Fuel Class | | `Husk` |
| Fuel Consumed (Tons) | | `12` |
| Dye House / Stenter / Sizing split | Steam allocation | `18 / 14 / 10` |
| Boiler Water pH | Safe range 10.5-11.5 | `10.8` |

---

## ⚡ STENTER & FINISHING (`/finishing`)
Woven fabric ku final finish (softness, width set, etc).

| Field | Meaning | Example |
|-------|---------|---------|
| Greige Lot | Entha woven lot | `WV-LOT-88` |
| Machine Line | | `Stenter-2` |
| Treatment Class | | `Soft Finish + Sanforize` |
| Chamber Temp (°C) | | `185` |
| Speed (m/min) | | `35` |
| Target Width (") | Final width | `44` |
| Input Greige Meterage | | `1500` |

---

## 🏅 QC & LAB TEST (`/quality-lab`)
Fabric quality inspection — **4-point system**.

| Field | Meaning | Example |
|-------|---------|---------|
| Batch Lot | Entha lot inspect | `FIN-LOT-12` |
| Inspected Meterage | | `1500` |
| Width (Panna) | | `44` |
| Minor Flaws (1-2 pts) | Chinna defects count | `3` |
| Major Flaws (3-4 pts) | Periya defects | `0` |
| GSM / Shrinkage / Tensile / Color Fastness | Lab values | `145 / 1.2% / 420N / 4` |
| Grade Result | **A/B/C** — A = export quality | `A` |

---

## 💧 ETP & WATER RECYCLING (`/etp-sustainability`)
Effluent treatment plant daily compliance log (pollution control board ku thevai).

| Field | Meaning | Example |
|-------|---------|---------|
| Raw Dye Inflow (KLD) | Vandha dirty water | `85` |
| Recycled Water (KLD) | Clean aana water | `78` |
| Sludge (KG) | | `320` |
| pH (6.5-8.0) | Safe range check | `7.2` |
| COD (Max 50) | Pollution level | `42` |
| BOD (Max 15) | | `11` |

---

## 📦 ROLL PACKING & BALES (`/roll-packing`)
Finished fabric ah rolls ah pack pannura.

### Pack New Roll Form
| Field | Meaning | Example |
|-------|---------|---------|
| Production Lot | Entha finished lot | `FIN-LOT-12` |
| Net Piece Length (m) | Roll length | `98.5` |
| Width (Panna) | | `44` |
| Gross Weight (KG) | Roll + core weight | `31.2` |
| Net Fabric Weight (KG) | Fabric weight alone | `29.8` |
| Quality Grade | | `A` |
| Storage Bay | | `FG-BAY-2` |
| Bale / Crate No | Entha bale la | `BALE-009` |

→ Oru roll create aana **automatic ah barcode sticker print** option varum!

---

## 🔧 PLANT MAINTENANCE (`/maintenance`)
Machine breakdown/service record.

### New Breakdown Form
| Field | Meaning | Example |
|-------|---------|---------|
| Machine Code | Entha machine | `L-014` |
| Classification | | `Breakdown` / `Preventive` |
| Severity | | `Critical` / `Major` / `Minor` |
| Assigned Fitter | Repair ponna aal | `Ramesh` |
| Defect Symptom | Enna problem | `Warp beam brake slipping` |
| Spare Parts Required | | `Brake pad x2` |

---

## 👷 WORKER ATTENDANCE & OT (`/attendance-muster`)
Daily attendance + overtime record.

| Field | Meaning | Example |
|-------|---------|---------|
| Badge / Employee ID | | `EMP-1024` |
| Worker Name | | `Murugan` |
| Department | | `Weaving` |
| Shift | | `6AM-2PM` |
| Punch In / Out | | `06:02 / 14:35` |
| Base Wage (₹) | Daily salary | `650` |
| OT Hours (@ 2x) | Overtime | `2` |

---

## 🚪 SECURITY GATE PASS (`/gate-pass`)
Factory la irundhu goods veliya poga **gate pass mandatory**.

### New Gate Pass Form
| Field | Meaning | Example |
|-------|---------|---------|
| Gate Pass Type | | `Dispatch` / `Returnable` |
| Vehicle Reg No | Lorry number | `TN 39 AB 1234` |
| Transporter | Transport company | `VRL Logistics` |
| Driver Name & Mobile | | `Kumar 98430xxxxx` |
| Linked Invoice | Entha invoice ku | `INV-2026-204` |
| Consignee | Delivery party | `Arvind Fashions, Bengaluru` |
| E-Way Bill No | GST transport bill | `34100xxxxx` |
| Gross / Tare Wt (KG) | Full weight / empty weight | `4200 / 3800` |
| Rolls / Bales | Count | `42` |
| Total Meterage | | `4100` |
| Security Officer | | `Senthil` |

---

## 🌍 GLOBAL B2B EXPORTS (`/exports`)
Export contracts manage panna.

| Field | Meaning | Example |
|-------|---------|---------|
| Buyer Brand | Foreign client | `Hugo Boss` |
| Destination Country | | `Germany` |
| Fabric Quality | | `Cotton Poplin 2/100s` |
| Volume (m) | | `25000` |
| Currency | | `USD` / `EUR` |
| Export Rate / m | | `$3.20` |
| Incoterms | Shipping terms | `FOB Chennai` |
| Port of Loading/Discharge | | `Chennai / Hamburg` |
| Container Mode | | `40ft HQ` |
| LC Number | Letter of Credit | `LC-DE-88214` |

## 👥 B2B WHOLESALE CLIENTS (`/clients`)
Client database: Company name, phone, email, GSTIN, billing address, industry.

### Register Client Form
| Field | Example |
|-------|---------|
| Company Name | `Arvind Fashions Ltd` |
| Phone | `080-4455xxxx` |
| Email | `buyer@arvind.in` |
| GSTIN | `29AABCAxxxxx` |
| Industry Segment | `Apparel Retail` |

---

## 🚚 WHOLESALE DISPATCH (`/dispatch`)
Invoice create panni goods anuppura.

### New Invoice Form
| Field | Meaning | Example |
|-------|---------|---------|
| Wholesale Buyer | Entha client ku | `Arvind Fashions` |
| Lorry LR / Waybill No | Freight document | `VRL-2026-9912` |
| Payment Terms | | `30 Days Credit` |

→ Invoice create aana **stock automatic ah deduct aagum** + print option.

---

## 🪙 WEAVER PAYROLL (`/wages`) — ADMIN only
Weavers ku piece-rate salary.

| Field | Meaning | Example |
|-------|---------|---------|
| Production Lot | Entha lot weaver pannan | `JOB-44` |
| Weaver Name | | `Murugan` |
| Woven Length (m) | | `795` |
| Rate / Meter (₹) | Piece rate | `4.50` |
| → Total Wage | automatic | `₹3,577` |

---

## 🧾 DAY-END SETTLEMENT (`/day-end-settlement`)
Daily cash close. Opening cash float enter pannu → system total sales,
payments, closing balance calculate pannum. Manager observations note pannalam.

## 📚 STOCK MOVEMENT LEDGER (`/stock-ledger`)
**Ovvoru meter movement history** — INWARD (production/purchase), SALE_CUT, WASTAGE, ADJUSTMENT.
Ovvoru roll ku full traceability: entha date, evlo meters, balance evlo.
Wastage entry: roll select panni wasted meters deduct pannalam.

## 📄 PURCHASE ORDERS (`/purchase-orders`) — ADMIN
Yarn order panna. Supplier select → dispatch date → quality terms → **PO PDF print**.

## 🚛 YARN SUPPLIERS (`/suppliers`) — ADMIN
Supplier database: name, contact person, phone, speciality, city, GSTIN.

## 👥 SHIFT STAFF (`/staff`) — ADMIN
| Button | Enna pannum |
|--------|-------------|
| **Register Operator** | Pudhu staff account create (name, username, password, role) |
| **Disable / Enable** | Account block/unblock |
| **Reset PW** | One-time temporary password generate (RF-xxxxxx) |

Roles: ADMIN, SUPERVISOR, WEAVER, DYEING_MASTER, FINISHING_MASTER, FITTER, DISPATCHER

## 📊 PRODUCTION REPORTS (`/reports`) — ADMIN
Daily/weekly/monthly production summary + Z-Report (day-end totals print).

---

## 🔔 BELL NOTIFICATIONS (top-right) — Meanings

| Icon/Color | Meaning |
|------------|---------|
| 🔴 CRITICAL | Loom breakdown — udane action thevai |
| 🟡 WARNING | Low stock / attention needed |
| 🔵 INFO | Auto-production started/completed, password reset, recovery |

Click panna → related page ku direct pogum. **Mark all read** button = ellam clear.

---

## ⚡ REAL-TIME BEHAVIOR (live ah enna nadakkum)

| Enna | Evlo frequent |
|------|---------------|
| Loom RPM / meters / efficiency update | **5 seconds** |
| Breakdown / recovery events | Random (~1.5%) |
| Low stock check + AUTO-PILOT | **45 seconds** |
| Production plan stage progress | **45 seconds** |
| Dashboard stats refresh | 30 seconds |
| Loom Floor Matrix refresh | 10 seconds |
| Bell notifications poll | 15 seconds |
| **ALL other pages** (Catalog, Ledger, QC, Packing, Dispatch, Dye House, etc.) | **15–30 seconds auto refresh** |

**EVERY page in the ERP now auto-refreshes** — neenga etha open pannalum
data live ah update aagum. Manual refresh (F5) thevai illa!

---

**Happy Manufacturing! 🏭** — KAK Textile Processing, Tirupur
