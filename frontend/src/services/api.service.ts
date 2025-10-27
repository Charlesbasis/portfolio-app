import api, { handleApiRequest } from '../lib/api';
import { 
  Project, 
  Skill, 
  Testimonial, 
  Service, 
  PaginatedResponse,
  ApiResponse 
} from '../types';

// ============= Projects Service =============
export const projectsService = {
  getAll: async (params?: { 
    featured?: boolean; 
    per_page?: number;
    technology?: string;
  }): Promise<Project[]> => {
    return handleApiRequest(
      () => api.get<PaginatedResponse<Project>>('/projects', { params }),
      []
    ).then(data => Array.isArray(data?.data) ? data?.data : []);
  },

  getBySlug: async (slug: string): Promise<Project | null> => {
    return handleApiRequest(
      () => api.get<ApiResponse<Project>>(`/projects/${slug}`),
      null
    );
  },

  getFeatured: async (limit: number = 3): Promise<Project[]> => {
    return projectsService.getAll({ featured: true, per_page: limit });
  },
};

// ============= Skills Service =============
export const skillsService = {
  getAll: async (params?: { 
    category?: string; 
    grouped?: boolean;
  }): Promise<Skill[]> => {
    return handleApiRequest(
      () => api.get<ApiResponse<Skill[]>>('/skills', { params }),
      []
    ).then(data => Array.isArray(data) ? data : []);
  },

  getByCategory: async (category: string): Promise<Skill[]> => {
    return skillsService.getAll({ category });
  },

  getGrouped: async (): Promise<Record<string, Skill[]>> => {
    const skills = await skillsService.getAll({ grouped: true });
    return Array.isArray(skills) ? {} : skills as unknown as Record<string, Skill[]>;
  },
};

// ============= Testimonials Service =============
export const testimonialsService = {
  getAll: async (): Promise<Testimonial[]> => {
    return handleApiRequest(
      () => api.get<ApiResponse<Testimonial[]>>('/testimonials'),
      []
    ).then(data => Array.isArray(data) ? data : []);
  },
};

// ============= Services Service =============
export const servicesService = {
  getAll: async (): Promise<Service[]> => {
    return handleApiRequest(
      () => api.get<ApiResponse<Service[]>>('/services'),
      []
    ).then(data => Array.isArray(data) ? data : []);
  },
};

// ============= Contact Service =============
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  submit: async (formData: ContactFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.post<ApiResponse<{ id: number }>>('/contact', formData);
      return {
        success: data.success,
        message: data.message || 'Message sent successfully!',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message. Please try again.',
      };
    }
  },
};

// ============= Auth Service =============
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  password_confirmation: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post('/login', credentials);
    return data.data;
  },

  register: async (userData: RegisterData) => {
    const { data } = await api.post('/register', userData);
    return data.data;
  },

  logout: async () => {
    await api.post('/logout');
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/user');
    return data.data;
  },
};
