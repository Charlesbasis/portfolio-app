'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import Sidebar from '@/src/components/layout/Sidebar';
import { useAuth } from '@/src/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check after auth is initialized and not loading
    if (!isInitialized || isLoading) {
      console.log('⏳ Dashboard layout waiting for auth...');
      return;
    }

    // If no user, ProtectedRoute will handle redirect
    if (!user) {
      console.log('❌ No user in dashboard layout');
      return;
    }

    // Check onboarding status
    console.log('🔍 Checking onboarding status:', {
      user: user.name,
      onboarding_completed: user.onboarding_completed
    });

    if (!user.onboarding_completed) {
      console.log('⚠️ Onboarding not completed, redirecting...');
      router.push('/onboarding');
    }
  }, [user, isLoading, isInitialized, router]);

  // Show loading while initializing or checking
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if user hasn't completed onboarding
  if (user && !user.onboarding_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-0 lg:ml-64">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
