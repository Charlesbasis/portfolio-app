import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { AccountUpdateData, PasswordUpdateData, PrivacySettings } from '../types';

// Query Keys
export const settingsQueryKeys = {
  all: ['settings'] as const,
  activity: ['settings', 'activity'] as const,
};

const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 1,
};

/**
 * Get all settings
 */
export function useSettings() {
  return useQuery({
    queryKey: settingsQueryKeys.all,
    queryFn: () => settingsService.getAll(),
    ...defaultQueryOptions,
  });
}

/**
 * Get activity log
 */
export function useActivityLog() {
  return useQuery({
    queryKey: settingsQueryKeys.activity,
    queryFn: () => settingsService.getActivityLog(),
    ...defaultQueryOptions,
  });
}

/**
 * Update account
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountUpdateData) => settingsService.updateAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
    },
  });
}

/**
 * Update password
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: PasswordUpdateData) => settingsService.updatePassword(data),
  });
}

/**
 * Update privacy settings
 */
export function useUpdatePrivacy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrivacySettings) => settingsService.updatePrivacy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
    },
  });
}

/**
 * Delete avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsService.deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
    },
  });
}

/**
 * Delete cover image
 */
export function useDeleteCoverImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsService.deleteCoverImage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
    },
  });
}

/**
 * Delete account
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => settingsService.deleteAccount(password),
  });
}
