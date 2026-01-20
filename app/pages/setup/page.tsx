'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useCheckUsername, useCreateProfile, useCurrentProfile } from '@/hooks/useProfile';
import { Check, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from "sonner";

export default function Setup() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const createProfile = useCreateProfile();
  const checkUsername = useCheckUsername();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
    if (profile) {
      router.push('/pages/dashboard');
    }
  }, [user, authLoading, profile, router]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (username.length >= 3) {
        setUsernameStatus('checking');
        try {
          const result = await checkUsername.mutateAsync(username);
          setUsernameStatus(result.available ? 'available' : 'taken');
        } catch {
          setUsernameStatus('idle');
        }
      } else {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const formatUsername = (value: string) => {
    return value.toLowerCase().replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usernameStatus !== 'available') {
      toast.error('Username unavailable. Please choose a different username.');
      return;
    }

    if (!fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    try {
      await createProfile.mutateAsync({ username, full_name: fullName.trim() });
      toast.success('Profile created! Welcome to Profolio.');
      router.push('/pages/dashboard');
    } catch (error: any) {
      if (error.message?.includes('taken') || error.message?.includes('duplicate')) {
        toast.error('This username was just claimed. Please try another.');
        setUsernameStatus('taken');
      } else {
        toast.error(error.message || 'Failed to create profile');
      }
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            Claim your profile URL
          </CardTitle>
          <CardDescription className="text-center">
            Choose a username that will be part of your public profile link. This cannot be changed later.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="janedoe"
                  value={username}
                  onChange={(e) => setUsername(formatUsername(e.target.value))}
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {usernameStatus === 'checking' && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {usernameStatus === 'available' && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                  {usernameStatus === 'taken' && (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your profile will be at: <span className="font-medium">profolio.app/{username || 'username'}</span>
              </p>
              {usernameStatus === 'taken' && (
                <p className="text-sm text-destructive">This username is already taken</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={createProfile.isPending || usernameStatus !== 'available' || !fullName.trim()}
            >
              {createProfile.isPending ? 'Creating...' : 'Create my profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}