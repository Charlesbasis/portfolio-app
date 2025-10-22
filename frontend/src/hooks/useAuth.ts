'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager } from '../lib/api';
import { User } from '../types';
import { authService } from '../services/api.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
        const { user, token } = await authService.login({ email, password });
        tokenManager.set(token);
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          tokenManager.remove();
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
