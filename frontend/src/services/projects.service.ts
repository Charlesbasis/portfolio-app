import api from '../lib/api';
import { Project, PaginatedResponse } from '../types';

export const projectsService = {
  async getAll(params?: { featured?: boolean; per_page?: number }) {
    const { data } = await api.get<PaginatedResponse<Project>>('/projects', { params });
    return data;
  },

  async getBySlug(slug: string) {
    const { data } = await api.get<{ success: boolean; data: Project }>(`/projects/${slug}`);
    return data;
  },
};
