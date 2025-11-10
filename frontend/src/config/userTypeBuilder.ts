
import { ActivityField, ProfileField, SkillCategory, UserTypeConfig, UserTypeFromAPI } from '@/src/types';
import { SKILL_CATEGORIES } from './skillCategories';

/**
 * Convert API user type to frontend config
 * This bridges backend data with frontend requirements
 */
export const buildUserTypeConfig = (
  apiUserType: UserTypeFromAPI
): UserTypeConfig => {
  // Convert API fields to ProfileField format
  const profileFields: ProfileField[] = apiUserType.fields.map(field => ({
    name: field.field_slug,
    label: field.field_name,
    type: field.data_type as any,
    required: field.is_required,
    placeholder: field.placeholder,
    description: field.description,
    options: field.options,
    validation: parseValidationRules(field.validation_rules),
  }));

  // Build activity config based on user type
  const activityConfig = getActivityConfig(apiUserType.slug);

  // Build skills based on user type
  const skills = getSkillsConfig(apiUserType.slug);

  return {
    value: apiUserType.slug,
    label: apiUserType.name,
    description: apiUserType.description,
    color: apiUserType.color,
    icon: apiUserType.icon,
    profileFields,
    activityConfig,
    skills,
    dashboardWidgets: getDashboardWidgets(apiUserType.slug),
    portfolioSections: getPortfolioSections(apiUserType.slug),
    onboardingSteps: ['welcome', 'user-type', 'profile', 'activity', 'skills', 'launch'],
  };
};

/**
 * Parse Laravel validation rules to frontend format
 */
function parseValidationRules(rules: string): { 
  min?: number; 
  max?: number; 
  pattern?: string;
  email?: boolean;
  url?: boolean;
} {
  if (!rules) return {};
  
  const validation: any = {};
  const rulesArray = rules.split('|');
  
  rulesArray.forEach(rule => {
    if (rule.startsWith('min:')) {
      validation.min = parseInt(rule.split(':')[1]);
    }
    if (rule.startsWith('max:')) {
      validation.max = parseInt(rule.split(':')[1]);
    }
    if (rule.startsWith('regex:')) {
      validation.pattern = rule.split(':')[1];
    }
    if (rule === 'email') {
      validation.email = true;
    }
    if (rule === 'url') {
      validation.url = true;
    }
  });
  
  return validation;
}

/**
 * Activity configurations for each user type
 * These define what type of "first activity" users are asked to share
 */
const ACTIVITY_CONFIGS: Record<string, {
  title: string;
  subtitle: string;
  fields: ActivityField[];
}> = {
  student: {
    title: 'Share Your First Project',
    subtitle: 'Show off what you\'ve built - it could be a school project, personal experiment, or anything you\'re proud of!',
    fields: [
      {
        name: 'title',
        label: 'Project Title',
        type: 'text',
        required: false,
        placeholder: 'E-commerce Website',
      },
      {
        name: 'description',
        label: 'What did you build?',
        type: 'textarea',
        required: false,
        placeholder: 'Describe your project, what problem it solves, and what you learned...',
        description: 'Be specific about your role and the technologies you used',
      },
      {
        name: 'course',
        label: 'Course/Class',
        type: 'text',
        required: false,
        placeholder: 'CS101 - Intro to Programming',
      },
      {
        name: 'technologies',
        label: 'Technologies Used',
        type: 'array',
        required: false,
        description: 'Select technologies you used',
      },
    ],
  },

  teacher: {
    title: 'Share a Teaching Resource',
    subtitle: 'Share a lesson plan, course material, or teaching resource you\'ve created',
    fields: [
      {
        name: 'title',
        label: 'Resource Title',
        type: 'text',
        required: false,
        placeholder: 'Introduction to Calculus - Complete Course',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe your teaching resource, learning objectives, and target audience...',
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'text',
        required: false,
        placeholder: 'Mathematics',
      },
      {
        name: 'grade_level',
        label: 'Grade Level',
        type: 'text',
        required: false,
        placeholder: '11th Grade',
      },
      {
        name: 'tools_used',
        label: 'Tools & Platforms',
        type: 'array',
        required: false,
        description: 'Teaching tools and platforms you use',
      },
    ],
  },

  professional: {
    title: 'Showcase Your Best Project',
    subtitle: 'Share a professional project that demonstrates your expertise',
    fields: [
      {
        name: 'title',
        label: 'Project Name',
        type: 'text',
        required: false,
        placeholder: 'Enterprise CRM Platform',
      },
      {
        name: 'description',
        label: 'Project Description',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the project scope, your role, technical challenges, and impact...',
      },
      {
        name: 'company',
        label: 'Company/Client',
        type: 'text',
        required: false,
        placeholder: 'Tech Corp Inc.',
      },
      {
        name: 'team_size',
        label: 'Team Size',
        type: 'text',
        required: false,
        placeholder: '5 developers',
      },
      {
        name: 'technologies',
        label: 'Tech Stack',
        type: 'array',
        required: false,
        description: 'Technologies and frameworks used',
      },
      {
        name: 'github_url',
        label: 'GitHub URL',
        type: 'url',
        required: false,
        placeholder: 'https://github.com/username/project',
      },
      {
        name: 'live_url',
        label: 'Live URL',
        type: 'url',
        required: false,
        placeholder: 'https://project.com',
      },
    ],
  },

  freelancer: {
    title: 'Feature a Client Project',
    subtitle: 'Showcase your best client work and the value you delivered',
    fields: [
      {
        name: 'title',
        label: 'Project Name',
        type: 'text',
        required: false,
        placeholder: 'E-commerce Redesign for Retail Brand',
      },
      {
        name: 'description',
        label: 'Project Details',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the project, client requirements, your solution, and results...',
      },
      {
        name: 'client',
        label: 'Client Name',
        type: 'text',
        required: false,
        placeholder: 'Acme Retail (or keep confidential)',
      },
      {
        name: 'duration',
        label: 'Project Duration',
        type: 'text',
        required: false,
        placeholder: '3 months',
      },
      {
        name: 'technologies',
        label: 'Technologies Used',
        type: 'array',
        required: false,
        description: 'Tech stack and tools',
      },
      {
        name: 'project_url',
        label: 'Project URL',
        type: 'url',
        required: false,
        placeholder: 'https://clientproject.com',
      },
    ],
  },
};

