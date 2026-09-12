# Deploy health check — KAK Textile ERP

Use this after every production deploy (Vercel frontend + any backend host).

## Live URLs in this project

| Layer | Where it lives | URL |
|-------|----------------|-----|
| Frontend (SPA) | Vercel Production | https://fabric-erp-liart.vercel.app |
| Backend (Spring Boot) | **Must be separate** — Vercel cannot run Java | your Render / Railway / Fly / EC2 / Docker host |
| Database | MySQL 8 or TiDB | set via `DB_URL` |

> Vercel only serves the React build. Login always calls the Spring Boot API.
> If `VITE_API_URL` is missing, the browser hits `https://fabric-erp-liart.vercel.app/api/...`
> which is **not** the backend → network / 404 style failures.

---

## 1. Frontend checks (Vercel)

```bash
# Homepage / login must return 200 HTML
curl -I https://fabric-erp-liart.vercel.app/login

# SPA refresh must NOT 404 (vercel.json rewrite)
curl -I https://fabric-erp-liart.vercel.app/dashboard
curl -I https://fabric-erp-liart.vercel.app/loom-matrix
```

Expected: `HTTP/2 200` and `cache-control: public, max-age=0, must-revalidate`.

Vercel dashboard settings:

1. **Root Directory** = `frontend`
2. Build = `npm run build`, Output = `dist`
3. Env var **`VITE_API_URL`** = `https://<your-backend-host>/api`  
   (must **redeploy** after changing — Vite inlines env at build time)

---

## 2. Backend checks

```bash
# Liveness
curl https://<backend>/api/health
# → {"status":"UP","database":"UP",...}

# Admin login (Admin tab credentials)
curl -X POST https://<backend>/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'
# → {"token":"...","username":"admin","role":"ADMIN",...}
```

| Symptom | Meaning | Fix |
|---------|---------|-----|
| `Account is disabled` | `users.active = 0` for admin | Restart backend (DataInitializer re-enables seed accounts) |
| `Invalid username or password` | wrong password / user missing | use `admin` / `admin123` or reset from DB |
| connection refused / timeout | backend not running | start Spring Boot / fix host |
| CORS error in browser | origin blocked | SecurityConfig allows `*.vercel.app` |
| 401 on every API after login | JWT secret rotated / clock skew | keep `JWT_SECRET` stable across restarts |

---

## 3. Demo accounts (seeded on every backend start)

| Username | Password | Role | Login tab |
|----------|----------|------|-----------|
| admin | admin123 | ADMIN | **Admin** |
| supervisor | super123 | SUPERVISOR | Staff |
| weaver | weaver123 | WEAVER | Staff |
| dyer | dyer123 | DYEING_MASTER | Staff |
| finisher | finish123 | FINISHING_MASTER | Staff |
| fitter | fitter123 | FITTER | Staff |
| dispatcher | dispatch123 | DISPATCHER | Staff |

On startup the seeder now **re-enables** these accounts and resets their passwords
to the values above, so a previous "Disable" click cannot permanently lock demo logins.

The primary `admin` account **cannot be disabled** from Shift Staff.

---

## 4. Full-stack Docker (no Vercel split)

```bash
DB_PASSWORD=YourStrongPassword JWT_SECRET=YourLongRandomSecret \
  docker compose up --build -d
```

Then open http://localhost — Nginx serves React and proxies `/api` → backend:8083.
No `VITE_API_URL` needed.

---

## 5. Quick browser test script

1. Open https://fabric-erp-liart.vercel.app/login  
2. **Admin** tab → `admin` / `admin123` → Sign In  
3. Should land on Mill Dashboard  
4. Hard refresh (F5) on `/dashboard` — page must stay (no Vercel 404)  
5. Navbar bell / live KPIs should move within ~45 s (telemetry engines)

---

## Live production hosts (this project)

| Layer | URL |
|-------|-----|
| Frontend | https://fabric-erp-liart.vercel.app |
| Backend  | https://fabric-erp-backend.onrender.com |

`frontend/vercel.json` rewrites `/api/*` → the Render backend, so the browser can
keep using relative `/api` calls without a `VITE_API_URL` env var.

After backend code changes: **Manual Deploy** (or auto-deploy) on Render so
`DataInitializer` re-enables `admin` / `admin123`.
