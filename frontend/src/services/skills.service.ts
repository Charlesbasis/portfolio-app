import api from '../lib/api';
import { Skill, ApiResponse } from '@/types';

export const skillsService = {
  async getAll(params?: { category?: string; grouped?: boolean }) {
    const { data } = await api.get<ApiResponse<Skill[]>>('/skills', { params });
    return data;
  },
};