/**
 * Get activity configuration for a user type
 */
function getActivityConfig(userTypeSlug: string) {
  return ACTIVITY_CONFIGS[userTypeSlug] || ACTIVITY_CONFIGS.professional;
}

/**
 * Skills configuration for each user type
 * Organizes skills into primary (essential), secondary (advanced), and suggested
 */
const SKILLS_CONFIG: Record<string, SkillCategory> = {
  student: {
    primary: [
      ...SKILL_CATEGORIES.languages.slice(0, 6),
      ...SKILL_CATEGORIES.frontend.slice(0, 4),
    ],
    secondary: [
      ...SKILL_CATEGORIES.backend.slice(0, 4),
      ...SKILL_CATEGORIES.database.slice(0, 3),
    ],
    suggested: [
      ...SKILL_CATEGORIES.academic.slice(0, 5),
      ...SKILL_CATEGORIES.business.slice(0, 3),
    ],
  },

  teacher: {
    primary: [
      ...SKILL_CATEGORIES.teaching.slice(0, 6),
      ...SKILL_CATEGORIES.academic.slice(0, 4),
    ],
    secondary: [
      ...SKILL_CATEGORIES.business.slice(0, 4),
      ...SKILL_CATEGORIES.design.slice(0, 3),
    ],
    suggested: [
      ...SKILL_CATEGORIES.frontend.slice(0, 3),
      'Content Creation',
      'Video Editing',
      'Public Speaking',
    ],
  },

  professional: {
    primary: [
      ...SKILL_CATEGORIES.languages.slice(0, 5),
      ...SKILL_CATEGORIES.frontend.slice(0, 5),
      ...SKILL_CATEGORIES.backend.slice(0, 5),
    ],
    secondary: [
      ...SKILL_CATEGORIES.database,
      ...SKILL_CATEGORIES.devops.slice(0, 5),
    ],
    suggested: [
      ...SKILL_CATEGORIES.design.slice(0, 3),
      ...SKILL_CATEGORIES.business.slice(0, 4),
    ],
  },

  freelancer: {
    primary: [
      ...SKILL_CATEGORIES.languages.slice(0, 4),
      ...SKILL_CATEGORIES.frontend.slice(0, 4),
      ...SKILL_CATEGORIES.backend.slice(0, 3),
    ],
    secondary: [
      ...SKILL_CATEGORIES.database.slice(0, 3),
      ...SKILL_CATEGORIES.design.slice(0, 4),
    ],
    suggested: [
      ...SKILL_CATEGORIES.business,
      'Client Communication',
      'Proposal Writing',
      'Contract Negotiation',
    ],
  },
};

/**
 * Get skills configuration for a user type
 */
function getSkillsConfig(userTypeSlug: string): SkillCategory {
  return SKILLS_CONFIG[userTypeSlug] || SKILLS_CONFIG.professional;
}

/**
 * Dashboard widget configurations
 */
const DASHBOARD_WIDGETS: Record<string, string[]> = {
  student: ['projects', 'courses', 'achievements', 'learning-path'],
  teacher: ['classes', 'students', 'materials', 'calendar'],
  professional: ['projects', 'experience', 'skills', 'analytics'],
  freelancer: ['services', 'clients', 'revenue', 'testimonials'],
};

function getDashboardWidgets(userTypeSlug: string): string[] {
  return DASHBOARD_WIDGETS[userTypeSlug] || DASHBOARD_WIDGETS.professional;
}

/**
 * Portfolio section configurations
 */
const PORTFOLIO_SECTIONS: Record<string, string[]> = {
  student: ['projects', 'education', 'skills', 'achievements'],
  teacher: ['courses', 'materials', 'testimonials', 'certifications'],
  professional: ['projects', 'experience', 'skills', 'certifications'],
  freelancer: ['services', 'portfolio', 'testimonials', 'contact'],
};

function getPortfolioSections(userTypeSlug: string): string[] {
  return PORTFOLIO_SECTIONS[userTypeSlug] || PORTFOLIO_SECTIONS.professional;
}

/**
 * Export utilities for standalone use
 */
export const userTypeHelpers = {
  parseValidationRules,
  getActivityConfig,
  getSkillsConfig,
  getDashboardWidgets,
  getPortfolioSections,
};
