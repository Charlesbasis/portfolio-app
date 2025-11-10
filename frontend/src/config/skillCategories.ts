export const SKILL_CATEGORIES = {
  // Academic subjects
  academic: [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'English Literature',
    'Geography',
    'Economics',
    'Psychology',
    'Philosophy',
    'Political Science',
    'Sociology',
  ],

  // Teaching tools and methodologies
  teaching: [
    'Lesson Planning',
    'Classroom Management',
    'Google Classroom',
    'Canvas LMS',
    'Zoom',
    'Microsoft Teams',
    'Kahoot',
    'Nearpod',
    'Educational Technology',
    'Curriculum Development',
    'Assessment Design',
    'Differentiated Instruction',
  ],

  // Programming languages
  languages: [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Ruby',
    'Go',
    'Rust',
    'PHP',
    'Swift',
    'Kotlin',
    'Dart',
    'Scala',
  ],

  // Frontend technologies
  frontend: [
    'React',
    'Next.js',
    'Vue.js',
    'Angular',
    'Svelte',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'SASS',
    'Redux',
    'React Query',
    'Zustand',
  ],

  // Backend technologies
  backend: [
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Laravel',
    'Spring Boot',
    'ASP.NET',
    'Ruby on Rails',
    'FastAPI',
    'NestJS',
    'GraphQL',
  ],

  // Database technologies
  database: [
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'SQLite',
    'Firebase',
    'Supabase',
    'DynamoDB',
    'Prisma',
    'TypeORM',
  ],

  // DevOps & Cloud
  devops: [
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'CI/CD',
    'Git',
    'GitHub Actions',
    'Jenkins',
    'Terraform',
    'Ansible',
  ],

  // Design & Creative
  design: [
    'Figma',
    'Adobe XD',
    'Photoshop',
    'Illustrator',
    'UI/UX Design',
    'Wireframing',
    'Prototyping',
    'User Research',
    'Design Systems',
  ],

  // Business & Soft Skills
  business: [
    'Project Management',
    'Agile',
    'Scrum',
    'Communication',
    'Leadership',
    'Problem Solving',
    'Critical Thinking',
    'Time Management',
    'Team Collaboration',
  ],

  // Mobile Development
  mobile: [
    'React Native',
    'Flutter',
    'iOS Development',
    'Android Development',
    'Expo',
    'SwiftUI',
    'Jetpack Compose',
  ],

  // Data Science & AI
  dataScience: [
    'Machine Learning',
    'Data Analysis',
    'TensorFlow',
    'PyTorch',
    'Pandas',
    'NumPy',
    'scikit-learn',
    'Data Visualization',
  ],
} as const;

export type SkillCategory = keyof typeof SKILL_CATEGORIES;

/**
 * Get all skills from a category
 */
export const getSkillsByCategory = (category: SkillCategory): string[] => {
  return SKILL_CATEGORIES[category] || [];
};

/**
 * Get skills from multiple categories
 */
export const getSkillsFromCategories = (
  categories: SkillCategory[],
  limit?: number
): string[] => {
  const skills = categories.flatMap(cat => SKILL_CATEGORIES[cat]);
  return limit ? skills.slice(0, limit) : skills;
};

/**
 * Search skills across all categories
 */
export const searchSkills = (query: string): string[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(SKILL_CATEGORIES)
    .flat()
    .filter(skill => skill.toLowerCase().includes(lowerQuery));
};
