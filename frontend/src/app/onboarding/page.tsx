'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import OnboardingWizard from '@/src/components/onboarding/OnboardingWizard';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) {
      console.log('⏳ Onboarding page: Waiting for auth initialization...');
      return;
    }

    if (!isLoading && !user) {
      console.log('🔒 Onboarding page: No user, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    // If onboarding already completed, redirect to dashboard
    if (user?.onboarding_completed === true || user?.onboarding_completed === 1) {
      console.log('✅ Onboarding already completed, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    console.log('📝 Onboarding page: Showing wizard for user:', user?.name);
  }, [user, isLoading, isInitialized, router]);

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  // Don't show wizard if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Don't show wizard if onboarding is already completed
  if (user.onboarding_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show the wizard
  return <OnboardingWizard />;
}
