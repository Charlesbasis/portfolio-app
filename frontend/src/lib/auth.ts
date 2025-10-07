import api from './api';
import { User, AuthResponse } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string, password_confirmation: string) {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/user');
    return response.data.data;
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
