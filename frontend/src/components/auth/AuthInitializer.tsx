'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized, initialize, isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isInitialized) {
      console.log('🔐 Initializing authentication...');
      initialize();
    }
  }, [mounted, isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized) {
      console.log('✅ Auth initialized:', { 
        isAuthenticated, 
        user: user?.name,
        onboarding: user?.onboarding_completed 
      });
    }
  }, [isInitialized, isAuthenticated, user]);

  // Don't render anything on server
  if (!mounted) {
    return null;
  }

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
