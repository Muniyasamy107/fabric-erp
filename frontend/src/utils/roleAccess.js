/**
 * Single source of truth for role → page access.
 *
 * Used by three places so the menu, the router and the login redirect can
 * never drift apart again:
 *   • components/Sidebar/Sidebar.jsx  → which menu entries to render
 *   • App.jsx + routes/ProtectedRoute → URL typing / deep links are blocked
 *   • pages/Auth/Login.jsx            → landing page after a successful login
 */

export const ADMIN_ROLE = 'ADMIN';

/** Every routable page of the mill ERP (keep in sync with App.jsx routes). */
export const ALL_PAGES = [
  '/dashboard',
  '/fabrics',
  '/lookbook',
  '/remnant-clearance',
  '/cad-studio',
  '/planning',
  '/dye-house',
  '/beam-preparation',
  '/loom-matrix',
  '/production',
  '/shift-oee',
  '/costing',
  '/boiler-energy',
  '/finishing',
  '/quality-lab',
  '/etp-sustainability',
  '/roll-packing',
  '/maintenance',
  '/attendance-muster',
  '/biometric',
  '/gate-pass',
  '/exports',
  '/clients',
  '/dispatch',
  '/wages',
  '/day-end-settlement',
  '/stock-ledger',
  '/purchase-orders',
  '/suppliers',
  '/staff',
  '/reports',
];

/**
 * Pages each shop-floor role is allowed to open.
 * ADMIN is granted every page in ALL_PAGES (see getAllowedPages).
 */
export const ROLE_PAGES = {
  SUPERVISOR: [
    '/dashboard',
    '/fabrics',
    '/planning',
    '/beam-preparation',
    '/loom-matrix',
    '/production',
    '/shift-oee',
    '/quality-lab',
    '/maintenance',
    '/attendance-muster',
    '/biometric',
    '/stock-ledger',
  ],
  WEAVER: ['/loom-matrix', '/production', '/shift-oee', '/biometric'],
  DYEING_MASTER: ['/dye-house', '/boiler-energy', '/etp-sustainability', '/quality-lab', '/biometric'],
  FINISHING_MASTER: ['/finishing', '/roll-packing', '/quality-lab', '/biometric'],
  FITTER: ['/maintenance', '/boiler-energy', '/biometric'],
  DISPATCHER: ['/gate-pass', '/dispatch', '/clients', '/stock-ledger', '/biometric'],
};

/** Landing page after login / when a blocked URL is typed. */
export const ROLE_LANDING = {
  ADMIN: '/dashboard',
  SUPERVISOR: '/dashboard',
  WEAVER: '/loom-matrix',
  DYEING_MASTER: '/dye-house',
  FINISHING_MASTER: '/finishing',
  FITTER: '/maintenance',
  DISPATCHER: '/gate-pass',
};

/** Reverse index: page path → roles allowed to open it (ADMIN always included). */
export const PAGE_ROLES = ALL_PAGES.reduce((acc, path) => {
  const staffRoles = Object.keys(ROLE_PAGES).filter((role) => ROLE_PAGES[role].includes(path));
  acc[path] = [ADMIN_ROLE, ...staffRoles];
  return acc;
}, {});

export const normalizeRole = (role) => String(role || '').trim().toUpperCase();

export const isAdminRole = (role) => normalizeRole(role) === ADMIN_ROLE;

/** Roles considered "staff" on the login page (i.e. everything except ADMIN). */
export const isStaffRole = (role) => {
  const normalized = normalizeRole(role);
  return Boolean(normalized) && normalized !== ADMIN_ROLE;
};

export const getAllowedPages = (role) => {
  const normalized = normalizeRole(role);
  if (normalized === ADMIN_ROLE) return [...ALL_PAGES];
  return ROLE_PAGES[normalized] ? [...ROLE_PAGES[normalized]] : [];
};

/** Roles allowed for a page — handy for menus and route guards. */
export const getRolesForPath = (path) => PAGE_ROLES[path] || [ADMIN_ROLE];

export const canAccessPath = (role, path) => {
  if (!path) return false;
  const cleanPath = String(path).split('?')[0].split('#')[0];
  return getAllowedPages(role).includes(cleanPath);
};

/** First page this role may open — '' when the role is unknown (forces logout). */
export const getRoleLanding = (role) => {
  const normalized = normalizeRole(role);
  if (ROLE_LANDING[normalized]) return ROLE_LANDING[normalized];
  return getAllowedPages(normalized)[0] || '';
};

export default {
  ADMIN_ROLE,
  ALL_PAGES,
  ROLE_PAGES,
  ROLE_LANDING,
  PAGE_ROLES,
  normalizeRole,
  isAdminRole,
  isStaffRole,
  getAllowedPages,
  getRolesForPath,
  canAccessPath,
  getRoleLanding,
};
