import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('it_helpdesk_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('it_helpdesk_token');
      if (storedToken) {
        try {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
          setToken(storedToken);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const data = await authService.login({
      username_or_email: usernameOrEmail,
      password: password,
    });
    localStorage.setItem('it_helpdesk_token', data.access_token);
    localStorage.setItem('it_helpdesk_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setCurrentUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    localStorage.removeItem('it_helpdesk_token');
    localStorage.removeItem('it_helpdesk_user');
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: !!token && !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isTechnician: currentUser?.role === 'technician' || currentUser?.role === 'admin',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}