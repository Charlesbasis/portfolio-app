'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, User, Briefcase, Code, Rocket, 
  ArrowRight, ArrowLeft, Check, X 
} from 'lucide-react';
import { useCompleteOnboarding, useCheckUsername } from '@/src/hooks/useOnboarding';
import { FormData, Step } from '@/src/types';

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    username: '',
    job_title: '',
    company: '',
    location: '',
    tagline: '',
    bio: '',
    project_title: '',
    project_description: '',
    project_technologies: [],
    skills: []
  });
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const completeOnboarding = useCompleteOnboarding();
  const checkUsername = useCheckUsername();

  const steps: Step[] = [
    { id: 0, title: 'Welcome', icon: Sparkles },
    { id: 1, title: 'Profile Basics', icon: User },
    { id: 2, title: 'First Project', icon: Briefcase },
    { id: 3, title: 'Your Skills', icon: Code },
    { id: 4, title: 'Launch', icon: Rocket }
  ];

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

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (currentStep) {
      case 1: // Profile Basics
        if (!formData.full_name.trim()) {
          newErrors.full_name = 'Full name is required';
        }
        if (!formData.username.trim()) {
          newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
          newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
        } else if (usernameStatus === 'taken') {
          newErrors.username = 'Username is already taken';
        }
        if (!formData.job_title.trim()) {
          newErrors.job_title = 'Job title is required';
        }
        break;

      case 2: // First Project (optional but validate if filled)
        if (formData.project_title.trim() && !formData.project_description.trim()) {
          newErrors.project_description = 'Please add a project description';
        }
        break;

      case 3: // Skills
        if (formData.skills.length === 0) {
          newErrors.skills = 'Please select at least one skill';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = async (username: string) => {
    updateFormData('username', username);
    
    if (username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    
    try {
      const result = await checkUsername.mutateAsync(username);
      setUsernameStatus(result.available ? 'available' : 'taken');
    } catch (error) {
      setUsernameStatus('idle');
    }
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

    try {
      await completeOnboarding.mutateAsync({
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
        skills: formData.skills
      });
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
                      <User className="w-8 h-8 text-blue-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Profile</h3>
                      <p className="text-sm text-gray-600">Basic info about you</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <Briefcase className="w-8 h-8 text-purple-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Project</h3>
                      <p className="text-sm text-gray-600">Showcase your work</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Code className="w-8 h-8 text-green-600 mb-2" />
                      <h3 className="font-semibold text-gray-900">Skills</h3>
                      <p className="text-sm text-gray-600">Your expertise</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Profile Basics */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
                  
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.username ? 'border-red-500' : 
                            usernameStatus === 'available' ? 'border-green-500' :
                            usernameStatus === 'taken' ? 'border-red-500' :
                            'border-gray-300'
                          }`}
                          placeholder="johndoe"
                        />
                        {usernameStatus === 'checking' && (
                          <div className="absolute right-3 top-3 text-gray-400">
                            Checking...
                          </div>
                        )}
                        {usernameStatus === 'available' && (
                          <Check className="absolute right-3 top-3 text-green-500" size={20} />
                        )}
                        {usernameStatus === 'taken' && (
                          <X className="absolute right-3 top-3 text-red-500" size={20} />
                        )}
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
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

              {/* Step 2: First Project */}
              {currentStep === 2 && (
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

              {/* Step 3: Skills */}
              {currentStep === 3 && (
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

              {/* Step 4: Launch */}
              {currentStep === 4 && (
                <div className="text-center py-8">
                  <Rocket className="w-20 h-20 mx-auto text-blue-600 mb-6" />
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    You're All Set! 🚀
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Your portfolio is ready to launch. You can always customize it further from your dashboard.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto text-left space-y-3">
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
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
                    <>Processing...</>
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
