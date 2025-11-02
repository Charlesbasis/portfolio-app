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
  is_featured: boolean;
  category?: string;
  completed_at?: string;
  short_description?: string;
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
  username?: string;
  job_title?: string;
  company?: string;
  location?: string;
  tagline?: string;
  bio?: string;
  email_verified_at?: string;
  onboarding_completed_at?: string;
  onboarding_completed?: boolean; 
  created_at: string;
  updated_at: string;
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

export interface UserProfile {
  id: number;
  user_id: number;
  username: string;
  full_name: string;
  tagline?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  cover_image_url?: string;
  
  // Social Links
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  
  // Contact Info
  email: string;
  phone?: string;
  
  // Professional Info
  job_title?: string;
  company?: string;
  years_experience?: number;
  availability_status?: 'available' | 'busy' | 'not_available';
  
  // Stats
  total_projects?: number;
  total_skills?: number;
  profile_views?: number;
  
  // Settings
  is_public: boolean;
  show_email: boolean;
  show_phone: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  user_id: number;
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  location?: string;
  company_url?: string;
  technologies?: string[];
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  user_id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string;
  grade?: string;
  location?: string;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: number;
  user_id: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string | null;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface SocialStats {
  total_projects: number;
  total_skills: number;
  years_experience: number;
  happy_clients: number;
  profile_views: number;
}

export interface UserWithProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
  profile?: UserProfile;
}

export interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

export interface ExperienceTimelineProps {
  experiences: Experience[];
  isLoading?: boolean;
}

export interface AboutSectionProps {
  profile: UserProfile;
}

export interface SettingsData {
  user: User;
  profile: UserProfile | null;
  stats: {
    projects: number;
    skills: number;
    experiences: number;
    education: number;
    certifications: number;
  };
}

export interface AccountUpdateData {
  name?: string;
  email?: string;
}

export interface PasswordUpdateData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface PrivacySettings {
  is_public?: boolean;
  show_email?: boolean;
  show_phone?: boolean;
}

export interface ActivityLog {
  type: string;
  action: string;
  title: string;
  timestamp: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description?: string;
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

export interface ProjectsGridProps {
  projects: Project[];
  isLoading?: boolean;
}

export interface SkillsDisplayProps {
  skills: Skill[];
  isLoading?: boolean;
}

export interface EducationCertificationsProps {
  education: Education[];
  certifications: Certification[];
  isLoadingEducation?: boolean;
  isLoadingCertifications?: boolean;
}

export interface OnboardingData {
  full_name: string;
  username: string;
  job_title: string;
  company?: string;
  location?: string;
  tagline?: string;
  bio?: string;
  project?: {
    title: string;
    description: string;
    technologies: string[];
  };
  skills: string[];
}

export interface OnboardingStatusResponse {
  success: boolean;
  data: {
    completed: boolean;
    completed_at: string | null;
    has_username: boolean;
    has_profile: boolean;
    has_projects: boolean;
    has_skills: boolean;
  };
}

export interface UsernameCheckResponse {
  available: boolean;
  message?: string;
}

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    redirect_url: string;
  };
}

export interface FormData {
  full_name: string;
  username: string;
  job_title: string;
  company: string;
  location: string;
  tagline: string;
  bio: string;
  project_title: string;
  project_description: string;
  project_technologies: string[];
  skills: string[];
}

export interface Step {
  id: number;
  title: string;
  icon: any;
}
