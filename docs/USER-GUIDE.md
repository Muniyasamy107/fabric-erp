# 🏭 KAK TEXTILE PROCESSING — COMPLETE A-Z MANUAL

Bro, indha file la **project starting la irunthu ovvoru component, ovvoru form field — enna kudukkanum, example oda** full ah irukku.

---

## 1️⃣ PROJECT ENNA? (Architecture)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite | Browser la running UI — 29 pages |
| Backend | Spring Boot (Java) + JWT | Business logic + security |
| Database | MySQL | Ella data um save |
| Deploy | Docker Compose | Production one-command start |

**Data flow:** Browser → React page → API call (`/api/...`) → Spring Boot → MySQL → response → page live update.

**Logins:** `admin/admin123` · `supervisor/super123` · `weaver/weaver123` · `dyer/dyer123`

---

## 2️⃣ FACTORY DAILY FLOW (System ipadi dhaan think pannum)

```
1. Yarn purchase        → Suppliers + Purchase Orders
2. Production plan      → "Entha fabric, evlo meters, evlo looms"
3. Dye recipe prepare   → Yarn & Dye House
4. Warp beam ready      → Warping & Sizing
5. Weaving (LIVE)       → Loom Matrix + Control Room
6. Dyeing + Finishing   → Finishing (Stenter)
7. Quality test         → QC Lab (Grade A/B/C)
8. Roll packing         → Rolls + Bales + barcode
9. Dispatch             → Invoice + Gate Pass (lorry out)
10. Money close         → Day-End Settlement
```

---

## 3️⃣ LOGIN & SIGNUP PAGE (`/login`)

App open aana odane idhu dhaan varum — website illa, direct staff access.

| Element | Purpose |
|---------|---------|
| Sign In tab | Existing staff login |
| Create Account tab | Pudhu staff signup — account **WEAVER** role la create aagi udane login aagum (admin role ah Shift Staff la maathalam) |
| Remember me | Username ah browser la save pannum |
| Sign In to ERP | Username+password check panni dashboard open |
| Forgot password? | Username → registered full name → **one-time password (RF-xxxxxx)** |

---

## 4️⃣ MODULE BY MODULE — PURPOSE + FORM INPUTS

### 📊 MILL DASHBOARD
**Purpose:** One-glance factory status. Revenue, meters sold, active looms, **stock alerts list**, charts.
**Input:** Illa — auto live (30s refresh). Stock < minimum ana red alert item varum.

---

### 🧵 FABRIC CATALOG (`/fabrics`)
**Purpose:** Full inventory — photo, stock, price, low-stock alert.
**Button: Add Fabric** — form fields:

| Field | Enna kudukkanum | Example |
|-------|----------------|---------|
| Item Code (SKU) * | Unique product code | `RF-COT-023` |
| Fabric Name * | Product name | `Cotton Twill 2/60s` |
| Fabric Material | Cotton/Silk/Poly... | `100% Cotton` |
| GSM (Weight) | 1 sq.meter weight | `145` |
| Rack / Vault Shelf | Godown location | `BAY-4 / SHELF-B` |
| GST HSN Code | Billing code | `5208` |
| Season Collection | | `Winter 2026` |
| Recommended Garment | | `Shirts, Dresses` |
| Image URL | Photo path | `/fabrics/cotton-drill.jpg` |
| Price / Meter * | ₹ per meter (no GST) | `210` |
| Total Available Meters * | Current stock | `1200` |
| Low Stock Alert (m) | Ithu kela pona ALERT | `100` |
| GST Rate | % | `5` |

**Result:** Card la photo + stock + LOW STOCK ribbon (stock < alert ana).

---

### 🖼️ SWATCH GALLERY (`/lookbook`)
**Purpose:** Client-ku photo gallery. Input illa — catalog photos auto.

---

### 🧵 REMNANT CLEARANCE (`/remnant-clearance`)
**Purpose:** Short-length end-bit rolls discount la vikka.
**Buttons:** `Set Discount` (% change), `View in Catalog`.
Auto: demo la 3 remnant rolls (Cambric 15% off, Silk Organza 35% off, Denim 25% off).

---

### 🎨 CAD WEAVE STUDIO (`/cad-studio`)
**Purpose:** Pudhu weave design create.
**New Design form:**

