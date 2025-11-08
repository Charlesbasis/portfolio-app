import { UserTypeConfig } from "../types";

export const USER_TYPES: Record<string, UserTypeConfig> = {
  student: {
    value: 'student',
    label: 'Student',
    description: 'Learning and building projects',
    color: 'blue',
    icon: 'GraduationCap',

    profileFields: [
      {
        name: 'grade_level',
        label: 'Grade Level',
        type: 'select',
        required: true,
        options: [
          { value: 'high-school', label: 'High School' },
          { value: 'undergraduate', label: 'Undergraduate' },
          { value: 'graduate', label: 'Graduate' },
          { value: 'postgraduate', label: 'Postgraduate' }
        ]
      },
      {
        name: 'institution',
        label: 'School/University',
        type: 'text',
        required: false,
        placeholder: 'MIT'
      },
      {
        name: 'major',
        label: 'Major/Field of Study',
        type: 'text',
        required: false,
        placeholder: 'Computer Science'
      },
      {
        name: 'graduation_year',
        label: 'Expected Graduation',
        type: 'number',
        required: false,
        placeholder: '2025',
        validation: { min: 2024, max: 2035 }
      }
    ],

    activityConfig: {
      title: 'Share Your First Project',
      subtitle: 'Show off what you\'ve built - it could be a school project, personal experiment, or anything you\'re proud of!',
      fields: [
        {
          name: 'title',
          label: 'Project Title',
          type: 'text',
          required: false,
          placeholder: 'E-commerce Website'
        },
        {
          name: 'description',
          label: 'What did you build?',
          type: 'textarea',
          required: false,
          placeholder: 'Describe your project, what problem it solves, and what you learned...',
          description: 'Be specific about your role and the technologies you used'
        },
        {
          name: 'course',
          label: 'Course/Class',
          type: 'text',
          required: false,
          placeholder: 'CS101 - Intro to Programming'
        },
        {
          name: 'technologies',
          label: 'Technologies Used',
          type: 'array',
          required: false,
          description: 'Select technologies you used'
        }
      ]
    },

    skills: {
      primary: [
        ...SKILL_CATEGORIES.languages.slice(0, 6),
        ...SKILL_CATEGORIES.frontend.slice(0, 4)
      ],
      secondary: [
        ...SKILL_CATEGORIES.backend.slice(0, 4),
        ...SKILL_CATEGORIES.database.slice(0, 3)
      ],
      suggested: [
        ...SKILL_CATEGORIES.academic.slice(0, 5),
        ...SKILL_CATEGORIES.business.slice(0, 3)
      ]
    },

    dashboardWidgets: ['projects', 'courses', 'achievements', 'learning-path'],
    portfolioSections: ['projects', 'education', 'skills', 'achievements'],
    onboardingSteps: ['welcome', 'user-type', 'profile', 'project', 'skills', 'launch']
  },

  teacher: {
    value: 'teacher',
    label: 'Teacher/Educator',
    description: 'Sharing knowledge and teaching materials',
    color: 'green',
    icon: 'BookOpen',

    profileFields: [
      {
        name: 'subject_specialty',
        label: 'Subject Specialty',
        type: 'text',
        required: true,
        placeholder: 'Mathematics, Physics, etc.'
      },
      {
        name: 'teaching_level',
        label: 'Teaching Level',
        type: 'select',
        required: true,
        options: [
          { value: 'elementary', label: 'Elementary School' },
          { value: 'middle', label: 'Middle School' },
          { value: 'high', label: 'High School' },
          { value: 'college', label: 'College/University' },
          { value: 'adult', label: 'Adult Education' }
        ]
      },
      {
        name: 'years_experience',
        label: 'Years of Experience',
        type: 'number',
        required: false,
        placeholder: '5',
        validation: { min: 0, max: 50 }
      },
      {
        name: 'institution',
        label: 'Current Institution',
        type: 'text',
        required: false,
        placeholder: 'Lincoln High School'
      }
    ],

    activityConfig: {
      title: 'Share a Teaching Resource',
      subtitle: 'Share a lesson plan, course material, or teaching resource you\'ve created',
      fields: [
        {
          name: 'title',
          label: 'Resource Title',
          type: 'text',
          required: false,
          placeholder: 'Introduction to Calculus - Complete Course'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          placeholder: 'Describe your teaching resource, learning objectives, and target audience...'
        },
        {
          name: 'subject',
          label: 'Subject',
          type: 'text',
          required: false,
          placeholder: 'Mathematics'
        },
        {
          name: 'grade_level',
          label: 'Grade Level',
          type: 'text',
          required: false,
          placeholder: '11th Grade'
        },
        {
          name: 'tools_used',
          label: 'Tools & Platforms',
          type: 'array',
          required: false,
          description: 'Teaching tools and platforms you use'
        }
      ]
    },

    skills: {
      primary: [
        ...SKILL_CATEGORIES.teaching.slice(0, 6),
        ...SKILL_CATEGORIES.academic.slice(0, 4)
      ],
      secondary: [
        ...SKILL_CATEGORIES.business.slice(0, 4),
        ...SKILL_CATEGORIES.design.slice(0, 3)
      ],
      suggested: [
        ...SKILL_CATEGORIES.frontend.slice(0, 3),
        'Content Creation', 'Video Editing', 'Public Speaking'
      ]
    },

    dashboardWidgets: ['classes', 'students', 'materials', 'calendar'],
    portfolioSections: ['courses', 'materials', 'testimonials', 'certifications'],
    onboardingSteps: ['welcome', 'user-type', 'profile', 'resource', 'skills', 'launch']
  },

  professional: {
    value: 'professional',
    label: 'Professional Developer',
    description: 'Building production applications',
    color: 'purple',
    icon: 'Code',

    profileFields: [
      {
        name: 'current_role',
        label: 'Current Role',
        type: 'text',
        required: true,
        placeholder: 'Senior Full Stack Developer'
      },
      {
        name: 'years_experience',
        label: 'Years of Experience',
        type: 'number',
        required: false,
        placeholder: '5',
        validation: { min: 0, max: 50 }
      },
      {
        name: 'specialization',
        label: 'Specialization',
        type: 'select',
        required: false,
        options: [
          { value: 'frontend', label: 'Frontend Development' },
          { value: 'backend', label: 'Backend Development' },
          { value: 'fullstack', label: 'Full Stack Development' },
          { value: 'mobile', label: 'Mobile Development' },
          { value: 'devops', label: 'DevOps Engineering' },
          { value: 'data', label: 'Data Engineering' }
        ]
      },
      {
        name: 'availability',
        label: 'Availability',
        type: 'select',
        required: false,
        options: [
          { value: 'employed', label: 'Currently Employed' },
          { value: 'open', label: 'Open to Opportunities' },
          { value: 'freelance', label: 'Available for Freelance' },
          { value: 'not-looking', label: 'Not Looking' }
        ]
      }
    ],

    activityConfig: {
      title: 'Showcase Your Best Project',
      subtitle: 'Share a professional project that demonstrates your expertise',
      fields: [
        {
          name: 'title',
          label: 'Project Name',
          type: 'text',
          required: false,
          placeholder: 'Enterprise CRM Platform'
        },
        {
          name: 'description',
          label: 'Project Description',
          type: 'textarea',
          required: false,
          placeholder: 'Describe the project scope, your role, technical challenges, and impact...'
        },
        {
          name: 'company',
          label: 'Company/Client',
          type: 'text',
          required: false,
          placeholder: 'Tech Corp Inc.'
        },
        {
          name: 'team_size',
          label: 'Team Size',
          type: 'text',
          required: false,
          placeholder: '5 developers'
        },
        {
          name: 'technologies',
          label: 'Tech Stack',
          type: 'array',
          required: false,
          description: 'Technologies and frameworks used'
        },
        {
          name: 'github_url',
          label: 'GitHub URL',
          type: 'url',
          required: false,
          placeholder: 'https://github.com/username/project'
        },
        {
          name: 'live_url',
          label: 'Live URL',
          type: 'url',
          required: false,
          placeholder: 'https://project.com'
        }
      ]
    },

    skills: {
      primary: [
        ...SKILL_CATEGORIES.languages.slice(0, 5),
        ...SKILL_CATEGORIES.frontend.slice(0, 5),
        ...SKILL_CATEGORIES.backend.slice(0, 5)
      ],
      secondary: [
        ...SKILL_CATEGORIES.database,
        ...SKILL_CATEGORIES.devops.slice(0, 5)
      ],
      suggested: [
        ...SKILL_CATEGORIES.design.slice(0, 3),
        ...SKILL_CATEGORIES.business.slice(0, 4)
      ]
    },

    dashboardWidgets: ['projects', 'experience', 'skills', 'analytics'],
    portfolioSections: ['projects', 'experience', 'skills', 'certifications'],
    onboardingSteps: ['welcome', 'user-type', 'profile', 'project', 'skills', 'launch']
  },

  freelancer: {
    value: 'freelancer',
    label: 'Freelancer',
    description: 'Independent contractor and consultant',
    color: 'orange',
    icon: 'Briefcase',

    profileFields: [
      {
        name: 'hourly_rate',
        label: 'Hourly Rate (USD)',
        type: 'number',
        required: false,
        placeholder: '75',
        validation: { min: 1, max: 1000 }
      },
      {
        name: 'portfolio_url',
        label: 'Portfolio Website',
        type: 'url',
        required: false,
        placeholder: 'https://yourportfolio.com'
      },
      {
        name: 'specialization',
        label: 'Primary Service',
        type: 'select',
        required: true,
        options: [
          { value: 'web-dev', label: 'Web Development' },
          { value: 'mobile-dev', label: 'Mobile Development' },
          { value: 'design', label: 'UI/UX Design' },
          { value: 'consulting', label: 'Technical Consulting' },
          { value: 'full-service', label: 'Full Service Development' }
        ]
      },
      {
        name: 'availability',
        label: 'Current Availability',
        type: 'select',
        required: false,
        options: [
          { value: 'available', label: 'Available Now' },
          { value: 'limited', label: 'Limited Availability' },
          { value: 'booked', label: 'Fully Booked' }
        ]
      }
    ],

    activityConfig: {
      title: 'Feature a Client Project',
      subtitle: 'Showcase your best client work and the value you delivered',
      fields: [
        {
          name: 'title',
          label: 'Project Name',
          type: 'text',
          required: false,
          placeholder: 'E-commerce Redesign for Retail Brand'
        },
        {
          name: 'description',
          label: 'Project Details',
          type: 'textarea',
          required: false,
          placeholder: 'Describe the project, client requirements, your solution, and results...'
        },
        {
          name: 'client',
          label: 'Client Name',
          type: 'text',
          required: false,
          placeholder: 'Acme Retail (or keep confidential)'
        },
        {
          name: 'duration',
          label: 'Project Duration',
          type: 'text',
          required: false,
          placeholder: '3 months'
        },
        {
          name: 'technologies',
          label: 'Technologies Used',
          type: 'array',
          required: false,
          description: 'Tech stack and tools'
        },
        {
          name: 'project_url',
          label: 'Project URL',
          type: 'url',
          required: false,
          placeholder: 'https://clientproject.com'
        }
      ]
    },

    skills: {
      primary: [
        ...SKILL_CATEGORIES.languages.slice(0, 4),
        ...SKILL_CATEGORIES.frontend.slice(0, 4),
        ...SKILL_CATEGORIES.backend.slice(0, 3)
      ],
      secondary: [
        ...SKILL_CATEGORIES.database.slice(0, 3),
        ...SKILL_CATEGORIES.design.slice(0, 4)
      ],
      suggested: [
        ...SKILL_CATEGORIES.business,
        'Client Communication', 'Proposal Writing', 'Contract Negotiation'
      ]
    },

    dashboardWidgets: ['services', 'clients', 'revenue', 'testimonials'],
    portfolioSections: ['services', 'portfolio', 'testimonials', 'contact'],
    onboardingSteps: ['welcome', 'user-type', 'profile', 'project', 'skills', 'launch']
  }
};

