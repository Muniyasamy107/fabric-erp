# Vercel deploy — "404 NOT_FOUND on refresh" fix

## Lakshanam (symptom)

Site normal-a load aagum, aana **refresh (F5)** panna / address bar-la direct-a
type panna:

```
404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::xxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxx
```

## Karanam (root cause)

Indha frontend **Single Page App** (`BrowserRouter`, React Router v7). Route-ukaga
`/dashboard`, `/loom-matrix`, `/biometric` … nu irukkira path-ukku **real file illa** —
adha React browser-la render panudhu.

- `frontend/nginx.conf` — `try_files $uri $uri/ /index.html` → Docker deploy ✓ work aagum
- **Vercel nginx.conf-ah use pannaadhu.** Static file thedum, kanpikathu → `404 NOT_FOUND`

Mudhinchathu: first load (`/`) index.html-ah edukkudhu, app load aagi route render panudhu.
Refresh panna Vercel-a path-a hit panrom → file illa → 404. **Server config issue, React bug illa.**

## Fix

`vercel.json` add panna vendum — Vercel path-a kanpikkaadha edhu **`/index.html`-ah rewrite**
panradhu (SPA fallback). Inga rendum create aagirukkum:

| File | Eppo use aagum |
|---|---|
| `frontend/vercel.json` | Vercel **Root Directory = `frontend`** (common / correct setting) |
| `vercel.json` (repo root) | Vercel **Root Directory = repo root** |

Vercel **Project Root Directory** oh path-la irukkura `vercel.json`-ah mattum thaan padikkum.
Root Directory enna-nu theriyathuna? **rendum safe** — illadha file ignore aagidum.
`/api/` request rewrite-il irunthu **exclude** pannaagirukku, adhala backend call
HTML-ah maaridhu (real 404/5xx than varum — debug panna easy).

Config:

```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }],
  "headers": [
    { "source": "/assets/(.*)",   "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/((?!assets/).*)","headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }] }
  ]
}
```

Cache header bonus: `index.html` **epo thaan revalidate** aagum → pudhu deploy pinnadi
browser-la old `index.html` cache aagirunthu **old hashed chunk** request panni
white screen / chunk 404 varadhu. (`/assets/*` hashed filename, adhala 1 varusham immutable.)

> `public/_redirects` file add panna **kaadhu** — `vercel.json` rewrites + `_redirects`
> rendum serndha Vercel build fail aagidum. Oru config file maari vecha podhum.

## Deploy panna settings checklist (Vercel Dashboard)

1. **Settings → Projects → your project → General → Root Directory** = `frontend`
2. Build Command `npm run build`, Output Directory `dist`, Install Command `npm install`
   (UI setting-a `vercel.json` override pannaathu — rewrites/headers mattum thaan irukku)
3. Deploy panni **Production URL**-la test:
   - `/login` open → refresh → page varum (mudhichathu 404 varum)
   - dashboard-la oru module open (ex: `/loom-matrix`) → **F5** → adhe page render aagum
   - wrong URL `/xyz` → index.html serve aagi React `*` route → login/role landing redirect
4. Confirm header: `curl -I https://<your-app>.vercel.app/loom-matrix`
   → `HTTP/2 200` + `cache-control: public, max-age=0, must-revalidate`

## Mudivaana note: backend `/api` Vercel-la illa

Vercel static frontend ah matum host panudhu; Spring Boot (`:8083`) adhu ilanga.
`src/services/api.js` `baseURL: import.meta.env.VITE_API_URL || '/api'` use panradhala,
Vercel-la `/api/*` **404** aagidum. Rendu option:

- **Option A (recommended):** backend-a Render / Railway / Fly.io / EC2-la deploy panni,
  Vercel → Settings → Environment Variables → `VITE_API_URL = https://<backend-url>/api`
  → redeploy (env build time-la inline aagudhu, adhala rebuild thevai).
  Backend CORS-la Vercel domain-ah allow panna vendum.
- **Option B:** full stack Docker (`docker compose up --build`) use panni — nginx `/api`
  proxy + `try_files` already set aagirukku, indha issue-e varadhu.

---

### Quick verify in this repo (no Vercel account needed)

```bash
cd frontend && npm install && npm run build
npx serve dist            # no SPA fallback -> /dashboard = 404 (repro)
```

`vercel.json` rewrites apply panna apram `/dashboard` = 200 (index.html) → route render aagum.
