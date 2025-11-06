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
  user_type: string;
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
  profile_data: Record<string, any>;
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
  user_type: string;
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
  profile_data: Record<string, any>;
}

export interface Step {
  id: number;
  title: string;
  icon: any;
  required?: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  component: string;
  required?: boolean;
  validationRules?: any[];
}

export interface ProfileField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'date' | 'textarea' | 'file';
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: any;
}

export interface DashboardWidget {
  id: string;
  title: string;
  component: string;
  grid: { x: number; y: number; w: number; h: number };
  config?: any;
}

export interface PortfolioSection {
  id: string;
  title: string;
  component: string;
  editable: boolean;
  visibility: 'public' | 'private' | 'connections';
}

export interface UserTypeConfig {
  label: string;
  description: string;
  icon: string;
  color: string;
  onboardingSteps: OnboardingStep[];
  profileFields: ProfileField[];
  dashboardWidgets: DashboardWidget[];
  portfolioSections: PortfolioSection[];
  permissions: string[];
}

export const USER_TYPES: Record<string, UserTypeConfig> = {
  student: {
    label: "Student",
    description: "Currently studying or seeking education",
    icon: "graduation-cap",
    color: "blue",
    onboardingSteps: [
      {
        id: "profile_setup",
        title: "Basic Profile",
        component: "StudentProfileSetup",
        required: true,
        validationRules: ['required']
      },
      {
        id: "academic_info",
        title: "Academic Information",
        component: "AcademicInfo",
        required: true
      },
      {
        id: "skills_assessment",
        title: "Skills Assessment",
        component: "SkillsAssessment",
        required: false
      },
      {
        id: "goal_setting",
        title: "Learning Goals",
        component: "GoalSetting",
        required: true
      }
    ],
    profileFields: [
      {
        name: "gpa",
        label: "GPA",
        type: "number",
        required: false,
        validation: { min: 0, max: 4.0 }
      },
      {
        name: "major",
        label: "Major/Field of Study",
        type: "text",
        required: true
      },
      {
        name: "graduation_year",
        label: "Expected Graduation Year",
        type: "number",
        required: true,
        validation: { min: 2023, max: 2030 }
      },
      {
        name: "current_semester",
        label: "Current Semester",
        type: "select",
        required: true,
        options: [
          { label: "Freshman", value: "freshman" },
          { label: "Sophomore", value: "sophomore" },
          { label: "Junior", value: "junior" },
          { label: "Senior", value: "senior" },
          { label: "Graduate", value: "graduate" }
        ]
      },
      {
        name: "school",
        label: "School/University",
        type: "text",
        required: true
      }
    ],
    dashboardWidgets: [
      {
        id: "academic_progress",
        title: "Academic Progress",
        component: "AcademicProgressWidget",
        grid: { x: 0, y: 0, w: 4, h: 2 }
      },
      {
        id: "upcoming_deadlines",
        title: "Upcoming Deadlines",
        component: "DeadlinesWidget",
        grid: { x: 4, y: 0, w: 2, h: 2 }
      },
      {
        id: "skill_gaps",
        title: "Skill Development",
        component: "SkillGapsWidget",
        grid: { x: 0, y: 2, w: 3, h: 2 }
      },
      {
        id: "recommended_courses",
        title: "Recommended Courses",
        component: "CourseRecommendationsWidget",
        grid: { x: 3, y: 2, w: 3, h: 2 }
      }
    ],
    portfolioSections: [
      {
        id: "projects",
        title: "Academic Projects",
        component: "ProjectsSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "certifications",
        title: "Certifications",
        component: "CertificationsSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "academic_achievements",
        title: "Achievements",
        component: "AchievementsSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "skills",
        title: "Skills & Competencies",
        component: "SkillsSection",
        editable: true,
        visibility: "public"
      }
    ],
    permissions: [
      "course_access",
      "peer_networking",
      "mentor_requests",
      "academic_resources",
      "career_guidance"
    ]
  },
  professional: {
    label: "Professional",
    description: "Working professional",
    icon: "briefcase",
    color: "green",
    onboardingSteps: [
      {
        id: "profile_setup",
        title: "Professional Profile",
        component: "ProfessionalProfileSetup",
        required: true
      },
      {
        id: "work_experience",
        title: "Work Experience",
        component: "WorkExperience",
        required: true
      },
      {
        id: "skills_validation",
        title: "Skills Validation",
        component: "SkillsValidation",
        required: false
      },
      {
        id: "career_goals",
        title: "Career Goals",
        component: "CareerGoals",
        required: true
      }
    ],
    profileFields: [
      {
        name: "current_role",
        label: "Current Role",
        type: "text",
        required: true
      },
      {
        name: "company",
        label: "Company",
        type: "text",
        required: true
      },
      {
        name: "experience_years",
        label: "Years of Experience",
        type: "number",
        required: true
      },
      {
        name: "industry",
        label: "Industry",
        type: "select",
        required: true,
        options: [
          { label: "Technology", value: "technology" },
          { label: "Healthcare", value: "healthcare" },
          { label: "Finance", value: "finance" },
          { label: "Education", value: "education" },
          { label: "Manufacturing", value: "manufacturing" }
        ]
      },
      {
        name: "skills",
        label: "Key Skills",
        type: "textarea",
        required: true
      }
    ],
    dashboardWidgets: [
      {
        id: "career_progress",
        title: "Career Progress",
        component: "CareerProgressWidget",
        grid: { x: 0, y: 0, w: 3, h: 2 }
      },
      {
        id: "skill_development",
        title: "Skill Development",
        component: "SkillDevelopmentWidget",
        grid: { x: 3, y: 0, w: 3, h: 2 }
      },
      {
        id: "networking_opportunities",
        title: "Networking",
        component: "NetworkingWidget",
        grid: { x: 0, y: 2, w: 2, h: 2 }
      },
      {
        id: "job_recommendations",
        title: "Job Recommendations",
        component: "JobRecommendationsWidget",
        grid: { x: 2, y: 2, w: 4, h: 2 }
      }
    ],
    portfolioSections: [
      {
        id: "work_experience",
        title: "Work Experience",
        component: "WorkExperienceSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "projects",
        title: "Professional Projects",
        component: "ProjectsSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "certifications",
        title: "Certifications",
        component: "CertificationsSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "testimonials",
        title: "Testimonials",
        component: "TestimonialsSection",
        editable: false,
        visibility: "public"
      }
    ],
    permissions: [
      "professional_networking",
      "job_search",
      "mentorship",
      "industry_insights",
      "recruitment"
    ]
  },
  teacher: {
    label: "Teacher",
    description: "Educator or instructor",
    icon: "chalkboard-teacher",
    color: "purple",
    onboardingSteps: [
      {
        id: "profile_setup",
        title: "Teacher Profile",
        component: "TeacherProfileSetup",
        required: true
      },
      {
        id: "teaching_experience",
        title: "Teaching Experience",
        component: "TeachingExperience",
        required: true
      },
      {
        id: "subject_expertise",
        title: "Subject Expertise",
        component: "SubjectExpertise",
        required: true
      },
      {
        id: "availability",
        title: "Availability",
        component: "AvailabilitySetup",
        required: false
      }
    ],
    profileFields: [
      {
        name: "teaching_subjects",
        label: "Subjects Taught",
        type: "textarea",
        required: true
      },
      {
        name: "education_level",
        label: "Education Level",
        type: "select",
        required: true,
        options: [
          { label: "Elementary", value: "elementary" },
          { label: "Middle School", value: "middle_school" },
          { label: "High School", value: "high_school" },
          { label: "Undergraduate", value: "undergraduate" },
          { label: "Graduate", value: "graduate" }
        ]
      },
      {
        name: "years_experience",
        label: "Years of Teaching Experience",
        type: "number",
        required: true
      },
      {
        name: "certifications",
        label: "Teaching Certifications",
        type: "textarea",
        required: false
      },
      {
        name: "teaching_style",
        label: "Teaching Philosophy/Style",
        type: "textarea",
        required: false
      }
    ],
    dashboardWidgets: [
      {
        id: "student_progress",
        title: "Student Progress",
        component: "StudentProgressWidget",
        grid: { x: 0, y: 0, w: 4, h: 2 }
      },
      {
        id: "teaching_schedule",
        title: "Teaching Schedule",
        component: "TeachingScheduleWidget",
        grid: { x: 4, y: 0, w: 2, h: 2 }
      },
      {
        id: "resource_management",
        title: "Teaching Resources",
        component: "ResourceManagementWidget",
        grid: { x: 0, y: 2, w: 3, h: 2 }
      },
      {
        id: "performance_metrics",
        title: "Performance Metrics",
        component: "PerformanceMetricsWidget",
        grid: { x: 3, y: 2, w: 3, h: 2 }
      }
    ],
    portfolioSections: [
      {
        id: "teaching_philosophy",
        title: "Teaching Philosophy",
        component: "TeachingPhilosophySection",
        editable: true,
        visibility: "public"
      },
      {
        id: "course_materials",
        title: "Course Materials",
        component: "CourseMaterialsSection",
        editable: true,
        visibility: "connections"
      },
      {
        id: "student_testimonials",
        title: "Student Testimonials",
        component: "StudentTestimonialsSection",
        editable: false,
        visibility: "public"
      },
      {
        id: "professional_development",
        title: "Professional Development",
        component: "ProfessionalDevelopmentSection",
        editable: true,
        visibility: "public"
      }
    ],
    permissions: [
      "student_management",
      "content_creation",
      "assessment_tools",
      "progress_tracking",
      "resource_sharing"
    ]
  },
  freelancer: {
    label: "Freelancer",
    description: "Independent contractor or gig worker",
    icon: "user-tie",
    color: "orange",
    onboardingSteps: [
      {
        id: "profile_setup",
        title: "Freelancer Profile",
        component: "FreelancerProfileSetup",
        required: true
      },
      {
        id: "portfolio_setup",
        title: "Portfolio Setup",
        component: "PortfolioSetup",
        required: true
      },
      {
        id: "service_offerings",
        title: "Service Offerings",
        component: "ServiceOfferings",
        required: true
      },
      {
        id: "pricing_setup",
        title: "Pricing & Rates",
        component: "PricingSetup",
        required: true
      }
    ],
    profileFields: [
      {
        name: "specialties",
        label: "Specialties/Services",
        type: "textarea",
        required: true
      },
      {
        name: "hourly_rate",
        label: "Hourly Rate (USD)",
        type: "number",
        required: true
      },
      {
        name: "portfolio_url",
        label: "Portfolio URL",
        type: "text",
        required: false
      },
      {
        name: "availability",
        label: "Availability",
        type: "select",
        required: true,
        options: [
          { label: "Full-time", value: "full_time" },
          { label: "Part-time", value: "part_time" },
          { label: "As needed", value: "as_needed" }
        ]
      },
      {
        name: "tools_technologies",
        label: "Tools & Technologies",
        type: "textarea",
        required: true
      }
    ],
    dashboardWidgets: [
      {
        id: "project_pipeline",
        title: "Project Pipeline",
        component: "ProjectPipelineWidget",
        grid: { x: 0, y: 0, w: 3, h: 2 }
      },
      {
        id: "income_tracker",
        title: "Income Tracker",
        component: "IncomeTrackerWidget",
        grid: { x: 3, y: 0, w: 3, h: 2 }
      },
      {
        id: "client_management",
        title: "Client Management",
        component: "ClientManagementWidget",
        grid: { x: 0, y: 2, w: 3, h: 2 }
      },
      {
        id: "skill_marketability",
        title: "Skill Marketability",
        component: "SkillMarketabilityWidget",
        grid: { x: 3, y: 2, w: 3, h: 2 }
      }
    ],
    portfolioSections: [
      {
        id: "projects",
        title: "Portfolio Projects",
        component: "PortfolioProjectsSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "client_testimonials",
        title: "Client Testimonials",
        component: "ClientTestimonialsSection",
        editable: false,
        visibility: "public"
      },
      {
        id: "services",
        title: "Services Offered",
        component: "ServicesSection",
        editable: true,
        visibility: "public"
      },
      {
        id: "case_studies",
        title: "Case Studies",
        component: "CaseStudiesSection",
        editable: true,
        visibility: "public"
      }
    ],
    permissions: [
      "project_bidding",
      "client_management",
      "portfolio_showcase",
      "contract_management",
      "payment_processing"
    ]
  }
};

// Utility functions
export const getUserTypeConfig = (userTypeSlug: string): UserTypeConfig => {
  return USER_TYPES[userTypeSlug] || USER_TYPES.student;
};

export const getUserTypeOptions = () => {
  return Object.entries(USER_TYPES).map(([slug, config]) => ({
    value: slug,
    label: config.label,
    description: config.description,
    icon: config.icon,
    color: config.color
  }));
};

export const getOnboardingSteps = (userTypeSlug: string): OnboardingStep[] => {
  return getUserTypeConfig(userTypeSlug).onboardingSteps;
};

export const getProfileFields = (userTypeSlug: string): ProfileField[] => {
  return getUserTypeConfig(userTypeSlug).profileFields;
};

export const getDashboardConfig = (userTypeSlug: string): DashboardWidget[] => {
  return getUserTypeConfig(userTypeSlug).dashboardWidgets;
};

export const getPortfolioConfig = (userTypeSlug: string): PortfolioSection[] => {
  return getUserTypeConfig(userTypeSlug).portfolioSections;
};
