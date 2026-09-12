import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginApi, registerApi } from '../services/authService';
import {
  clearAuthSession,
  purgeLegacyAuthStorage,
  readAuthToken,
  readAuthUser,
  writeAuthSession,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // App load: wipe any token/user an older build stored in localStorage, so a
  // freshly opened tab can never pick up a session that belongs to another tab.
  useEffect(() => {
    purgeLegacyAuthStorage();
  }, []);

  // sessionStorage → survives a refresh of the same tab, but a new tab or a
  // new browser window always starts signed out (login page).
  const [token, setToken] = useState(() => readAuthToken() || null);
  const [user, setUser] = useState(() => readAuthUser());

  const persistSession = (data) => {
    writeAuthSession(data);
    setToken(data?.token || null);
    setUser(data || null);
    return data;
  };

  const login = async (username, password) => {
    const res = await loginApi(username, password);
    return persistSession(res.data);
  };

  const register = async (fullName, username, password) => {
    const res = await registerApi(fullName, username, password);
    return persistSession(res.data);
  };

  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
