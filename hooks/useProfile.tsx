'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from "sonner";
import * as actions from '@/app/actions/profile';
import { Profile, Skill, Experience, Project } from '@/lib/types';

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
    mutationFn: async ({ id, ...updates }: Partial<Profile> & { id: string | number }) => {
      return await actions.updateProfile(id.toString(), updates) as unknown as Profile;
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

export function useProfileSkills(profileId: string | number | undefined) {
  return useQuery({
    queryKey: ['skills', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      return await actions.getSkills(profileId.toString()) as unknown as Skill[];
    },
    enabled: !!profileId,
  });
}

export function useProfileExperiences(profileId: string | number | undefined) {
  return useQuery({
    queryKey: ['experiences', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      return await actions.getExperiences(profileId.toString()) as unknown as Experience[];
    },
    enabled: !!profileId,
  });
}

export function useProfileProjects(profileId: string | number | undefined) {
  return useQuery({
    queryKey: ['projects', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      return await actions.getProjects(profileId.toString()) as unknown as Project[];
    },
    enabled: !!profileId,
  });
}

// Skills mutations
export function useAddSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profile_id, skill_name }: { profile_id: string | number; skill_name: string }) => {
      return await actions.addSkill(profile_id.toString(), skill_name) as unknown as Skill;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['skills', data.profile_id] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profile_id }: { id: string | number; profile_id: string | number }) => {
      await actions.deleteSkill(id.toString());
      return { profile_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['skills', data.profile_id] });
    },
  });
}

// Experience mutations
export function useAddExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
      return await actions.addExperience(experience) as unknown as Experience;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiences', data.profile_id] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Experience> & { id: string | number; profile_id: string | number }) => {
      return await actions.updateExperience(id.toString(), updates) as unknown as Experience;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiences', data.profile_id] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profile_id }: { id: string | number; profile_id: string | number }) => {
      await actions.deleteExperience(id.toString());
      return { profile_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiences', data.profile_id] });
    },
  });
}

// Project mutations
export function useAddProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      return await actions.addProject(project) as unknown as Project;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.profile_id] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string | number; profile_id: string | number }) => {
      return await actions.updateProject(id.toString(), updates) as unknown as Project;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.profile_id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profile_id }: { id: string | number; profile_id: string | number }) => {
      await actions.deleteProject(id.toString());
      return { profile_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.profile_id] });
    },
  });
}