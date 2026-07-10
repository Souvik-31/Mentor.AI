import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  // Track if loginWithToken is in progress so bootAuth doesn't clobber it
  const oauthInProgress = useRef(false);

  // Silent refresh and load user on boot
  useEffect(() => {
    const bootAuth = async () => {
      // If OAuth login is already handling auth, skip the silent refresh
      if (oauthInProgress.current) return;
      try {
        // Attempt to perform silent token refresh
        const refreshRes = await api.post('/api/auth/refresh');
        setAccessToken(refreshRes.data.accessToken);

        // Fetch current user details
        const res = await api.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        // Only clear if oauth hasn't already set the user
        if (!oauthInProgress.current) {
          setAccessToken('');
          setUser(null);
        }
      } finally {
        if (!oauthInProgress.current) {
          setLoading(false);
        }
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
    // Signal to bootAuth that OAuth is handling login — don't interfere
    oauthInProgress.current = true;
    setLoading(true);
    try {
      setAccessToken(token);
      const res = await api.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      setAccessToken('');
      setUser(null);
      throw err;
    } finally {
      oauthInProgress.current = false;
      setLoading(false);
    }
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