| Field | Example |
|-------|---------|
| Concept Design Name | `Herringbone Twill V2` |
| Target Buyer | `Raymond` |
| Weave Architecture | `Twill 2/2` |
| Heald Shafts | `4` |
| Warp Density (EPI) | `120` |
| Weft Density (PPI) | `68` |
| Sample Yardage | `50` |
| Lead CAD Designer | `Arjun CAD` |

---

### 📋 PRODUCTION PLANNING (`/planning`)
**Purpose:** Order ku production plan podurathu. AUTO-PILOT plans inga live move aagum.
**New Plan form:**

| Field | Example |
|-------|---------|
| Order/Contract Ref | `WO-2026-221` |
| Target Buyer | `Arvind Fashions` |
| Fabric Quality | `Cotton Poplin 60s x 60s` |
| Target Volume (m) | `5000` |
| Looms Count | `4` |
| Start Date / Delivery Date | dates |

**Stage dropdown:** Yarn → Warping → Weaving → Dyeing → Inspection → Completed (AUTO plans automatic).

---

### 🎨 YARN & DYE HOUSE (`/dye-house`)
**Purpose:** Yarn stock + dye color recipes.

**Add Yarn:** Count `2/60s Combed Cotton` · Mill `Lakshmi Mills` · Weight `500 kg` · Bags `25` · Rate `₹420` · Bay `YARN-A1`

**New Dye Recipe:**

| Field | Example |
|-------|---------|
| Shade Name * | `Midnight Navy` |
| Pantone TCX * | `19-4034 TCX` |
| Dye Class | `Reactive` |
| Liquor Ratio | `1:10` |
| Peak Temp | `60` |
| Delta E | `0.8` |
| Formulation | `Dyestuff 2.45% o.w.f + Salt 45 g/L...` |
| Master Dyer | `Selvam M` |

---

### 🌀 WARPING & SIZING (`/beam-preparation`)
**Purpose:** Yarn ah beam la wind panni sizing chemical podurathu.
**New Beam form:**

