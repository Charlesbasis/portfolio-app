import { useMemo } from 'react';
import { useUserTypes } from './useApi';
import { buildUserTypeConfig } from '@/src/config/userTypeBuilder';
import { FALLBACK_USER_TYPES } from '@/src/config';
import { UserTypeConfig } from '@/src/types';

/**
 * Hook to get user type configurations
 * 
 * This hook fetches user types from the API and transforms them into
 * frontend-friendly configurations. Falls back to local config if API fails.
 * 
 * @param userTypeSlug - Optional slug to get specific user type config
 * @returns User type configurations and loading states
 */
export const useUserTypeConfig = (userTypeSlug?: string) => {
  const { 
    data: apiUserTypes, 
    isLoading, 
    error,
    isError,
  } = useUserTypes();

  /**
   * Transform API user types to frontend configs
   * Falls back to local config if API is unavailable
   */
  const userTypeConfigs = useMemo<UserTypeConfig[]>(() => {
    // If API data is available, use it
    if (apiUserTypes && apiUserTypes.length > 0) {
      return apiUserTypes.map(apiType => buildUserTypeConfig(apiType));
    }

    // Fallback to local configuration
    if (isError) {
      console.warn('Failed to load user types from API, using fallback configuration');
      return Object.values(FALLBACK_USER_TYPES);
    }

    // Still loading
    return [];
  }, [apiUserTypes, isError]);

  /**
   * Get configuration for specific user type
   */
  const currentConfig = useMemo<UserTypeConfig | null>(() => {
    if (!userTypeSlug) return null;
    
    const config = userTypeConfigs.find(
      config => config.value === userTypeSlug
    );
    
    return config || null;
  }, [userTypeConfigs, userTypeSlug]);

  /**
   * Check if using fallback configuration
   */
  const isFallback = useMemo(() => {
    return isError || (!isLoading && (!apiUserTypes || apiUserTypes.length === 0));
  }, [isError, isLoading, apiUserTypes]);

  return {
    /** All available user type configurations */
    userTypes: userTypeConfigs,
    
    /** Configuration for the specified user type slug */
    currentConfig,
    
    /** Whether configurations are loading */
    isLoading,
    
    /** API error if any */
    error,
    
    /** Whether using fallback configuration */
    isFallback,
    
    /** Helper to get config by slug */
    getConfig: (slug: string) => userTypeConfigs.find(c => c.value === slug) || null,
    
    /** Helper to check if a user type exists */
    hasUserType: (slug: string) => userTypeConfigs.some(c => c.value === slug),
  };
};

/**
 * Hook to get available user type options (for selection UI)
 */
export const useUserTypeOptions = () => {
  const { userTypes, isLoading, isFallback } = useUserTypeConfig();

  const options = useMemo(() => {
    return userTypes.map(type => ({
      value: type.value,
      label: type.label,
      description: type.description,
      color: type.color,
      icon: type.icon,
    }));
  }, [userTypes]);

  return {
    options,
    isLoading,
    isFallback,
  };
};

/**
 * Hook to get skills for a specific user type
 */
export const useUserTypeSkills = (userTypeSlug?: string) => {
  const { currentConfig, isLoading } = useUserTypeConfig(userTypeSlug);

  const skills = useMemo(() => {
    if (!currentConfig) return { primary: [], secondary: [], suggested: [], all: [] };

    const { primary, secondary, suggested } = currentConfig.skills;

    return {
      primary,
      secondary,
      suggested,
      all: [...primary, ...secondary, ...suggested],
    };
  }, [currentConfig]);

  return {
    skills,
    isLoading,
  };
};
