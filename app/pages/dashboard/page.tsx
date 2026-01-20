'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, LogOut } from 'lucide-react';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
    if (!authLoading && user && !profileLoading && !profile) {
      router.push('/pages/setup');
    }
  }, [user, authLoading, profile, profileLoading, router.push]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

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
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Profolio
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${profile.username}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                View public profile
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
