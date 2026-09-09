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

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    if (status === 401 && !isLoginCall && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;