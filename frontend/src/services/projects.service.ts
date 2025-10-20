import api from '../lib/api';
import { Project, PaginatedResponse } from '../types';

export const projectsService = {
  async getAll(params?: { featured?: boolean; per_page?: number }) {
    try {
      const { data } = await api.get<PaginatedResponse<Project>>('/projects', { params });
      
      // console.log('API Response:', data);
      
      if (data.success && data.data && Array.isArray(data.data.data)) {
        console.log('Projects found:', data.data.data);
        return data.data.data;
      }
      
      console.warn('Unexpected response structure:', data);
      return [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      return [];
    }
  },

  async getBySlug(slug: string) {
    try {
      const { data } = await api.get<{ success: boolean; data: Project }>(`/projects/${slug}`);
      
      // console.log('Project response:', data);
      
      if (data.success && data.data) {
        return data.data;
      }
      
      console.warn('Unexpected response structure:', data);
      return null;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      return null;
    }
  },
};
