import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { login as loginRequest, register as registerRequest } from '../services/authService.js';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'notes_access_token';

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [theme, setTheme] = useState(() => localStorage.getItem('notes_theme') || 'light');

  const user = useMemo(() => {
    if (!token) {
      return null;
    }

    const payload = decodeJwtPayload(token);
    return payload?.userId ? { id: payload.userId } : null;
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    return response;
  }, []);

  const register = useCallback(async (payload) => {
    return registerRequest(payload);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('notes:unauthorized', handleUnauthorized);

    return () => window.removeEventListener('notes:unauthorized', handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('notes_theme', theme);
  }, [theme]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    theme,
    toggleTheme
  }), [token, user, login, register, logout, theme, toggleTheme]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
