'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
    if (!authLoading && user && !profileLoading && !profile) {
      router.push('/pages/setup');
    }
  }, [user, authLoading, profile, profileLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Edit your profile</h1>
          <p className="text-muted-foreground mt-1">
            Your profile is visible at{' '}
            <Link href={`/${profile.username}`} className="text-primary hover:underline">
              profolio.app/{profile.username}
            </Link>
          </p>
        </div>

        <ProfileEditor profile={profile} />
      </main>
    </div>
  );
}