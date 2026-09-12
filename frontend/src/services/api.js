import axios from 'axios';

// Uses a relative base URL so requests work in every environment:
// - dev: Vite proxies /api -> http://localhost:8083 (see vite.config.js)
// - production: nginx proxies /api -> backend container (see nginx.conf)
// Override with VITE_API_URL if the API lives somewhere else.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AUTH_TOKEN_KEY = 'token';
export const AUTH_USER_KEY = 'user';

/* ------------------------------------------------------------------ *
 * Session storage helpers
 *
 * Login sessions live in sessionStorage (per browser tab) on purpose:
 *   • a new tab / new browser window always lands on the login page
 *   • refreshing (or restoring) the SAME tab keeps the operator signed in
 * ------------------------------------------------------------------ */

/** Auth token of the current tab, or '' when the tab is not signed in. */
export const readAuthToken = () => {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

/** Signed-in user record of the current tab, or null. */
export const readAuthUser = () => {
  try {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

/** Persists the session for THIS tab only. */
export const writeAuthSession = (data) => {
  try {
    if (data?.token) sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(data || null));
  } catch {
    /* storage unavailable (private mode) — session simply stays in memory */
  }
  return data;
};

/**
 * Drops the session of the current tab. Also wipes the token/user keys from
 * localStorage so a token saved by an older (localStorage) build can never
 * resurrect a session.
 */
export const clearAuthSession = () => {
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  } catch {
    /* ignore */
  }
  purgeLegacyAuthStorage();
};

/**
 * App-load cleanup — removes token/user left in localStorage by previous
 * builds. sessionStorage (the current tab's live session) is untouched, so a
 * refresh stays signed in while every new tab starts at /login.
 */
export function purgeLegacyAuthStorage() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    /* ignore */
  }
}

// Run once when the app boots: kill stale localStorage credentials.
purgeLegacyAuthStorage();

API.interceptors.request.use(
  (config) => {
    const token = readAuthToken();
    if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// If the backend says the token is invalid/expired, send the user back to login
// (but never for a failed login attempt itself).
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isLoginCall = String(error?.config?.url || '').includes('/auth/login');
    const hadSession = Boolean(readAuthToken());
    if (status === 401 && !isLoginCall && hadSession) {
      clearAuthSession();
      if (window.location.pathname !== '/login') {
        // replace() keeps the dead session out of the browser history
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
