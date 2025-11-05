'use client';

import { useCompleteOnboarding } from '@/src/hooks/useApi';
import { useAuth } from '@/src/hooks/useAuth';
import api from '@/src/lib/api';
import { FormData, Step, USER_TYPES, getUserTypeConfig, getUserTypeOptions } from '@/src/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Code,
  Loader2,
  Rocket,
  Sparkles, User,
  Users,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const OnboardingWizard = () => {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    user_type: '', // Initialize user type
    full_name: user?.name || '',
    username: '',
    job_title: '',
    company: '',
    location: '',
    tagline: '',
    bio: '',
    project_title: '',
    project_description: '',
    project_technologies: [],
    skills: [],
    profile_data: {}
  });
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  const completeOnboarding = useCompleteOnboarding();

  const steps: Step[] = [
    { id: 0, title: 'Welcome', icon: Sparkles },
    { id: 1, title: 'Choose Role', icon: Users }, // New step for user type
    { id: 2, title: 'Profile Basics', icon: User },
    { id: 3, title: 'First Project', icon: Briefcase },
    { id: 4, title: 'Your Skills', icon: Code },
    { id: 5, title: 'Launch', icon: Rocket }
  ];

  // Get user type specific configuration
  const userTypeConfig = formData.user_type ? getUserTypeConfig(formData.user_type) : null;

  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'Java', 'PHP', 'Laravel', 'Next.js', 'Vue.js',
    'CSS', 'Tailwind', 'HTML', 'SQL', 'MongoDB',
    'Git', 'Docker', 'AWS', 'Firebase', 'REST API'
  ];

  const techOptions = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js',
    'TypeScript', 'Python', 'Laravel', 'Django', 'PostgreSQL'
  ];

  // User type specific fields configuration
  const getUserTypeFields = () => {
    if (!userTypeConfig) return [];
    
    return userTypeConfig.profileFields.map(field => ({
      ...field,
      value: formData.profile_data?.[field.name] || '',
      onChange: (value: any) => updateProfileData(field.name, value)
    }));
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const updateProfileData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      profile_data: {
        ...prev.profile_data,
        [field]: value
      }
    }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (currentStep) {
      case 1: // User type selection
        if (!formData.user_type) {
          newErrors.user_type = 'Please select your role';
        }
        break;

      case 2: // Profile basics
        if (!formData.full_name.trim()) {
          newErrors.full_name = 'Full name is required';
        }
        if (!formData.username.trim()) {
          newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
          newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
        } else if (usernameStatus === 'taken') {
          newErrors.username = 'Username is already taken';
        } else if (usernameStatus === 'checking') {
          newErrors.username = 'Please wait while we check username availability';
        }
        if (!formData.job_title.trim()) {
          newErrors.job_title = 'Job title is required';
        }
        
        // Validate user type specific required fields
        if (userTypeConfig) {
          userTypeConfig.profileFields.forEach(field => {
            if (field.required && !formData.profile_data?.[field.name]) {
              newErrors[`profile_${field.name}` as keyof FormData] = `${field.label} is required`;
            }
          });
        }
        break;

      case 3: // Project
        if (formData.project_title.trim() && !formData.project_description.trim()) {
          newErrors.project_description = 'Please add a project description';
        }
        break;

      case 4: // Skills
        if (formData.skills.length === 0) {
          newErrors.skills = 'Please select at least one skill';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Username checking (same as before)
  const handleUsernameChange = (username: string) => {
    updateFormData('username', username);
    
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    if (username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameStatus('idle');
      setErrors(prev => ({ ...prev, username: 'Invalid characters in username' }));
      return;
    }

    setUsernameStatus('checking');

    const timeout = setTimeout(async () => {
      try {
        const response = await api.get(`/onboarding/check-username/${username}`);
        
        if (response.data.available) {
          setUsernameStatus('available');
        } else {
          setUsernameStatus('taken');
        }
      } catch (error) {
        console.error('Username check failed:', error);
        setUsernameStatus('idle');
      }
    }, 500);

    setUsernameCheckTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (usernameCheckTimeout) {
        clearTimeout(usernameCheckTimeout);
      }
    };
  }, [usernameCheckTimeout]);

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

    try {
      await completeOnboarding.mutateAsync({
        user_type: formData.user_type,
        full_name: formData.full_name,
        username: formData.username,
        job_title: formData.job_title,
        company: formData.company || undefined,
        location: formData.location || undefined,
        tagline: formData.tagline || undefined,
        bio: formData.bio || undefined,
        project: formData.project_title ? {
          title: formData.project_title,
          description: formData.project_description,
          technologies: formData.project_technologies
        } : undefined,
        skills: formData.skills,
        profile_data: formData.profile_data || {}
      });

      await checkAuth();
      router.push(`/portfolio/${formData.username}`);
    } catch (error: any) {
      console.error('Onboarding failed:', error);
      alert(error.response?.data?.message || 'Failed to complete onboarding. Please try again.');
    }
  };

  const toggleSkill = (skill: string) => {
    updateFormData(
      'skills',
      formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    );
  };

  const toggleTechnology = (tech: string) => {
    updateFormData(
      'project_technologies',
      formData.project_technologies.includes(tech)
        ? formData.project_technologies.filter(t => t !== tech)
        : [...formData.project_technologies, tech]
    );
  };

  const renderUserTypeField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[`profile_${field.name}` as keyof FormData] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={field.label}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[`profile_${field.name}` as keyof FormData] ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            placeholder={field.label}
          />
        );
      
      case 'select':
        return (
          <select
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[`profile_${field.name}` as keyof FormData] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: any) => (
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
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

        {/* Content Area */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-20 h-20 mx-auto text-blue-600 mb-6" />
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Your Portfolio! 🎉
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Let's set up your professional portfolio in just a few steps.
                    This will only take 2-3 minutes.
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Users className="w-8 h-8 text-blue-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Your Role</h3>
                      <p className="text-sm text-gray-600">Choose your profile type</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <User className="w-8 h-8 text-purple-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Profile</h3>
                      <p className="text-sm text-gray-600">Basic info about you</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Code className="w-8 h-8 text-green-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Skills</h3>
                      <p className="text-sm text-gray-600">Your expertise</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: User Type Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What best describes you?
                  </h2>
                  <p className="text-gray-600 mb-6">Choose the role that fits you best - you can customize later</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getUserTypeOptions().map((userType) => {
                      const config = USER_TYPES[userType.value];
                      return (
                        <button
                          key={userType.value}
                          type="button"
                          onClick={() => updateFormData('user_type', userType.value)}
                          className={`p-6 border-2 rounded-xl text-left transition-all ${
                            formData.user_type === userType.value
                              ? `border-${userType.color}-500 bg-${userType.color}-50`
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-lg bg-${userType.color}-100 flex items-center justify-center`}>
                              <Users className={`w-6 h-6 text-${userType.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {userType.label}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {userType.description}
                              </p>
                              {formData.user_type === userType.value && (
                                <div className="mt-3 text-xs text-gray-500">
                                  <p>Includes: {config.onboardingSteps.length} setup steps</p>
                                  <p>Features: {config.dashboardWidgets.length} dashboard widgets</p>
                                </div>
                              )}
                            </div>
                            {formData.user_type === userType.value && (
                              <Check className="text-green-500 flex-shrink-0" size={20} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {errors.user_type && (
                    <p className="text-red-500 text-sm mt-4 text-center">{errors.user_type}</p>
                  )}

                  {formData.user_type && userTypeConfig && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 bg-blue-50 rounded-lg"
                    >
                      <h4 className="font-semibold text-blue-900 mb-2">
                        {userTypeConfig.label} Features:
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• {userTypeConfig.onboardingSteps.length} personalized setup steps</li>
                        <li>• {userTypeConfig.dashboardWidgets.length} custom dashboard widgets</li>
                        <li>• {userTypeConfig.portfolioSections.length} portfolio sections</li>
                        <li>• Specialized fields for {userTypeConfig.label.toLowerCase()}s</li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Profile Basics */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Tell us about yourself
                    {userTypeConfig && (
                      <span className="text-blue-600 text-lg block mt-1">
                        as a {userTypeConfig.label}
                      </span>
                    )}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => updateFormData('full_name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.full_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => handleUsernameChange(e.target.value)}
                          className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.username ? 'border-red-500' : 
                            usernameStatus === 'available' ? 'border-green-500' :
                            usernameStatus === 'taken' ? 'border-red-500' :
                            'border-gray-300'
                          }`}
                          placeholder="johndoe"
                        />
                        <div className="absolute right-3 top-3">
                          {usernameStatus === 'checking' && (
                            <Loader2 className="animate-spin text-gray-400" size={20} />
                          )}
                          {usernameStatus === 'available' && (
                            <Check className="text-green-500" size={20} />
                          )}
                          {usernameStatus === 'taken' && (
                            <X className="text-red-500" size={20} />
                          )}
                        </div>
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                      )}
                      {usernameStatus === 'available' && (
                        <p className="text-green-600 text-sm mt-1">Username is available!</p>
                      )}
                      {usernameStatus === 'taken' && (
                        <p className="text-red-500 text-sm mt-1">Username is already taken</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Your portfolio will be at: yoursite.com/{formData.username || 'username'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={formData.job_title}
                          onChange={(e) => updateFormData('job_title', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.job_title ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Full Stack Developer"
                        />
                        {errors.job_title && (
                          <p className="text-red-500 text-sm mt-1">{errors.job_title}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => updateFormData('company', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Acme Inc."
                        />
                      </div>
                    </div>

                    {/* User Type Specific Fields */}
                    {userTypeConfig && getUserTypeFields()?.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && '*'}
                        </label>
                        {renderUserTypeField(field)}
                        {errors[`profile_${field.name}` as keyof FormData] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`profile_${field.name}` as keyof FormData]}
                          </p>
                        )}
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="San Francisco, CA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => updateFormData('tagline', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Building amazing web experiences"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => updateFormData('bio', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Tell us a bit about yourself, your experience, and what you're passionate about..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Steps 3-5 remain mostly the same */}
              {/* Step 3: First Project */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Add your first project
                  </h2>
                  <p className="text-gray-600 mb-6">Optional - you can skip and add projects later</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={formData.project_title}
                        onChange={(e) => updateFormData('project_title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="E-commerce Platform"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.project_description}
                        onChange={(e) => updateFormData('project_description', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.project_description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows={4}
                        placeholder="Describe what you built, the problem it solves, and your role..."
                      />
                      {errors.project_description && (
                        <p className="text-red-500 text-sm mt-1">{errors.project_description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technologies Used
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {techOptions.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTechnology(tech)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              formData.project_technologies.includes(tech)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Skills */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What are your skills?
                  </h2>
                  <p className="text-gray-600 mb-6">Select all that apply - you can add more later</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {commonSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.skills.includes(skill)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-2">{errors.skills}</p>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{formData.skills.length}</strong> skills selected
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Launch */}
              {currentStep === 5 && (
                <div className="text-center py-8">
                  <Rocket className="w-20 h-20 mx-auto text-blue-600 mb-6" />
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    You're All Set! 🚀
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Your {userTypeConfig?.label.toLowerCase()} portfolio is ready to launch. 
                    You can always customize it further from your dashboard.
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
                      <span>Job Title: <strong>{formData.job_title}</strong></span>
                    </div>
                    {formData.project_title && (
                      <div className="flex items-center">
                        <Check className="text-green-500 mr-3" size={20} />
                        <span>Project: <strong>{formData.project_title}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Check className="text-green-500 mr-3" size={20} />
                      <span>Skills: <strong>{formData.skills.length} added</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
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
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Skip for now
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={(currentStep === 2 && usernameStatus === 'checking')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 0 ? "Let's Start" : 'Continue'}
                  <ArrowRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={completeOnboarding.isPending}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completeOnboarding.isPending ? (
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
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
