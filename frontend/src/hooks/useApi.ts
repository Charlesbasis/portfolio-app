import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import api, { 
  projectsService, 
  skillsService, 
  testimonialsService, 
  servicesService, 
  contactService,
  experienceService,
  onboardingService,
} from '../services/api.service';
import { Project, Skill, Testimonial, Service, ContactFormData, OnboardingData, UserTypeFromAPI } from '../types';

// ============= Query Keys =============
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.projects.details(), slug] as const,
  },
  skills: {
    all: ['skills'] as const,
    lists: () => [...queryKeys.skills.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.skills.lists(), filters] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.testimonials.all, filters] as const,
  },
  services: {
    all: ['services'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.services.all, filters] as const,
  },
  experiences: {
    all: ['experiences'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.experiences.all, filters] as const,
  },
  onboarding: {
    all: ['onboarding'] as const,
    status: () => [...queryKeys.onboarding.all, 'status'] as const,
    checkUsername: (username: string) => [...queryKeys.onboarding.all, 'username', username] as const,
  },
};

// ============= Default Query Options =============
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime in v4)
  refetchOnWindowFocus: false,
  retry: 1,
};

// ============= Projects Hooks =============
export function useProjects(params?: { 
  featured?: boolean; 
  per_page?: number;
  page?: number;
  technology?: string;
  user_id?: number;
}) {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => projectsService.getAll(params),
    ...defaultQueryOptions,
  });
}

export function useProject(slug: string, options?: Partial<UseQueryOptions<Project | null>>) {
  return useQuery({
    queryKey: queryKeys.projects.detail(slug),
    queryFn: () => projectsService.getBySlug(slug),
    ...defaultQueryOptions,
    enabled: !!slug,
    ...options,
  } as any);
}

export function useFeaturedProjects(limit?: number) {
  return useQuery({
    queryKey: queryKeys.projects.list({ featured: true, per_page: limit }),
    queryFn: () => projectsService.getFeatured(limit),
    ...defaultQueryOptions,
  });
}

// ============= Skills Hooks =============
export function useSkills(params?: { 
  category?: string; 
  grouped?: boolean;
  user_id?: number;
}) {
  return useQuery({
    queryKey: queryKeys.skills.list(params),
    queryFn: () => skillsService.getAll(params),
    ...defaultQueryOptions,
  });
}

export function useSkillsByCategory(category: string) {
  return useQuery({
    queryKey: queryKeys.skills.list({ category }),
    queryFn: () => skillsService.getByCategory(category),
    ...defaultQueryOptions,
    enabled: !!category,
  });
}

export function useGroupedSkills() {
  return useQuery({
    queryKey: queryKeys.skills.list({ grouped: true }),
    queryFn: () => skillsService.getGrouped(),
    ...defaultQueryOptions,
  });
}

// ============= Testimonials Hook =============
export function useTestimonials(params?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.testimonials.list(params),
    queryFn: () => testimonialsService.getAll(params),
    ...defaultQueryOptions,
  });
}

// ============= Services Hook =============
export function useServices(params?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.services.list(params),
    queryFn: () => servicesService.getAll(params),
    ...defaultQueryOptions,
  });
}

// ============= Experiences Hook =============
export function useExperiences(params?: { user_id?: number; current?: boolean }) {
  return useQuery({
    queryKey: queryKeys.experiences.list(params),
    queryFn: () => experienceService.getAll(params),
    ...defaultQueryOptions,
  });
}

// ============= Mutation Hooks =============

// Contact form submission
export function useContactSubmit() {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactService.submit(data),
    onSuccess: (data) => {
      console.log('Contact form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);
    },
  });
}

// Project mutations
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => projectsService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      projectsService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => projectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

// Skill mutations
export function useCreateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Skill>) => skillsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Skill> }) => 
      skillsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => skillsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
    },
  });
}

// ============= Prefetch Utilities =============
export const prefetchQueries = {
  projects: async (queryClient: ReturnType<typeof useQueryClient>, params?: any) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.projects.list(params),
      queryFn: () => projectsService.getAll(params),
    });
  },
  
  skills: async (queryClient: ReturnType<typeof useQueryClient>, params?: any) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.skills.list(params),
      queryFn: () => skillsService.getAll(params),
    });
  },

  testimonials: async (queryClient: ReturnType<typeof useQueryClient>, params?: any) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.testimonials.list(params),
      queryFn: () => testimonialsService.getAll(params),
    });
  },

  services: async (queryClient: ReturnType<typeof useQueryClient>, params?: any) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.services.list(params),
      queryFn: () => servicesService.getAll(params),
    });
  },
};

// ============= Onboarding Hooks =============

/**
 * Get onboarding status
 */
export function useOnboardingStatus() {
  return useQuery({
    queryKey: queryKeys.onboarding.status(),
    queryFn: () => onboardingService.getStatus(),
    staleTime: 0, // Always fetch fresh
    gcTime: 0, // Don't cache
  });
}

/**
 * Check username availability
 */
export function useCheckUsername(username: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.onboarding.checkUsername(username),
    queryFn: () => onboardingService.checkUsername(username),
    enabled: enabled && !!username && username.length >= 3,
    staleTime: 30 * 1000, // Cache for 30 seconds
    retry: false,
  });
}

/**
 * Complete onboarding mutation
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: OnboardingData) => onboardingService.complete(data),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.all });
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Assuming you have a user query
      
      console.log('✅ Onboarding completed successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Onboarding failed:', error);
    },
  });
}

export const useUserTypes = () => {
  return useQuery({
    queryKey: ['user-types'],
    queryFn: async () => {
      const response = await api.get('/user-types');
      return response.data.data as UserTypeFromAPI[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
