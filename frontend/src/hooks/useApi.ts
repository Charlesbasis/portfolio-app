import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { projectsService, skillsService, testimonialsService, servicesService, contactService } from '../services/api.service';
import { Project, Skill, Testimonial, Service } from '../types';

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
  testimonials: ['testimonials'] as const,
  services: ['services'] as const,
};

// ============= Default Query Options =============
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: false,
  retry: 1,
};

// ============= Projects Hooks =============
export function useProjects(params?: { 
  featured?: boolean; 
  per_page?: number;
  technology?: string;
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
  });
}

export function useFeaturedProjects(limit?: number) {
  return useQuery({
    queryKey: queryKeys.projects.list({ featured: true, per_page: limit }),
    queryFn: () => projectsService.getFeatured(limit),
    ...defaultQueryOptions,
  });
}

// ============= Skills Hooks =============
export function useSkills(params?: { category?: string; grouped?: boolean }) {
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

// ============= Testimonials Hook =============
export function useTestimonials() {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: testimonialsService.getAll,
    ...defaultQueryOptions,
  });
}

// ============= Services Hook =============
export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: servicesService.getAll,
    ...defaultQueryOptions,
  });
}

// ============= Contact Mutation =============
export function useContactSubmit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactService.submit,
    onSuccess: () => {
      // Optionally invalidate or refetch related queries
      console.log('Contact form submitted successfully');
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);
    },
  });
}

// ============= Prefetch Utilities =============
export const prefetchQueries = {
  projects: (queryClient: ReturnType<typeof useQueryClient>) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.projects.lists(),
      queryFn: projectsService.getAll,
    });
  },
  
  skills: (queryClient: ReturnType<typeof useQueryClient>) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.skills.lists(),
      queryFn: skillsService.getAll,
    });
  },
};
