import axios from 'axios';
import { Project, Skill, Testimonial } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const projectsApi = {
  getAll: async () => {
    const { data } = await api.get<{ data: Project[] }>('/projects');
    return data.data;
  },
  
  getBySlug: async (slug: string) => {
    const { data } = await api.get<{ data: Project }>(`/projects/${slug}`);
    return data.data;
  },
  
  getFeatured: async () => {
    const { data } = await api.get<{ data: Project[] }>('/projects?featured=1');
    return data.data;
  },
};

export const skillsApi = {
  getAll: async () => {
    const { data } = await api.get<{ data: Skill[] }>('/skills');
    return data.data;
  },
  
  getByCategory: async (category: string) => {
    const { data } = await api.get<{ data: Skill[] }>(`/skills?category=${category}`);
    return data.data;
  },
};

export const testimonialsApi = {
  getAll: async () => {
    const { data } = await api.get<{ data: Testimonial[] }>('/testimonials');
    return data.data;
  },
}

// export const contactApi = {
//   submit: async (formData: ContactSubmission) => {
//     const { data } = await api.post('/contact', formData);
//     return data;
//   },
// };
