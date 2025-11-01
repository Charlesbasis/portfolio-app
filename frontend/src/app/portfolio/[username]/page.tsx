'use client';

import AboutSection from '@/src/components/portfolio/AboutSection';
import EducationCertifications from '@/src/components/portfolio/EducationCertifications';
import ExperienceTimeline from '@/src/components/portfolio/ExperienceTimeline';
import SkillsDisplay from '@/src/components/portfolio/SkillsDisplay';
import ProjectsGrid from '@/src/components/projects/ProjectsGrid';
import { useProjects, useSkills } from '@/src/hooks/useApi';
import { usePublicCertifications, usePublicEducation, usePublicExperiences, usePublicProfile, useUserStats } from '@/src/hooks/useProfile';
import { PortfolioPageProps } from '@/src/types';
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Download,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Twitter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = use(params);
  
  const { data: profile, isLoading: profileLoading, isError: profileError } = usePublicProfile(username);
  const { data: stats, isLoading: statsLoading } = useUserStats(username);
  const { data: experiences, isLoading: experiencesLoading } = usePublicExperiences(username);
  const { data: education, isLoading: educationLoading } = usePublicEducation(username);
  const { data: certifications, isLoading: certificationsLoading } = usePublicCertifications(username);
  const { data: projects, isLoading: projectsLoading } = useProjects({ user_id: profile?.user_id });
  const { data: skills, isLoading: skillsLoading } = useSkills({ user_id: profile?.user_id }) as any;

  // Loading State
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error State - Profile not found
  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portfolio Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The portfolio for @{username} doesn't exist or is not public.
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Check if profile is public
  if (!profile.is_public) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <AlertCircle className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Private Portfolio
          </h1>
          <p className="text-gray-600 mb-6">
            This portfolio is currently set to private.
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        {/* Cover Image */}
        {profile.cover_image_url && (
          <div className="absolute inset-0">
            <Image
              src={profile.cover_image_url}
              alt="Cover"
              fill
              className="object-cover opacity-30"
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar_url ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-2xl">
                  {getInitials(profile.full_name)}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {profile.full_name}
              </h1>
              
              {profile.tagline && (
                <p className="text-xl text-blue-100 mb-4">
                  {profile.tagline}
                </p>
              )}

              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                {profile.job_title && (
                  <span className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <Briefcase size={16} />
                    {profile.job_title}
                    {profile.company && ` @ ${profile.company}`}
                  </span>
                )}
                
                {profile.location && (
                  <span className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <MapPin size={16} />
                    {profile.location}
                  </span>
                )}

                {profile.years_experience && (
                  <span className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    <Calendar size={16} />
                    {profile.years_experience}+ years experience
                  </span>
                )}
              </div>

              {/* Availability Badge */}
              {profile.availability_status && (
                <div className="mt-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                    profile.availability_status === 'available'
                      ? 'bg-green-500 text-white'
                      : profile.availability_status === 'busy'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    {profile.availability_status === 'available' && 'Available for work'}
                    {profile.availability_status === 'busy' && 'Currently busy'}
                    {profile.availability_status === 'not_available' && 'Not available'}
                  </span>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-3 mt-6 justify-center md:justify-start">
                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <Github size={20} />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {profile.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <Globe size={20} />
                  </a>
                )}
                {profile.show_email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all"
                  >
                    <Mail size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Mail className="mr-2" size={18} />
                Contact Me
              </a>
              <button
                className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                <Download className="mr-2" size={18} />
                Download CV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!statsLoading && stats && (
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.total_projects}+
                </div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.years_experience}+
                </div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.happy_clients}+
                </div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.total_skills}+
                </div>
                <div className="text-gray-600">Skills</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <AboutSection profile={profile} />

      {/* Projects Grid */}
      <ProjectsGrid 
        projects={projects || []} 
        isLoading={projectsLoading} 
      />

      {/* Skills Display */}
      <SkillsDisplay 
        skills={skills || []} 
        isLoading={skillsLoading} 
      />

      {/* Experience Timeline */}
      <ExperienceTimeline 
        experiences={experiences || []} 
        isLoading={experiencesLoading} 
      />

      {/* Education & Certifications */}
      <EducationCertifications
        education={education || []}
        certifications={certifications || []}
        isLoadingEducation={educationLoading}
        isLoadingCertifications={certificationsLoading}
      />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 text-blue-100">
            Have a project in mind? I'd love to hear about it and see how I can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105 shadow-lg"
            >
              <Mail className="mr-2" size={20} />
              Get In Touch
            </a>
            <button className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors transform hover:scale-105">
              <Download className="mr-2" size={20} />
              Download Resume
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
