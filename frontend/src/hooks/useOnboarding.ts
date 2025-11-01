import { useMutation } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { OnboardingData } from '../types';

export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await api.post('/v1/onboarding/complete', data);
      return response.data;
    },
    onSuccess: () => {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  });
}

export function useCheckUsername() {
  return useMutation({
    mutationFn: async (username: string) => {
      const response = await api.get(`/v1/onboarding/check-username/${username}`);
      return response.data;
    }
  });
}
