import api, { handleApiRequest, tokenManager } from '../lib/api';
import { extractData, extractNestedData } from '../lib/utils';
import { 
  Project, 
  Skill, 
  Testimonial, 
  Service, 
  User,
  PaginatedResponse,
  ApiResponse 
} from '../types';



// ============= Projects Service =============
export const projectsService = {
  getAll: async (params?: { 
    featured?: boolean; 
    per_page?: number;
    page?: number;
    technology?: string;
  }): Promise<Project[]> => {
    const response = await handleApiRequest(
      () => api.get('/projects', { params }),
      { data: [] }
    );
    
    const extracted = extractData<Project[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  getBySlug: async (slug: string): Promise<Project | null> => {
    const response = await handleApiRequest(
      () => api.get(`/projects/${slug}`),
      null
    );
    
    if (!response) return null;
    const extracted = extractData<Project>(response);
    return extracted || null;
  },

  getFeatured: async (limit: number = 3): Promise<Project[]> => {
    return projectsService.getAll({ featured: true, per_page: limit });
  },

  create: async (formData: FormData): Promise<ApiResponse<Project>> => {
    const { data } = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: number, formData: FormData): Promise<ApiResponse<Project>> => {
    const { data } = await api.post(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },
};

// ============= Skills Service =============
export const skillsService = {
  getAll: async (params?: { 
    category?: string; 
    grouped?: string | boolean;
    user_id?: number;
  }): Promise<Skill[] | Record<string, Skill[]>> => {
    const queryParams = {
      ...params,
      grouped: params?.grouped ? 'true' : undefined
    };

    const response = await handleApiRequest(
      () => api.get('/skills', { params: queryParams }),
      params?.grouped ? {} : []
    );
    
    // If grouped, return as-is (it's already an object)
    if (params?.grouped) {
      const extracted = extractData<Record<string, Skill[]>>(response);
      return extracted ?? {};
    }
    
    // Otherwise, ensure it's an array
    const extracted = extractData<Skill[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  getByCategory: async (category: string): Promise<Skill[]> => {
    const result = await skillsService.getAll({ category });
    return Array.isArray(result) ? result : [];
  },

  getGrouped: async (): Promise<Record<string, Skill[]>> => {
    const result = await skillsService.getAll({ grouped: true });
    return Array.isArray(result) ? {} : result as Record<string, Skill[]>;
  },

  getById: async (id: number): Promise<Skill | null> => {
    const response = await handleApiRequest(
      () => api.get(`/skills/${id}`),
      null
    );
    
    if (!response) return null;
    return extractData<Skill>(response);
  },

  create: async (data: Partial<Skill>): Promise<ApiResponse<Skill>> => {
    const { data: responseData } = await api.post('/skills', data);
    return responseData;
  },

  update: async (id: number, data: Partial<Skill>): Promise<ApiResponse<Skill>> => {
    const { data: responseData } = await api.put(`/skills/${id}`, data);
    return responseData;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/skills/${id}`);
    return data;
  },
};

// ============= Testimonials Service =============
export const testimonialsService = {
  getAll: async (params?: { per_page?: number; page?: number }): Promise<Testimonial[]> => {
    const response = await handleApiRequest(
      () => api.get('/testimonials', { params }),
      { data: [] }
    );
    
    const extracted = extractData<Testimonial[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  getById: async (id: number): Promise<Testimonial | null> => {
    const response = await handleApiRequest(
      () => api.get(`/testimonials/${id}`),
      null
    );
    
    if (!response) return null;
    return extractData<Testimonial>(response);
  },

  create: async (data: Partial<Testimonial>): Promise<ApiResponse<Testimonial>> => {
    const { data: responseData } = await api.post('/testimonials', data);
    return responseData;
  },

  update: async (id: number, data: Partial<Testimonial>): Promise<ApiResponse<Testimonial>> => {
    const { data: responseData } = await api.put(`/testimonials/${id}`, data);
    return responseData;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/testimonials/${id}`);
    return data;
  },
};

// ============= Services Service =============
export const servicesService = {
  getAll: async (params?: { per_page?: number; page?: number }): Promise<Service[]> => {
    const response = await handleApiRequest(
      () => api.get('/services', { params }),
      { data: [] }
    );
    
    const extracted = extractData<Service[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  getById: async (id: number): Promise<Service | null> => {
    const response = await handleApiRequest(
      () => api.get(`/services/${id}`),
      null
    );
    
    if (!response) return null;
    return extractData<Service>(response);
  },

  create: async (data: Partial<Service>): Promise<ApiResponse<Service>> => {
    const { data: responseData } = await api.post('/services', data);
    return responseData;
  },

  update: async (id: number, data: Partial<Service>): Promise<ApiResponse<Service>> => {
    const { data: responseData } = await api.put(`/services/${id}`, data);
    return responseData;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/services/${id}`);
    return data;
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
      const { data } = await api.post('/contact/submit', formData);
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

  getAll: async (params?: { 
    status?: string; 
    per_page?: number; 
    page?: number;
  }): Promise<any[]> => {
    const response = await handleApiRequest(
      () => api.get('/contacts', { params }),
      { data: [] }
    );
    
    const extracted = extractData<any[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    const { data } = await api.put(`/contacts/${id}`, { status });
    return data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/contacts/${id}`);
    return data;
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
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    // const { data } = await api.post('/auth/login', credentials);
    const { data } = await api.post('/login', credentials);
    
    if (data.success && data.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
    }
    
    return data.data;
  },

  // debug: async (): Promise<void> => {
  //   console.log('🔍 Auth Debug Info:');
  //   console.log('📝 Stored Token:', tokenManager.get() ? 'Present' : 'Missing');
  //   console.log('🌐 API Base URL:', api.defaults.baseURL);

  //   try {
  //     const testResponse = await api.get('/auth/user');
  //     console.log('✅ Auth test response:', testResponse.data);
  //   } catch (error) {
  //     console.log('❌ Auth test failed:', {
  //       // status: getErrorStatus(error),
  //       // message: getErrorMessage(error)
  //     });
  //   }
  // },

  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    const { data } = await api.post('/auth/register', userData);
    
    if (data.success && data.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.data.token);
      }
    }
    
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await handleApiRequest(
        // () => api.get('/auth/user'),
        () => api.get('/user'),
        null
      );
      console.log('🔍 Raw API Response from getCurrentUser:', response);
      
      // Try different extraction methods
      const userData = extractNestedData<User>(response, 'data.user') ||
        extractData<User>(response) ||
        response;

      if (userData && userData.id) {
        return userData;
      }

      return null;
      
      // if (!response) return null;
      // return extractData<User>(response);      
    } catch (error) {
      console.error('❌ getCurrentUser error:', error);
      return null;
    }
  },
};

// ============= Experience Service =============
export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  location?: string;
  company_url?: string;
  technologies?: string[];
  order?: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export const experienceService = {
  getAll: async (params?: { 
    user_id?: number; 
    current?: boolean;
  }): Promise<Experience[]> => {
    const queryParams = {
      ...params,
      current: params?.current ? 'true' : undefined
    };

    const response = await handleApiRequest(
      () => api.get('/experiences', { params: queryParams }),
      { data: [] }
    );
    
    const extracted = extractData<Experience[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },

  getById: async (id: number): Promise<Experience | null> => {
    const response = await handleApiRequest(
      () => api.get(`/experiences/${id}`),
      null
    );
    
    if (!response) return null;
    return extractData<Experience>(response);
  },

  create: async (data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
    const { data: responseData } = await api.post('/experiences', data);
    return responseData;
  },

  update: async (id: number, data: Partial<Experience>): Promise<ApiResponse<Experience>> => {
    const { data: responseData } = await api.put(`/experiences/${id}`, data);
    return responseData;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/experiences/${id}`);
    return data;
  },
};

export { dashboardApi } from './dashboardApi.service';

export default api;
