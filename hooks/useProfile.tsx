'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from "sonner";
import * as actions from '@/app/actions/profile';

export interface Profile {
  id: number;
  user_id: string;
  username: string;
  full_name: string;
  role: string;
  location: string | null;
  headline: string | null;
  summary: string | null;
  contact_email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useCurrentProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await actions.getCurrentProfile() as unknown as Profile | null;
    },
    enabled: !!user,
  });
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ['public-profile', username],
    queryFn: async () => {
      return await actions.getPublicProfile(username) as unknown as Profile | null;
    },
    enabled: !!username,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ username, full_name }: { username: string; full_name: string }) => {
      if (!user) throw new Error('Not authenticated');
      return await actions.createProfile({ username, full_name }) as unknown as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Profile> & { id: string }) => {
      return await actions.updateProfile(id, updates) as unknown as Profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile', data.username] });
      toast.success('Profile updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useCheckUsername() {
  return useMutation({
    mutationFn: async (username: string) => {
      return await actions.checkUsername(username);
    },
  });
}

// Skills, Experience, and Project hooks remain but would need similar action implementations if they were used.
// For now focusing on what is needed for the Setup page.