| Field | Example |
|-------|---------|
| Target Fabric | `Cotton Poplin 60s x 60s` |
| Source Yarn Lot | `YL-2-60S-COMBED` |
| Total Warp Ends | `4800` threads |
| Warp Length (m) | `12000` |
| Flange Width (") | `72` |
| Sizing Recipe | `PVA 12kg + Acrylate 4kg` |
| Size Pick-up % | `9.5` |
| Drying Temp | `110` |
| Allocate Loom | `LOOM-A01` |

---

### 🖥️ LOOM 2D FLOOR MATRIX (`/loom-matrix`) ⭐ LIVE
**Purpose:** Factory floor real-time map. 🟢 Running (pulse + meters counting), 🔴 Breakdown, 🟡 Maintenance. Tile click → telemetry detail. **10s auto refresh. Input illa — pure monitoring.**

---

### ⚙️ LOOM CONTROL ROOM (`/production`)
**Purpose:** Weaving jobs schedule + update.
**Schedule Job:** Fabric *, Loom *, Weaver `Murugan`, Target `800 m`, dates.
**Update Batch:** Produced `795`, Scrap `5`, Grade `A`.

---

### 📈 SHIFT YIELD & OEE (`/shift-oee`)
**Purpose:** Shift performance. Fields: Supervisor, Active Looms `10`, Meters `12400`, Picks, Waste `120`, Warp Breaks `14 min`, Power `340 kWh` → OEE % auto.

---

### 🧮 FABRIC COSTING (`/costing`)
**Purpose:** Cost per meter calculate + selling price suggest.
Fields: Warp cost `₹48/m`, Weft `₹32`, Sizing `₹6`, Labour `₹25`, Dye `₹30`, Overhead `₹18`, Margin `22%` → **auto total + recommended price**.

---

### 🔥 BOILER & STEAM (`/boiler-energy`)
**Purpose:** Steam plant log. Steam `42 t`, Pressure `8.5 bar`, Temp `175°C`, Fuel `Husk 12t`, pH `10.8`, Engineer name.

---

### ⚡ STENTER & FINISHING (`/finishing`)
**Purpose:** Woven fabric final finish.
Fields: Greige Lot `WV-LOT-88`, Machine `Stenter-2`, Treatment `Soft Finish`, Temp `185°C`, Speed `35 m/min`, Target Width `44"`, Input meters `1500`.

---

### 🏅 QC & LAB TEST (`/quality-lab`)
**Purpose:** 4-point inspection → Grade.
Fields: Lot, Inspected m, Width, Minor flaws `3`, Major `0`, GSM, Shrinkage `1.2%`, Tensile `420N`, Fastness `4` → **EXPORT_APPROVED / REWORK** verdict.

---

### 💧 ETP (`/etp-sustainability`)
**Purpose:** Pollution compliance log. Inflow `85 KLD`, Recycled `78`, pH `7.2`, COD `42` (max 50), BOD `11` (max 15) → ZLD COMPLIANT.

---

### 📦 ROLL PACKING (`/roll-packing`)
**Purpose:** Finished fabric rolls pack + barcode.
Fields: Lot, Length `98.5 m`, Width `44"`, Gross `31.2 kg`, Net `29.8`, Grade `A`, Bin `FG-BAY-2`, Bale `BALE-009`.

---

### 🔧 PLANT MAINTENANCE (`/maintenance`)
**Purpose:** Breakdown/service tickets.
Fields: Machine `LOOM-A07`, Type `Breakdown`, Severity `Critical`, Fitter `Ramesh`, Symptom, Spare parts.

---

### ⏱️ BIOMETRIC PUNCH KIOSK (`/biometric`)
**Purpose:** Gate terminal — **ellaram** (workers EMP badge, staff login username) scan panni PUNCH IN/OUT.
Input: Badge ID (`EMP-WEAVER-042` or `ADMIN`) → Enter.
Auto: shift detect, OT 2x calc, duplicate block, ON-DUTY counters live.

---

### 📋 ATTENDANCE REGISTER & OT (`/attendance-muster`)
**Purpose:** HR management side.
- **Bulk Sheet:** date+shift+dept select → full team grid → 1-click save
- **Directory:** worker register (name, badge ⚡ Auto, machine, wage, dept) — **ID create panna dhaan kiosk la punch aagum!**
- **Muster Logs:** history + payroll totals + Form 25 print

---

### 👷 WEAVER PAYROLL (`/wages`)
**Purpose:** Piece-rate salary. Lot select → weaver → meters `795` × rate `₹4.50` = **₹3,577 auto**.

---

### 🚪 GATE PASS (`/gate-pass`)
**Purpose:** Goods veliya pogum bodhu security pass.
Fields: Type `Dispatch`, Vehicle `TN 39 AB 1234`, Transporter, Driver+phone, Invoice ref, E-Way Bill, Gross/Tare wt, Rolls `42`, Meters `4100`, Officer.

---

### 👥 B2B CLIENTS (`/clients`)
**Purpose:** Buyer database. Fields: Company, phone, email, GSTIN, address, segment.

---

### 🌍 EXPORTS (`/exports`)
**Purpose:** Foreign contracts. Buyer `Hugo Boss`, Country, Fabric, Volume, Currency `EUR`, Rate `$3.10`, Incoterms `FOB Chennai`, Ports, Container, LC Number, Bank.

---

### 🚚 DISPATCH (`/dispatch`)
**Purpose:** Invoice + goods out. Buyer select, LR No, Payment terms → **stock auto deduct** + GST calc + print.

---

### 🧾 DAY-END SETTLEMENT (`/day-end-settlement`)
**Purpose:** Cash close. Opening float `₹5000` → sales auto total → closing note → Z-Report print.

---

### 📚 STOCK LEDGER (`/stock-ledger`)
**Purpose:** Ovvoru meter movement history (INWARD/SALE/WASTAGE/ADJUSTMENT) — full traceability. Wastage deduct form: roll select + meters + reason.

---

### 📄 PURCHASE ORDERS (`/purchase-orders`)
**Purpose:** Yarn order. Supplier select → dispatch date → terms → PO print.

### 🚛 SUPPLIERS (`/suppliers`)
**Purpose:** Vendor DB. Mill name, contact person, phone, speciality, city, GSTIN.

### 👥 SHIFT STAFF (`/staff`)
**Purpose:** Login accounts. Register (name, username, password, role), Disable/Enable, **Reset PW** (temp password),

### 📊 REPORTS (`/reports`)
**Purpose:** Production/financial summaries + prints.

---

## 5️⃣ REAL-TIME ENGINES (background la automatic)

| Engine | Frequency | Enna pannum |
|--------|-----------|-------------|
| Loom SCADA | 5s | RPM/meters/efficiency move; breakdown+repair |
| Low stock sweep | 60s | LOW_STOCK alerts + remnant yard digest (30m) |
| AUTO-PILOT | 45s | low stock → plan → stages → stock refill |
| Demand simulator | 90s | cut orders consume stock (loop never stops) |
| Stock audit | 10m | shortage discover (always a live story) |
| Housekeeping | 1h | old alerts auto-archive/delete |
| All pages | 10–45s | auto refresh |

## 6️⃣ BELL NOTIFICATIONS
🔴 CRITICAL (breakdown) · 🟡 WARNING (low stock) · 🔵 INFO. Click → page ku pogum. Mark All Read button. Badge 99+ cap.

---

**KAK Textile Processing, Tirupur — Happy Manufacturing! 🏭**

---

## 🧭 SIDEBAR — ALL 31 ITEMS (quick reference)

| # | Item | Purpose | ADMIN | CASHIER |
|---|------|---------|:-----:|:-------:|
| 1 | Mill Dashboard | One-glance live KPIs + stock alerts | ✅ | ✅ |
| 2 | Fabric Catalog | Finished fabric inventory + photos + low stock | ✅ | ✅ |
| 3 | Swatch Gallery | Client photo gallery | ✅ | ✅ |
| 4 | Remnant Clearance | Discount end-bit rolls | ✅ | ✅ |
| 5 | CAD Weave Studio | New weave design specs | ✅ | ✅ |
| 6 | Production Planning | Order plans + stage tracking (AUTO-PILOT live) | ✅ | ✅ |
| 7 | Yarn & Dye House | Yarn stock + dye color recipes | ✅ | ✅ |
| 8 | Warping & Sizing | Warp beam preparation logs | ✅ | ✅ |
| 9 | Loom 2D Floor Matrix | Live factory floor map (10s) | ✅ | ✅ |
| 10 | Loom Control Room | Weaving jobs + batch updates | ✅ | ✅ |
| 11 | Shift Yield & OEE | Shift performance report | ✅ | ✅ |
| 12 | Fabric Costing & BOM | Cost/meter calc + price suggestion | ✅ | ✅ |
| 13 | Boiler & Steam Power | Steam plant daily log | ✅ | ✅ |
| 14 | Stenter & Finishing | Finishing treatment logs | ✅ | ✅ |
| 15 | QC & Lab Test | 4-point inspection + grade verdict | ✅ | ✅ |
| 16 | ETP & Water Recycling | Pollution compliance log | ✅ | ✅ |
| 17 | Roll Packing & Bales | Roll/bale packing + barcode | ✅ | ✅ |
| 18 | Plant Maintenance | Breakdown/service tickets | ✅ | ✅ |
| 19 | Attendance Register & OT | HR: bulk sheet, worker register, Form 25 | ✅ | ✅ |
| 20 | Biometric Punch Kiosk | Gate punch terminal (everyone) | ✅ | ✅ |
| 21 | Security Gate Pass | Goods-out vehicle pass | ✅ | ✅ |
| 22 | Global B2B Exports | Foreign contracts (LC, Incoterms) | ✅ | ✅ |
| 23 | B2B Wholesale Clients | Buyer database | ✅ | ✅ |
| 24 | Wholesale Dispatch | Invoice + dispatch (stock auto-cut) | ✅ | ✅ |
| 25 | Weaver Payroll | Piece-rate salary calc | ✅ | ❌ |
| 26 | Day-End Settlement | Cash close + Z-report | ✅ | ✅ |
| 27 | Stock Movement Ledger | Every meter movement history | ✅ | ✅ |
| 28 | Purchase Orders | Yarn PO to suppliers | ✅ | ❌ |
| 29 | Yarn Suppliers | Vendor master | ✅ | ❌ |
| 30 | Shift Staff | Login accounts manage | ✅ | ❌ |
| 31 | Production Reports | Summaries + prints | ✅ | ❌ |

Top: brand block "KAK TEXTILE PROCESSING". Bottom: logged-in name + role + red Logout.
Active page = gold highlight.
