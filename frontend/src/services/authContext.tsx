'use client'

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from './api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<any>; // Promise<void>
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>('/login', { username, password });
      const { token, user } = response.data;

      setUser(user);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return true;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);

    delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // TODO: fetch user data
      setUser({ id: 1, username: 'admin', email: '' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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