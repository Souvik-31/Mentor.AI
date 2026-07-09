import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../utils/api';

interface User {
  _id: string;
  displayName: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Silent refresh and load user on boot
  useEffect(() => {
    const bootAuth = async () => {
      try {
        // Attempt to perform silent token refresh
        const refreshRes = await api.post('/api/auth/refresh');
        setAccessToken(refreshRes.data.accessToken);

        // Fetch current user details
        const res = await api.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        setAccessToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const res = await api.post('/api/auth/register', { email, password, displayName });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setAccessToken('');
    setUser(null);
  };

  const loginWithToken = async (token: string) => {
    setAccessToken(token);
    const res = await api.get('/api/auth/me');
    setUser(res.data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
