'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';

export default function AuthDebug() {
  const auth = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔍 Auth State:', {
        isAuthenticated: auth.isAuthenticated,
        isInitialized: auth.isInitialized,
        isLoading: auth.isLoading,
        hasUser: !!auth.user,
        userName: auth.user?.name,
        hasToken: !!auth.token,
        tokenPreview: auth.token ? auth.token.substring(0, 20) + '...' : null,
        onboardingCompleted: auth.user?.onboarding_completed,
        error: auth.error,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [auth]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50 shadow-2xl">
      <div className="font-bold mb-2 text-green-400">Auth Debug</div>
      <div className="space-y-1">
        <div>Initialized: {auth.isInitialized ? '✅' : '❌'}</div>
        <div>Authenticated: {auth.isAuthenticated ? '✅' : '❌'}</div>
        <div>Loading: {auth.isLoading ? '⏳' : '✅'}</div>
        <div>User: {auth.user?.name || 'None'}</div>
        <div>Token: {auth.token ? '✅' : '❌'}</div>
        <div>Onboarding: {auth.user?.onboarding_completed ? '✅' : '❌'}</div>
        {auth.error && <div className="text-red-400">Error: {auth.error}</div>}
      </div>
    </div>
  );
}
