#  KAK Textile Processing — Integrated Fabric Manufacturing ERP

A complete digital mill for a real fabric manufacturing company: **yarn procurement → weaving → dyeing & finishing → quality → packing → wholesale & export dispatch → day-end settlement**, behind a secure staff sign-in / signup screen.

## ⚡ Real-Time Engines (built-in)

- **Live loom SCADA** — RPM / meters / efficiency move every 5 s, random warp/weft breakdowns with auto-repair, alerts in the navbar bell
- **AUTO-PILOT closed loop** — low stock fires an alert → auto production plan → stages advance yarn → warping → weaving → dyeing → packing → stock auto-refills (≈4 min)
- **Live wholesale demand** — counter cut orders consume stock continuously, so the low-stock → manufacturing → replenishment loop never stops
- **Stock audit shortage** — when all stock is healthy, a physical-audit shortage is discovered so there is always a live story to follow
- **Biometric Punch Kiosk** — universal badge scan for factory workers (EMP badges) and admin/office staff (their login username), live ID card, on-duty counters, duplicate block, auto OT (2x)
- **Live everywhere** — every page auto-refreshes (10–45 s), no manual reload needed
- **Demo data seeder** — every module is populated with realistic records on a fresh database (23 tables)

| Layer    | Technology                              |
|----------|------------------------------------------|
| Frontend | React 19 + Vite + React Router + Axios   |
| Backend  | Spring Boot 3.3 (Java 17) + Spring Security + JWT |
| Database | MySQL 8                                   |
| Deploy   | Docker Compose (MySQL + Boot + Nginx)    |

---

## ✨ Modules

**Staff authentication** — professional sign-in & create-account screen, remember-me, one-time password recovery (`/login`)

**Mill operations**
- Mill Dashboard (live KPIs, OEE trends, energy distribution)
- Production Planning · CAD Weave Studio · Warping & Sizing
- Loom 2D Floor Matrix (live SCADA telemetry) · Loom Control Room
- Shift Yield & OEE · Boiler & Steam · Stenter & Finishing · ETP / ZLD

**Inventory & Quality**
- Fabric Catalog with photography & barcodes · Swatch Gallery
- Yarn & Dye House (recipes, yarn lots) · QC 4-Point Lab
- Roll Packing & Bales · Stock Movement Ledger · Remnant Clearance

**Commercial**
- B2B Wholesale Clients · Dispatch Invoicing (GST) · Export Contracts
- Security Gate Pass · Yarn Suppliers · Purchase Orders · Stock Inward

**People & Money**
- Shift Staff & roles · Biometric Punch Kiosk · Attendance Register & OT · Weaver Payroll
- Day-End Drawer Settlement with printable Z-Report · Financial Reports

---

## 🚀 Run in development

### Prerequisites
- Java 17, Maven (or use `./mvnw`), Node 18+, MySQL 8

### 1. Database
```sql
CREATE DATABASE IF NOT EXISTS luxury_fabric_erp;
```
(Or let the app auto-create it — the JDBC URL includes `createDatabaseIfNotExist=true`.)

### 2. Backend (port 8083)
```bash
cd backend/demo
./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
```
First start seeds: 4 user accounts, 20 fabric qualities with photos, 6 yarn lots, 6 suppliers and matching stock-ledger entries.

### 3. Frontend (port 5173, proxies /api → 8083)
```bash
cd frontend
npm install
npm run dev
```

### 4. Login
| Username    | Password     | Role             |
|-------------|--------------|------------------|
| admin       | admin123     | ADMIN            |
| supervisor  | super123     | SUPERVISOR       |
| weaver      | weaver123    | WEAVER           |
| dyer        | dyer123      | DYEING_MASTER    |
| finisher    | finish123    | FINISHING_MASTER |
| fitter      | fitter123    | FITTER           |
| dispatcher  | dispatch123  | DISPATCHER       |

**Sign in:** the login page has separate **Admin** and **Staff** tabs — the Admin tab accepts `ADMIN`
accounts only, the Staff tab accepts every shop-floor role. Sessions are kept in `sessionStorage`, so
a new tab or browser window always starts at the login page while a refresh of the same tab stays
signed in. Menu entries and every route are filtered by the role matrix in
`frontend/src/utils/roleAccess.js`.

> ⚠️ Change all default passwords before production use (`config/DataInitializer.java`).

---

## 🐳 Run in production (Docker)

```bash
DB_PASSWORD=YourStrongPassword JWT_SECRET=YourLongRandomSecret docker compose up --build -d
```
- ERP → `http://localhost` (Nginx serves React and proxies `/api` to the backend)
- MySQL data persists in the `db-data` volume — take regular backups.
- Put Nginx behind TLS (HTTPS) at your domain.

---

## 🔐 Security notes

- All `/api/**` endpoints require a valid JWT except `/api/auth/login`
- `/api/users/**` (staff management) is restricted to ADMIN
- Secrets come from environment variables (`DB_URL`, `DB_PASSWORD`, `JWT_SECRET`)
- Passwords stored with BCrypt

---

## 📁 Structure

```
backend/demo/src/main/java/com/fabricerp/erp/
  config/        security, CORS-free CORS, data seeders
  controller/    REST endpoints per module
  entity/        JPA entities (≈35 tables)
  repository/    Spring Data repositories
  security/      JWT util + auth filter
frontend/src/
  pages/         one folder per module
  services/      axios API clients
  components/    sidebar, navbar, tables, modals, toasts
```

© KAK Textile Processing — Tirupur, Tamil Nadu.
