"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn as apiSignIn, signOut as apiSignOut, signUp as apiSignUp, getCurrentUser } from '@/app/actions/auth';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await apiSignIn(email, password);
    if (!result.error) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    return result;
  };

  const signUp = async (name: string, email: string, password: string) => {
    const result = await apiSignUp(name, email, password);
    if (!result.error) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    return result;
  };

  const signOut = async () => {
    await apiSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}