import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompleteOnboarding, useCheckUsername } from './useApi';
import { OnboardingData } from '@/src/types';
import { getErrorMessage } from '@/src/lib/api';

interface UsernameCheckState {
  checking: boolean;
  available: boolean | null;
  message: string;
}

export const useOnboarding = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [debouncedUsername, setDebouncedUsername] = useState('');
  
  const completeOnboardingMutation = useCompleteOnboarding();

  // Use the React Query hook for username checking
  const { 
    data: usernameData, 
    isLoading: isCheckingUsername,
    error: usernameError 
  } = useCheckUsername(debouncedUsername, debouncedUsername.length >= 3);

  // Debounce username input
  const checkUsername = (username: string) => {
    setDebouncedUsername(username);
  };

  // Format username check state
  const usernameCheck: UsernameCheckState = {
    checking: isCheckingUsername,
    available: usernameData?.available ?? null,
    message: usernameError 
      ? 'Error checking username'
      : usernameData?.available 
        ? 'Username is available!' 
        : usernameData?.available === false
          ? 'Username is already taken'
          : ''
  };

  /**
   * Complete onboarding
   */
  const completeOnboarding = async (data: OnboardingData) => {
    setError(null);

    try {
      // Validate required fields
      if (!data.full_name || !data.username) {
        throw new Error('Full name and username are required');
      }

      const response = await completeOnboardingMutation.mutateAsync(data);

      // Redirect to dashboard or portfolio
      if (response.success) {
        router.push('/dashboard');
      }

      return response;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  };

  return {
    isSubmitting: completeOnboardingMutation.isPending,
    error,
    usernameCheck,
    checkUsername,
    completeOnboarding,
  };
};
