'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenManager } from '../lib/api';
import { RegisterData, User } from '../types';
import { authService } from '../services/api.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // NEW: Track if auth has been initialized
  
  login: (email: string, password: string) => Promise<{ 
    user: User; 
    needs_onboarding: boolean;
    token: string;
  }>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>; // NEW: Initialize auth on app load
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      // NEW: Initialize authentication state
      initialize: async () => {
        const token = get().token;
        
        if (!token) {
          set({ isInitialized: true, isLoading: false });
          return;
        }

        set({ isLoading: true });
        
        try {
          const user = await authService.getCurrentUser();
          
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isInitialized: true,
              isLoading: false 
            });
          } else {
            // Token is invalid
            tokenManager.remove();
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false, 
              isInitialized: true,
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          tokenManager.remove();
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isInitialized: true,
            isLoading: false 
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          const { user, token, needs_onboarding } = response;

          // Set token in both store and tokenManager
          tokenManager.set(token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isInitialized: true // Mark as initialized after successful login
          });

          console.log('✅ Login successful:', { user, needs_onboarding });

          // Return the data for the component to use
          return { user, needs_onboarding, token };
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw new Error(errorMessage);
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authService.register(data);
          tokenManager.set(token);
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
            isInitialized: true 
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          tokenManager.remove();
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        }
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, user: null, isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              isInitialized: true 
            });
          } else {
            // Token is invalid
            tokenManager.remove();
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false, 
              isLoading: false,
              isInitialized: true 
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          tokenManager.remove();
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true 
          });
        }
      },

      setUser: (user) => set({ user }),
      
      setToken: (token) => {
        if (token) {
          tokenManager.set(token);
        } else {
          tokenManager.remove();
        }
        set({ token, isAuthenticated: !!token });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // NEW: Load token from storage on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Initialize auth after rehydration
          state.initialize();
        }
      },
    }
  )
);
