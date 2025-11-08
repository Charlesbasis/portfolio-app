import { useState, useEffect } from 'react';
import { 
  USER_TYPES, 
  getUserTypeConfig, 
  getUserTypeOptions,
  SKILL_CATEGORIES 
} from '@/src/config';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Code,
  Loader2,
  Rocket,
  Sparkles,
  User,
  Users,
  X,
  GraduationCap,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const DynamicField = ({ field, value, onChange, error }) => {
  const baseClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
  }`;

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {field.description && (
        <p className="text-xs text-gray-500 mt-1">{field.description}</p>
      )}
      {error && (
        <div className="flex items-center mt-2 text-red-600 text-sm">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

// Technology Selector Component
const TechnologySelector = ({ label, description, options, selected, onChange }) => {
  const toggleTechnology = (tech) => {
    if (selected.includes(tech)) {
      onChange(selected.filter(t => t !== tech));
    } else {
      onChange([...selected, tech]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => toggleTechnology(tech)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected.includes(tech)
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Config
const config = {
  student: {
    value: 'student',
    label: 'Student',
    description: 'Learning and building projects',
    color: 'blue',
    icon: GraduationCap,
    profileFields: [
      {
        name: 'grade_level',
        label: 'Grade Level',
        type: 'select',
        required: true,
        options: [
          { value: 'high-school', label: 'High School' },
          { value: 'undergraduate', label: 'Undergraduate' },
          { value: 'graduate', label: 'Graduate' }
        ]
      },
      {
        name: 'institution',
        label: 'School/University',
        type: 'text',
        required: false,
        placeholder: 'MIT'
      }
    ],
    activityConfig: {
      title: 'Share Your First Project',
      subtitle: 'Show off what you\'ve built',
      fields: [
        {
          name: 'title',
          label: 'Project Title',
          type: 'text',
          required: false,
          placeholder: 'My Awesome App'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          placeholder: 'Describe your project...'
        }
      ]
    },
    skills: {
      primary: ['JavaScript', 'Python', 'React', 'HTML', 'CSS'],
      secondary: ['Node.js', 'SQL', 'Git'],
      suggested: ['Mathematics', 'Physics', 'Problem Solving']
    }
  },
  teacher: {
    value: 'teacher',
    label: 'Teacher/Educator',
    description: 'Sharing knowledge and teaching materials',
    color: 'green',
    icon: BookOpen,
    profileFields: [
      {
        name: 'subject_specialty',
        label: 'Subject Specialty',
        type: 'text',
        required: true,
        placeholder: 'Mathematics'
      },
      {
        name: 'teaching_level',
        label: 'Teaching Level',
        type: 'select',
        required: true,
        options: [
          { value: 'elementary', label: 'Elementary' },
          { value: 'middle', label: 'Middle School' },
          { value: 'high', label: 'High School' },
          { value: 'college', label: 'College' }
        ]
      }
    ],
    activityConfig: {
      title: 'Share a Teaching Resource',
      subtitle: 'Share your teaching materials',
      fields: [
        {
          name: 'title',
          label: 'Resource Title',
          type: 'text',
          required: false,
          placeholder: 'Intro to Algebra Course'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          placeholder: 'Describe your teaching resource...'
        }
      ]
    },
    skills: {
      primary: ['Lesson Planning', 'Google Classroom', 'Zoom', 'Mathematics'],
      secondary: ['Canvas LMS', 'Kahoot', 'Content Creation'],
      suggested: ['Communication', 'Leadership', 'Project Management']
    }
  },
  professional: {
    value: 'professional',
    label: 'Professional Developer',
    description: 'Building production applications',
    color: 'purple',
    icon: Code,
    profileFields: [
      {
        name: 'current_role',
        label: 'Current Role',
        type: 'text',
        required: true,
        placeholder: 'Senior Developer'
      },
      {
        name: 'years_experience',
        label: 'Years of Experience',
        type: 'number',
        required: false,
        placeholder: '5'
      }
    ],
    activityConfig: {
      title: 'Showcase Your Best Project',
      subtitle: 'Share a professional project',
      fields: [
        {
          name: 'title',
          label: 'Project Name',
          type: 'text',
          required: false,
          placeholder: 'Enterprise Platform'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          placeholder: 'Describe the project...'
        }
      ]
    },
    skills: {
      primary: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
      secondary: ['PostgreSQL', 'Docker', 'AWS', 'Redis'],
      suggested: ['Agile', 'Leadership', 'Architecture']
    }
  },
  freelancer: {
    value: 'freelancer',
    label: 'Freelancer',
    description: 'Independent contractor',
    color: 'orange',
    icon: Briefcase,
    profileFields: [
      {
        name: 'hourly_rate',
        label: 'Hourly Rate (USD)',
        type: 'number',
        required: false,
        placeholder: '75'
      },
      {
        name: 'portfolio_url',
        label: 'Portfolio Website',
        type: 'url',
        required: false,
        placeholder: 'https://yoursite.com'
      }
    ],
    activityConfig: {
      title: 'Feature a Client Project',
      subtitle: 'Showcase your client work',
      fields: [
        {
          name: 'title',
          label: 'Project Name',
          type: 'text',
          required: false,
          placeholder: 'Client Website'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: false,
          placeholder: 'Describe the project...'
        }
      ]
    },
    skills: {
      primary: ['React', 'Vue.js', 'Node.js', 'UI/UX Design'],
      secondary: ['Figma', 'PostgreSQL', 'AWS'],
      suggested: ['Client Communication', 'Project Management']
    }
  }
};

export default function DynamicOnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    job_title: '',
    company: '',
    location: '',
    tagline: '',
    bio: '',
    profile_data: {},
    activity_data: {},
    skills: []
  });
  const [errors, setErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSkillSection, setActiveSkillSection] = useState('primary');

  const userTypeConfig = userType ? config[userType] : null;

  const steps = [
    { id: 0, title: 'Welcome', icon: Sparkles },
    { id: 1, title: 'Choose Role', icon: Users },
    { id: 2, title: 'Profile', icon: User },
    { id: 3, title: 'Activity', icon: Briefcase },
    { id: 4, title: 'Skills', icon: Code },
    { id: 5, title: 'Launch', icon: Rocket }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updateProfileData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      profile_data: { ...prev.profile_data, [field]: value }
    }));
  };

  const updateActivityData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      activity_data: { ...prev.activity_data, [field]: value }
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1 && !userType) {
      newErrors.user_type = 'Please select your role';
    }

    if (currentStep === 2) {
      if (!formData.full_name.trim()) {
        newErrors.full_name = 'Full name is required';
      }
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!formData.job_title.trim()) {
        newErrors.job_title = 'Job title is required';
      }

      // Validate user type specific required fields
      if (userTypeConfig) {
        userTypeConfig.profileFields.forEach(field => {
          if (field.required && !formData.profile_data[field.name]) {
            newErrors[`profile_${field.name}`] = `${field.label} is required`;
          }
        });
      }
    }

    if (currentStep === 4 && formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(steps.length - 1);
  };

  const handleComplete = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // console.log('Onboarding complete!', { userType, formData });
      // alert('Onboarding complete! 🎉');
      router.push(`/portfolio/${formData.username}`);
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill) => {
    updateFormData(
      'skills',
      formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    );
  };

  const IconComponent = userTypeConfig?.icon || Users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <span className={`text-xs mt-2 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-20 h-20 mx-auto text-blue-600 mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome! 🎉
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Let's set up your profile in just a few steps
              </p>
            </div>
          )}

          {/* Step 1: User Type Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What best describes you?
              </h2>
              <p className="text-gray-600 mb-6">Choose your role</p>

              <div className="grid grid-cols-2 gap-4">
                {Object.values(config).map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => {
                        setUserType(type.value);
                        setErrors({});
                      }}
                      className={`p-6 border-2 rounded-xl text-left transition-all ${
                        userType === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-${type.color}-100 flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${type.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{type.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                        {userType === type.value && (
                          <Check className="text-green-500" size={20} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.user_type && (
                <p className="text-red-500 text-sm mt-4 text-center">{errors.user_type}</p>
              )}
            </div>
          )}

          {/* Step 2: Profile Basics (Dynamic) */}
          {currentStep === 2 && userTypeConfig && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about yourself
              </h2>
              <p className="text-gray-600 mb-6">as a {userTypeConfig.label}</p>

              <div className="space-y-4">
                {/* Standard fields */}
                <DynamicField
                  field={{ name: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' }}
                  value={formData.full_name}
                  onChange={(v) => updateFormData('full_name', v)}
                  error={errors.full_name}
                />

                <DynamicField
                  field={{ name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'johndoe' }}
                  value={formData.username}
                  onChange={(v) => updateFormData('username', v)}
                  error={errors.username}
                />

                <DynamicField
                  field={{ name: 'job_title', label: 'Job Title', type: 'text', required: true, placeholder: 'Developer' }}
                  value={formData.job_title}
                  onChange={(v) => updateFormData('job_title', v)}
                  error={errors.job_title}
                />

                {/* Dynamic user type fields */}
                {userTypeConfig.profileFields.map(field => (
                  <DynamicField
                    key={field.name}
                    field={field}
                    value={formData.profile_data[field.name]}
                    onChange={(v) => updateProfileData(field.name, v)}
                    error={errors[`profile_${field.name}`]}
                  />
                ))}

                <DynamicField
                  field={{ name: 'bio', label: 'Bio', type: 'textarea', required: false, placeholder: 'Tell us about yourself...' }}
                  value={formData.bio}
                  onChange={(v) => updateFormData('bio', v)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Activity (Dynamic) */}
          {currentStep === 3 && userTypeConfig && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {userTypeConfig.activityConfig.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {userTypeConfig.activityConfig.subtitle}
              </p>

              <div className="space-y-4">
                {userTypeConfig.activityConfig.fields.map(field => (
                  <DynamicField
                    key={field.name}
                    field={field}
                    value={formData.activity_data[field.name]}
                    onChange={(v) => updateActivityData(field.name, v)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Skills (Dynamic) */}
          {currentStep === 4 && userTypeConfig && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your skills?
              </h2>
              <p className="text-gray-600 mb-6">
                Select skills for a {userTypeConfig.label.toLowerCase()}
              </p>

              {/* Skill Section Tabs */}
              <div className="flex space-x-2 mb-4 border-b">
                {['primary', 'secondary', 'suggested'].map(section => (
                  <button
                    key={section}
                    onClick={() => setActiveSkillSection(section)}
                    className={`px-4 py-2 font-medium border-b-2 ${
                      activeSkillSection === section
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                    <span className="ml-2 text-xs">
                      ({userTypeConfig.skills[section].filter(s => formData.skills.includes(s)).length}/
                      {userTypeConfig.skills[section].length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Section Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {userTypeConfig.skills[activeSkillSection].map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.skills.includes(skill)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{formData.skills.length}</strong> skills selected
                </p>
              </div>

              {errors.skills && (
                <p className="text-red-500 text-sm mt-2">{errors.skills}</p>
              )}
            </div>
          )}

          {/* Step 5: Launch */}
          {currentStep === 5 && (
            <div className="text-center py-8">
              <Rocket className="w-20 h-20 mx-auto text-blue-600 mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                You're All Set! 🚀
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your {userTypeConfig?.label.toLowerCase()} portfolio is ready
              </p>

              <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto text-left space-y-3">
                <div className="flex items-center">
                  <Check className="text-green-500 mr-3" size={20} />
                  <span>Role: <strong>{userTypeConfig?.label}</strong></span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-500 mr-3" size={20} />
                  <span>Profile: <strong>{formData.full_name}</strong> (@{formData.username})</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-500 mr-3" size={20} />
                  <span>Skills: <strong>{formData.skills.length} selected</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900"
                >
                  Skip
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  {currentStep === 0 ? "Let's Start" : 'Continue'}
                  <ArrowRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Launch Portfolio
                      <Rocket size={20} className="ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
