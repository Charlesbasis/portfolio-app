'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import api from '@/lib/api';
// import { User } from '@/types';
import api from '../lib/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise;
  logout: () => Promise;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuth = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post('/login', { email, password });
        const { user, token } = response.data.data;
        
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await api.post('/logout');
        } finally {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
