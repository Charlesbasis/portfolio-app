import api from '../lib/api';
import { Skill, ApiResponse } from '../types';

export const skillsService = {
  async getAll(params?: { category?: string; grouped?: boolean }) {
  try {
    const { data } = await api.get<ApiResponse<Skill[]>>('/skills', { params });
    // return data;
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return [];
  }
},
};
