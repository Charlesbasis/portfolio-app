export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  image_url?: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  featured: boolean;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'devops' | 'other';
  proficiency: number;
  icon_url?: string;
  years_of_experience?: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar_url?: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
}
