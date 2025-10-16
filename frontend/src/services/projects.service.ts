import api from '../lib/api';
import { Project, PaginatedResponse } from '../types';

export const projectsService = {
  async getAll(params?: { featured?: boolean; per_page?: number }) {
    try {
      const { data } = await api.get<PaginatedResponse<Project>>('/projects', { params });
      // return data;
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  },

  async getBySlug(slug: string) {
    try {
    const { data } = await api.get<{ success: boolean; data: Project }>(`/projects/${slug}`);
    // return data;
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return [];
  }
},
};
