// frontend/src/hooks/useProfile.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  profileService,
  experienceService,
  educationService,
  certificationService,
} from '../services/profile.service';
import {
  UserProfile,
  Experience,
  Education,
  Certification,
  SocialStats,
} from '@/src/types';

// ============= Query Keys =============
export const profileQueryKeys = {
  all: ['profile'] as const,
  byUsername: (username: string) => [...profileQueryKeys.all, 'user', username] as const,
  current: () => [...profileQueryKeys.all, 'current'] as const,
  stats: (username: string) => [...profileQueryKeys.all, 'stats', username] as const,
  
  experiences: {
    all: ['experiences'] as const,
    byUsername: (username: string) => [...profileQueryKeys.experiences.all, username] as const,
    current: () => [...profileQueryKeys.experiences.all, 'current'] as const,
  },
  
  education: {
    all: ['education'] as const,
    byUsername: (username: string) => [...profileQueryKeys.education.all, username] as const,
    current: () => [...profileQueryKeys.education.all, 'current'] as const,
  },
  
  certifications: {
    all: ['certifications'] as const,
    byUsername: (username: string) => [...profileQueryKeys.certifications.all, username] as const,
    current: () => [...profileQueryKeys.certifications.all, 'current'] as const,
  },
};

// ============= Default Options =============
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: false,
  retry: 1,
};

// ============= Profile Hooks =============

/**
 * Get user profile by username (public)
 */
export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: profileQueryKeys.byUsername(username),
    queryFn: () => profileService.getByUsername(username),
    ...defaultQueryOptions,
    enabled: !!username,
  });
}

/**
 * Get current user's profile (authenticated)
 */
export function useCurrentProfile() {
  return useQuery({
    queryKey: profileQueryKeys.current(),
    queryFn: () => profileService.getCurrent(),
    ...defaultQueryOptions,
  });
}

/**
 * Get user stats
 */
export function useUserStats(username: string) {
  return useQuery({
    queryKey: profileQueryKeys.stats(username),
    queryFn: () => profileService.getStats(username),
    ...defaultQueryOptions,
    enabled: !!username,
  });
}

/**
 * Update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => profileService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
    },
  });
}

/**
 * Upload avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
    },
  });
}

/**
 * Upload cover image
 */
export function useUploadCoverImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadCoverImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
    },
  });
}

/**
 * Delete avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
    },
  });
}

/**
 * Delete cover image
 */
export function useDeleteCoverImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.deleteCoverImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.current() });
    },
  });
}

// ============= Experience Hooks =============

/**
 * Get experiences by username (public)
 */
export function usePublicExperiences(username: string) {
  return useQuery({
    queryKey: profileQueryKeys.experiences.byUsername(username),
    queryFn: () => experienceService.getByUsername(username),
    ...defaultQueryOptions,
    enabled: !!username,
  });
}

/**
 * Get current user's experiences
 */
export function useExperiences() {
  return useQuery({
    queryKey: profileQueryKeys.experiences.current(),
    queryFn: () => experienceService.getAll(),
    ...defaultQueryOptions,
  });
}

/**
 * Create experience
 */
export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Experience>) => experienceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.experiences.current() });
    },
  });
}

/**
 * Update experience
 */
export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Experience> }) =>
      experienceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.experiences.current() });
    },
  });
}

/**
 * Delete experience
 */
export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => experienceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.experiences.current() });
    },
  });
}

// ============= Education Hooks =============

/**
 * Get education by username (public)
 */
export function usePublicEducation(username: string) {
  return useQuery({
    queryKey: profileQueryKeys.education.byUsername(username),
    queryFn: () => educationService.getByUsername(username),
    ...defaultQueryOptions,
    enabled: !!username,
  });
}

/**
 * Get current user's education
 */
export function useEducation() {
  return useQuery({
    queryKey: profileQueryKeys.education.current(),
    queryFn: () => educationService.getAll(),
    ...defaultQueryOptions,
  });
}

// Similar CRUD mutations for education...
export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Education>) => educationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.education.current() });
    },
  });
}

// ============= Certification Hooks =============

/**
 * Get certifications by username (public)
 */
export function usePublicCertifications(username: string) {
  return useQuery({
    queryKey: profileQueryKeys.certifications.byUsername(username),
    queryFn: () => certificationService.getByUsername(username),
    ...defaultQueryOptions,
    enabled: !!username,
  });
}

/**
 * Get current user's certifications
 */
export function useCertifications() {
  return useQuery({
    queryKey: profileQueryKeys.certifications.current(),
    queryFn: () => certificationService.getAll(),
    ...defaultQueryOptions,
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Certification>) => certificationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.certifications.current() });
    },
  });
}
