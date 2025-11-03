'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isInitialized, user } = useAuth();

  useEffect(() => {
    // Don't redirect until auth is initialized
    if (!isInitialized) {
      console.log('⏳ ProtectedRoute: Waiting for auth initialization...');
      return;
    }

    if (!isAuthenticated) {
      console.log('🔒 ProtectedRoute: Not authenticated, redirecting to login');
      router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    console.log('✅ ProtectedRoute: User authenticated:', {
      user: user?.name,
      onboarding: user?.onboarding_completed,
      pathname
    });
  }, [isAuthenticated, isInitialized, router, pathname, user]);

  // Show loading while checking auth or redirecting
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
