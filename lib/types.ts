export type NavProps = {
  className?: string;
  children?: React.ReactNode;
  id?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  wpId?: number;
}

export interface Profile {
  id: number;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  location: string | null;
  headline: string | null;
  summary: string | null;
  contact_email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface Skill {
  id: number | string;
  profile_id: number | string;
  skill_name: string;
}

export interface Experience {
  id: number | string;
  profile_id: number | string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  bullets: string[];
  sort_order: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Project {
  id: number | string;
  profile_id: number | string;
  name: string;
  description: string | null;
  tech_stack: string[];
  url: string | null;
  sort_order: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}