export const getUserTypeConfig = (userType: string): UserTypeConfig | null => {
  return USER_TYPES[userType] || null;
};

export const getUserTypeOptions = () => {
  return Object.values(USER_TYPES).map(type => ({
    value: type.value,
    label: type.label,
    description: type.description,
    color: type.color,
    icon: type.icon
  }));
};

export const getSkillsForUserType = (userType: string): string[] => {
  const config = getUserTypeConfig(userType);
  if (!config) return [];
  
  return [
    ...config.skills.primary,
    ...config.skills.secondary,
    ...config.skills.suggested
  ];
};

export const SKILL_CATEGORIES = {
  // Academic subjects
  academic: [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History',
    'English Literature', 'Geography', 'Economics', 'Psychology'
  ],

  // Teaching tools
  teaching: [
    'Lesson Planning', 'Classroom Management', 'Google Classroom',
    'Canvas LMS', 'Zoom', 'Microsoft Teams', 'Kahoot', 'Nearpod',
    'Educational Technology', 'Curriculum Development'
  ],

  // Programming languages
  languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
    'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin'
  ],

  // Frontend technologies
  frontend: [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
    'HTML', 'CSS', 'Tailwind CSS', 'SASS', 'Redux'
  ],

  // Backend technologies
  backend: [
    'Node.js', 'Express', 'Django', 'Flask', 'Laravel',
    'Spring Boot', 'ASP.NET', 'Ruby on Rails', 'FastAPI'
  ],

  // Database technologies
  database: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
    'Firebase', 'Supabase', 'DynamoDB'
  ],

  // DevOps & Tools
  devops: [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'CI/CD', 'Git', 'GitHub Actions', 'Jenkins'
  ],

  // Design & Creative
  design: [
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
    'UI/UX Design', 'Wireframing', 'Prototyping'
  ],

  // Business & Soft Skills
  business: [
    'Project Management', 'Agile', 'Scrum', 'Communication',
    'Leadership', 'Problem Solving', 'Critical Thinking'
  ]
};
