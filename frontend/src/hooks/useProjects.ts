'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Project, PaginatedResponse } from '@/types';
import api from '../lib/api';
import { PaginatedResponse } from '../types';
// import api from '@/api';

export const useProjects = (page = 1, featured = false) => {
  return useQuery<PaginatedResponse>({
    queryKey: ['projects', page, featured],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(featured && { featured: 'true' }),
      });
      const response = await api.get(`/projects?${params}`);
      return response.data;
    },
  });
};

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const response = await api.get(`/projects/${slug}`);
      return response.data.data;
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post('/admin/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
