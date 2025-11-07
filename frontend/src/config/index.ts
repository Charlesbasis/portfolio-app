import { DashboardWidget, OnboardingStep, PortfolioSection, ProfileField, UserTypeConfig } from "../types";

export const USER_TYPES: Record<string, UserTypeConfig> = {
  student: {
    label: "Student",
    description: "Currently studying or seeking education",
    icon: "graduation-cap",
    color: "blue",
    skills: {
      primary: [
        // Core academic and foundational tech
        'HTML', 'CSS', 'JavaScript', 'Python', 'Git',
        'Mathematics', 'Data Structures', 'Algorithms',
        'Problem Solving', 'Research Methods'
      ],
      secondary: [
        // Growing into professional skills
        'React', 'TypeScript', 'Node.js', 'SQL', 'MongoDB',
        'Statistics', 'Computer Science', 'Technical Writing'
      ],
      suggested: [
        // Career preparation
        'Next.js', 'Docker', 'AWS', 'Agile', 'Communication',
        'Team Leadership', 'Project Management'
      ]
    },
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
    skills: {
      primary: [
        // Core professional tech skills
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
        'SQL', 'MongoDB', 'Git', 'Docker', 'AWS',
        'REST API', 'GraphQL', 'Microservices'
      ],
      secondary: [
        // Advanced technical
        'Next.js', 'Vue.js', 'Laravel', 'PostgreSQL', 'Redis',
        'Kubernetes', 'CI/CD', 'System Design'
      ],
      suggested: [
        // Leadership and management
        'Team Leadership', 'Project Management', 'Agile', 'Scrum',
        'Mentoring', 'Strategic Planning', 'Stakeholder Management'
      ]
    },
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
    skills: {
      primary: [
        // Core teaching skills
        'Curriculum Development', 'Lesson Planning', 'Classroom Management',
        'Educational Assessment', 'Student Engagement', 'Communication',
        'Instructional Design', 'Learning Theory'
      ],
      secondary: [
        // Educational technology
        'Educational Technology', 'Learning Management Systems',
        'Online Teaching', 'Blended Learning', 'Differentiated Instruction',
        'Data Analysis', 'Student Assessment Tools'
      ],
      suggested: [
        // Modern teaching tools
        'HTML', 'CSS', 'JavaScript', 'Video Editing', 'Content Creation',
        'Digital Presentation', 'Research Methods', 'Academic Writing'
      ]
    },
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
    skills: {
      primary: [
        // Core freelance skills
        'JavaScript', 'React', 'Node.js', 'HTML', 'CSS',
        'UI/UX Design', 'Content Writing', 'SEO', 'Digital Marketing',
        'Social Media Management', 'Communication', 'Client Management'
      ],
      secondary: [
        // Advanced technical and creative
        'TypeScript', 'Next.js', 'Vue.js', 'Figma', 'Adobe Creative Suite',
        'Video Editing', 'Copywriting', 'Brand Strategy', 'Analytics'
      ],
      suggested: [
        // Business growth
        'Project Management', 'Business Development', 'Negotiation',
        'Email Marketing', 'Marketing Strategy', 'Market Research',
        'Financial Management', 'Contract Management'
      ]
    },
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

export const SKILL_CATEGORIES = {
  // Technical/Programming
  frontend: [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 
    'Angular', 'Next.js', 'Tailwind', 'Bootstrap', 'SASS', 'Webpack'
  ],
  backend: [
    'Node.js', 'Python', 'Java', 'PHP', 'C#', 'Ruby', 'Go',
    'Laravel', 'Django', 'Spring Boot', 'Express.js', 'FastAPI'
  ],
  database: [
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase',
    'Supabase', 'DynamoDB', 'Elasticsearch'
  ],
  devops: [
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform'
  ],
  mobile: [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS Development',
    'Android Development', 'Expo'
  ],
  
  // Academic/Student
  academic: [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Statistics',
    'Calculus', 'Linear Algebra', 'Data Structures', 'Algorithms',
    'Computer Science', 'Research Methods'
  ],
  languages: [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Arabic', 'Technical Writing', 'Academic Writing'
  ],
  
  // Professional/Soft Skills
  business: [
    'Project Management', 'Agile', 'Scrum', 'Product Management',
    'Business Analysis', 'Strategic Planning', 'Stakeholder Management'
  ],
  leadership: [
    'Team Leadership', 'Communication', 'Problem Solving', 'Decision Making',
    'Conflict Resolution', 'Mentoring', 'Coaching', 'Negotiation'
  ],
  
  // Teaching
  teaching: [
    'Curriculum Development', 'Lesson Planning', 'Classroom Management',
    'Educational Assessment', 'Instructional Design', 'Student Engagement',
    'Differentiated Instruction', 'Educational Technology', 'Learning Theory'
  ],
  
  // Freelancing/Creative
  creative: [
    'UI/UX Design', 'Graphic Design', 'Video Editing', 'Content Writing',
    'Copywriting', 'SEO', 'Social Media Marketing', 'Brand Strategy',
    'Adobe Creative Suite', 'Figma', 'Sketch'
  ],
  marketing: [
    'Digital Marketing', 'Content Marketing', 'Email Marketing',
    'Social Media Management', 'Analytics', 'Google Ads', 'Facebook Ads',
    'Marketing Strategy', 'Market Research'
  ]
} as const;
