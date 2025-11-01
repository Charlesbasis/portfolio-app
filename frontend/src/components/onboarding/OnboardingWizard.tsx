import { useState, useEffect } from 'react';
import { 
  Check, ChevronRight, Sparkles, Briefcase, Code, Rocket, 
  User, Building, MapPin, Award, Loader2, AlertCircle 
} from 'lucide-react';
import { useOnboarding } from '@/src/hooks/useOnboarding';
import { OnboardingData } from '@/src/types';

const OnboardingWizard = () => {
  const { 
    isSubmitting, 
    error, 
    usernameCheck, 
    checkUsername, 
    completeOnboarding 
  } = useOnboarding();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    full_name: '',
    username: '',
    job_title: '',
    company: '',
    location: '',
    tagline: '',
    bio: '',
    first_project: undefined,
    skills: []
  });

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    technologies: [] as string[]
  });

  const steps = [
    { id: 0, title: 'Welcome', icon: Sparkles },
    { id: 1, title: 'Profile Basics', icon: User },
    { id: 2, title: 'First Project', icon: Briefcase },
    { id: 3, title: 'Your Skills', icon: Code },
    { id: 4, title: 'Launch', icon: Rocket }
  ];

  // Debounced username check
  useEffect(() => {
    if (formData.username && formData.username.length >= 3) {
      const timer = setTimeout(() => {
        checkUsername(formData.username);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.username, checkUsername]);

  const handleNext = () => {
    // Validate current step before moving forward
    if (currentStep === 1) {
      if (!formData.full_name || !formData.username) {
        return;
      }
      if (!usernameCheck.available) {
        return;
      }
    }

    if (currentStep < steps.length - 1) {
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
    try {
      // Prepare final data with project if provided
      const finalData: OnboardingData = {
        ...formData,
        first_project: projectData.title && projectData.description
          ? {
              title: projectData.title,
              description: projectData.description,
              technologies: projectData.technologies
            }
          : undefined
      };

      await completeOnboarding(finalData);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateProjectData = (field: string, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

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

  // Validation helpers
  const isStep1Valid = formData.full_name && formData.username && usernameCheck.available;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white scale-110'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                    </div>
                    <p className={`text-xs mt-2 font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <Sparkles className="text-white" size={40} />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome to Your Portfolio Journey! 🎉
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Let's build your professional portfolio in just a few simple steps. 
                It'll only take 5 minutes to get started.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <User className="text-blue-600 mx-auto mb-3" size={32} />
                  <h3 className="font-bold text-gray-900 mb-2">Set up profile</h3>
                  <p className="text-sm text-gray-600">Add your basic information</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl">
                  <Briefcase className="text-purple-600 mx-auto mb-3" size={32} />
                  <h3 className="font-bold text-gray-900 mb-2">Add projects</h3>
                  <p className="text-sm text-gray-600">Showcase your best work</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl">
                  <Code className="text-green-600 mx-auto mb-3" size={32} />
                  <h3 className="font-bold text-gray-900 mb-2">List skills</h3>
                  <p className="text-sm text-gray-600">Highlight your expertise</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Let's Get Started
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Step 1: Profile Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Tell us about yourself
                </h2>
                <p className="text-gray-600">
                  This information will be displayed on your public portfolio
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => updateFormData('full_name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username * (for your portfolio URL)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => updateFormData('username', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="johndoe"
                      className={`w-full pl-8 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        usernameCheck.available === false ? 'border-red-300' : 
                        usernameCheck.available === true ? 'border-green-300' : 
                        'border-gray-300'
                      }`}
                      required
                    />
                    {usernameCheck.checking && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={20} />
                    )}
                    {!usernameCheck.checking && usernameCheck.available !== null && (
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        usernameCheck.available ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {usernameCheck.available ? '✓' : '✗'}
                      </div>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${
                    usernameCheck.available === false ? 'text-red-600' : 
                    usernameCheck.available === true ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {usernameCheck.message || `Your portfolio will be at: yoursite.com/portfolio/${formData.username || 'username'}`}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.job_title}
                        onChange={(e) => updateFormData('job_title', e.target.value)}
                        placeholder="Full Stack Developer"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateFormData('company', e.target.value)}
                        placeholder="Acme Inc."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateFormData('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => updateFormData('tagline', e.target.value)}
                    placeholder="Building amazing web experiences"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.tagline?.length || 0}/100</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    placeholder="Tell visitors about yourself, your experience, and what you're passionate about..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: First Project */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Add your first project
                </h2>
                <p className="text-gray-600">
                  Showcase your best work (you can add more later)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projectData.title}
                    onChange={(e) => updateProjectData('title', e.target.value)}
                    placeholder="E-commerce Platform"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={projectData.description}
                    onChange={(e) => updateProjectData('description', e.target.value)}
                    placeholder="Describe what you built, the problem it solves, and your role..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies Used
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {projectData.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {tech}
                        <button
                          onClick={() => updateProjectData('technologies', projectData.technologies.filter((_, idx) => idx !== i))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {techOptions.filter(t => !projectData.technologies.includes(t)).map((tech) => (
                      <button
                        key={tech}
                        onClick={() => updateProjectData('technologies', [...projectData.technologies, tech])}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        + {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You can skip this step and add projects later from your dashboard
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  What are your skills?
                </h2>
                <p className="text-gray-600">
                  Select the technologies you work with
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  {formData.skills.length === 0 ? (
                    <p className="text-gray-400 w-full text-center">Click skills below to add them</p>
                  ) : (
                    formData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => updateFormData('skills', formData.skills.filter((_, idx) => idx !== i))}
                          className="text-white hover:text-gray-200 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonSkills.filter(s => !formData.skills.includes(s)).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => updateFormData('skills', [...formData.skills, skill])}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition-all transform hover:scale-105"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <Award className="inline mr-1" size={16} />
                  <strong>Selected:</strong> {formData.skills.length} skills
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Launch */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 rounded-full mb-4 animate-pulse">
                <Rocket className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                You're All Set! 🚀
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your portfolio is ready to be published. You can always customize it further from your dashboard.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="font-bold text-gray-900 mb-4">Your Portfolio Summary</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile:</span>
                    <span className="font-semibold">{formData.full_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-semibold">@{formData.username || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects:</span>
                    <span className="font-semibold">{projectData.title ? '1' : '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skills:</span>
                    <span className="font-semibold">{formData.skills.length}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check size={24} />
                    Publish My Portfolio
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500">
                Don't worry, you can make changes anytime from your dashboard
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
              >
                ← Back
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !isStep1Valid}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
