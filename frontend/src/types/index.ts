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

export interface DashboardStats {
  projects: {
    total: number;
    published: number;
    draft: number;
    featured: number;
  };
  skills: {
    total: number;
    by_category: Record<string, number>;
  };
  messages: {
    total: number;
    unread: number;
    read: number;
    replied: number;
  };
  experiences: {
    total: number;
    current: number;
  };
  testimonials: {
    total: number;
    featured: number;
  };
  services: {
    total: number;
  };
}

export interface RecentProject {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  featured: boolean;
  created_at: string;
}

export interface RecentMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface Activity {
  type: 'project' | 'skill' | 'message' | 'experience';
  action: string;
  title: string;
  description: string;
  status?: string;
  category?: string;
  created_at: string;
}

export interface Analytics {
  projects_over_time: Array<{ date: string; count: number }>;
  messages_over_time: Array<{ date: string; count: number }>;
  skills_by_category: Array<{ category: string; count: number }>;
  top_technologies: Record<string, number>;
}

export interface DashboardSummary {
  user: {
    name: string;
    email: string;
    email_verified_at: string | null;
  };
  quick_stats: {
    total_projects: number;
    total_skills: number;
    unread_messages: number;
    total_experiences: number;
  };
  latest_activity: {
    last_project: {
      title: string;
      created_at: string;
    } | null;
    last_message: {
      name: string;
      subject: string;
      created_at: string;
    } | null;
  };
}
