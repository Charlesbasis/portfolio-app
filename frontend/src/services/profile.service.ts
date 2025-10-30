// frontend/src/services/profile.service.ts

import api, { handleApiRequest } from '../lib/api';
import { extractData } from '../lib/utils';
import {
  UserProfile,
  Experience,
  Education,
  Certification,
  SocialStats,
} from '@/src/types';
import { ApiResponse } from '../types';

export const profileService = {
  /**
   * Get user profile by username (public)
   */
  getByUsername: async (username: string): Promise<UserProfile | null> => {
    const response = await handleApiRequest(
      () => api.get(`/users/${username}/profile`),
      null
    );
    
    if (!response) return null;
    return extractData<UserProfile>(response);
  },

  /**
   * Get current user's profile (authenticated)
   */
  getCurrent: async (): Promise<UserProfile | null> => {
    const response = await handleApiRequest(
      () => api.get('/profile'),
      null
    );
    
    if (!response) return null;
    return extractData<UserProfile>(response);
  },

  /**
   * Update current user's profile
   */
  update: async (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    const { data: responseData } = await api.put('/profile', data);
    return responseData;
  },

  /**
   * Upload profile avatar
   */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatar_url: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const { data } = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Upload cover image
   */
  uploadCoverImage: async (file: File): Promise<ApiResponse<{ cover_image_url: string }>> => {
    const formData = new FormData();
    formData.append('cover_image', file);
    
    const { data } = await api.post('/profile/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get social stats for user
   */
  getStats: async (username: string): Promise<SocialStats | null> => {
    const response = await handleApiRequest(
      () => api.get(`/users/${username}/stats`),
      {
        total_projects: 0,
        total_skills: 0,
        years_experience: 0,
        happy_clients: 0,
        profile_views: 0,
      }
    );    
    
    return extractData<SocialStats>(response);
  },
};

export const experienceService = {
  /**
   * Get experiences by username (public)
   */
  getByUsername: async (username: string): Promise<Experience[]> => {
    const response = await handleApiRequest(
      () => api.get(`/users/${username}/experiences`),
      []
    );
    
    const extracted = extractData<Experience[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  /**
   * Get current user's experiences
   */
  getAll: async (): Promise<Experience[]> => {
    const response = await handleApiRequest(
      () => api.get('/experiences'),
      []
    );
    
    const extracted = extractData<Experience[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  /**
   * Create experience
   */
  create: async (data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
    const { data: responseData } = await api.post('/experiences', data);
    return responseData;
  },

  /**
   * Update experience
   */
  update: async (id: number, data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
    const { data: responseData } = await api.put(`/experiences/${id}`, data);
    return responseData;
  },

  /**
   * Delete experience
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/experiences/${id}`);
    return data;
  },
};

export const educationService = {
  /**
   * Get education by username (public)
   */
  getByUsername: async (username: string): Promise<Education[]> => {
    const response = await handleApiRequest(
      () => api.get(`/users/${username}/education`),
      []
    );
    
    const extracted = extractData<Education[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  /**
   * Get current user's education
   */
  getAll: async (): Promise<Education[]> => {
    const response = await handleApiRequest(
      () => api.get('/education'),
      []
    );
    
    const extracted = extractData<Education[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  /**
   * Create education
   */
  create: async (data: Partial<Education>): Promise<ApiResponse<Education>> => {
    const { data: responseData } = await api.post('/education', data);
    return responseData;
  },

  /**
   * Update education
   */
  update: async (id: number, data: Partial<Education>): Promise<ApiResponse<Education>> => {
    const { data: responseData } = await api.put(`/education/${id}`, data);
    return responseData;
  },

  /**
   * Delete education
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/education/${id}`);
    return data;
  },
};

export const certificationService = {
  /**
   * Get certifications by username (public)
   */
  getByUsername: async (username: string): Promise<Certification[]> => {
    const response = await handleApiRequest(
      () => api.get(`/users/${username}/certifications`),
      []
    );
    
    const extracted = extractData<Certification[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  /**
   * Get current user's certifications
   */
  getAll: async (): Promise<Certification[]> => {
    const response = await handleApiRequest(
      () => api.get('/certifications'),
      []
    );
    
    const extracted = extractData<Certification[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  /**
   * Create certification
   */
  create: async (data: Partial<Certification>): Promise<ApiResponse<Certification>> => {
    const { data: responseData } = await api.post('/certifications', data);
    return responseData;
  },

  /**
   * Update certification
   */
  update: async (id: number, data: Partial<Certification>): Promise<ApiResponse<Certification>> => {
    const { data: responseData } = await api.put(`/certifications/${id}`, data);
    return responseData;
  },

  /**
   * Delete certification
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/certifications/${id}`);
    return data;
  },
};
