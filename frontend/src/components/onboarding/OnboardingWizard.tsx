'use client';

import { useCompleteOnboarding } from '@/src/hooks/useApi';
import { useAuth } from '@/src/hooks/useAuth';
import { useUserTypeConfig } from '@/src/hooks/useUserTypeConfig';
import api from '@/src/lib/api';
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
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DynamicField } from './DynamicFormFields';

// helper to dynamically import icons
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    GraduationCap: require('lucide-react').GraduationCap,
    BookOpen: require('lucide-react').BookOpen,
    Code: require('lucide-react').Code,
    Briefcase: require('lucide-react').Briefcase,
    Users: Users,
  };
  return icons[iconName] || Users;
};

export default function OnboardingWizard() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState('');
  
  const { userTypes, currentConfig, isLoading: userTypesLoading } = useUserTypeConfig(selectedUserType);
  
  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    username: '',
    job_title: '',
    company: '',
    location: '',
    tagline: '',
    bio: '',
    profile_data: {} as Record<string, any>,
    activity_data: {} as Record<string, any>,
    skills: [] as string[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const [activeSkillSection, setActiveSkillSection] = useState<'primary' | 'secondary' | 'suggested'>('primary');

  const completeOnboarding = useCompleteOnboarding();

  const steps = [
    { id: 0, title: 'Welcome', icon: Sparkles },
    { id: 1, title: 'Choose Role', icon: Users },
    { id: 2, title: 'Profile', icon: User },
    { id: 3, title: 'Activity', icon: Briefcase },
    { id: 4, title: 'Skills', icon: Code },
    { id: 5, title: 'Launch', icon: Rocket },
  ];

  const handleUsernameChange = (username: string) => {
    updateFormData('username', username);
    
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: 'username' }));
    }
    
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
        setUsernameStatus(response.data.available ? 'available' : 'taken');
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

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: 'field' }));
    }
  };

  const updateProfileData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      profile_data: { ...prev.profile_data, [field]: value },
    }));
  };

  const updateActivityData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      activity_data: { ...prev.activity_data, [field]: value },
    }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1 && !selectedUserType) {
      newErrors.user_type = 'Please select your role';
    }

    if (currentStep === 2) {
      if (!formData.full_name.trim()) {
        newErrors.full_name = 'Full name is required';
      }

      // FIXED: Username validation
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username = 'Only letters, numbers, hyphens and underscores allowed';
      } else if (usernameStatus === 'taken') {
        newErrors.username = 'Username is already taken';
      } else if (usernameStatus === 'checking') {
        newErrors.username = 'Please wait while we check username availability';
      } else if (usernameStatus === 'idle') {
        // THIS IS THE KEY FIX: If username is valid but hasn't been checked yet
        newErrors.username = 'Please wait for username validation to complete';
      }
      // Only allow progression if usernameStatus is 'available'

      if (!formData.job_title.trim()) {
        newErrors.job_title = 'Job title is required';
      }

      // Validate user type specific required fields
      if (currentConfig) {
        currentConfig.profileFields.forEach(field => {
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
    // BLOCK navigation if we're on step 2 and username isn't confirmed available
    if (currentStep === 2) {
      if (usernameStatus !== 'available' && formData.username.trim().length >= 3) {
        setErrors(prev => ({
          ...prev,
          username: 'Username must be available to continue'
        }));
        return; // STOP here
      }
    }

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

  const isValidUser = (user: any): user is User => {
    return user && typeof user.onboarding_completed === 'boolean' &&
      typeof user.username === 'string';
  }
  
  const handleComplete = async () => {
    if (!validateStep()) return;

    try {
      // const userType = userTypes.find(ut => ut.value === selectedUserType);

      await completeOnboarding.mutateAsync({ user_type: selectedUserType, full_name: formData.full_name, username: formData.username, job_title: formData.job_title, company: formData.company, location: formData.location, tagline: formData.tagline, bio: formData.bio, project_title: formData.project_title, project_description: formData.project_description, project_technologies: formData.project_technologies, skills: formData.skills, profile_data: formData.profile_data, activity_data: formData.activity_data });

      const updatedUser = await checkAuth() as User;

      // if (updatedUser?.onboarding_completed) {
      if (isValidUser(updatedUser) && updatedUser.onboarding_completed) {
        router.push(`/portfolio/${formData.username}`);
      }
    } catch (error: any) {
      console.error('Onboarding failed:', error);
      alert(error.response?.data?.message || 'Failed to complete onboarding');
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

  // Show loading while fetching user types
  if (userTypesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Add this debug section temporarily */}
        {/* <div className="fixed top-4 right-4 bg-red-100 p-4 rounded text-xs">
          <div>Step: {currentStep}</div>
          <div>Username Status: {usernameStatus}</div>
          <div>Errors: {Object.keys(errors).join(', ')}</div>
        </div> */}
        
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
                Let's set up your professional portfolio in just a few steps
              </p>
            </div>
          )}

          {/* Step 1: User Type Selection (Dynamic from API) */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What best describes you?
              </h2>
              <p className="text-gray-600 mb-6">Choose your role</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTypes.map((type) => {
                  const IconComponent = getIconComponent(type.icon);
                  return (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedUserType(type.value);
                        setErrors({});
                      }}
                      className={`p-6 border-2 rounded-xl text-left transition-all ${
                        selectedUserType === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-${type.color}-100 flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${type.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{type.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                        {selectedUserType === type.value && (
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
          {currentStep === 2 && currentConfig && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about yourself
              </h2>
              <p className="text-gray-600 mb-6">as a {currentConfig.label}</p>

              <div className="space-y-4">
                {/* Standard fields */}
                <DynamicField
                  field={{ 
                    name: 'full_name', 
                    label: 'Full Name', 
                    type: 'text', 
                    required: true, 
                    placeholder: 'John Doe' 
                  }}
                  value={formData.full_name}
                  onChange={(v) => updateFormData('full_name', v)}
                  error={errors.full_name}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
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
                </div>

                <DynamicField
                  field={{ 
                    name: 'job_title', 
                    label: 'Job Title', 
                    type: 'text', 
                    required: true, 
                    placeholder: 'Developer' 
                  }}
                  value={formData.job_title}
                  onChange={(v) => updateFormData('job_title', v)}
                  error={errors.job_title}
                />

                {/* Dynamic user type fields from API */}
                {currentConfig.profileFields.map(field => (
                  <DynamicField
                    key={field.name}
                    field={field}
                    value={formData.profile_data[field.name]}
                    onChange={(v) => updateProfileData(field.name, v)}
                    error={errors[`profile_${field.name}`]}
                  />
                ))}

                <DynamicField
                  field={{ 
                    name: 'bio', 
                    label: 'Bio', 
                    type: 'textarea', 
                    required: false, 
                    placeholder: 'Tell us about yourself...' 
                  }}
                  value={formData.bio}
                  onChange={(v) => updateFormData('bio', v)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Activity (Dynamic) */}
          {currentStep === 3 && currentConfig && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentConfig.activityConfig.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentConfig.activityConfig.subtitle}
              </p>

              <div className="space-y-4">
                {currentConfig.activityConfig.fields.map(field => (
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
          {currentStep === 4 && currentConfig && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your skills?
              </h2>
              <p className="text-gray-600 mb-6">
                Select skills for a {currentConfig.label.toLowerCase()}
              </p>

              {/* Skill Section Tabs */}
              <div className="flex space-x-2 mb-4 border-b">
                {(['primary', 'secondary', 'suggested'] as const).map(section => (
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
                      ({currentConfig.skills[section].filter(s => formData.skills.includes(s)).length}/
                      {currentConfig.skills[section].length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Section Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {currentConfig.skills[activeSkillSection].map(skill => (
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
          {currentStep === 5 && currentConfig && (
            <div className="text-center py-8">
              <Rocket className="w-20 h-20 mx-auto text-blue-600 mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                You're All Set! 🚀
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your {currentConfig.label.toLowerCase()} portfolio is ready
              </p>

              <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto text-left space-y-3">
                <div className="flex items-center">
                  <Check className="text-green-500 mr-3" size={20} />
                  <span>Role: <strong>{currentConfig.label}</strong></span>
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
                  disabled={currentStep === 2 && usernameStatus === 'checking'}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                >
                  {currentStep === 0 ? "Let's Start" : 'Continue'}
                  <ArrowRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={completeOnboarding.isPending}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}
