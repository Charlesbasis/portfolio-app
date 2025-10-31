'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { useCurrentProfile, useExperiences, useEducation, useCertifications } from '@/src/hooks/useProfile';
import { useUserStats } from '@/src/hooks/useProfile';
import { useSkills } from '@/src/hooks/useApi';
import {
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Clock,
  Trophy,
  Download,
  Mail,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import ExperienceTimeline from '@/src/components/portfolio/ExperienceTimeline';

export default function About() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: stats, isLoading: statsLoading } = useUserStats(profile?.username || '');
  const { data: experiences, isLoading: experiencesLoading } = useExperiences();
  const { data: education, isLoading: educationLoading } = useEducation();
  const { data: certifications, isLoading: certificationsLoading } = useCertifications();
  const { data: skills, isLoading: skillsLoading } = useSkills();

  const isLoading = profileLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="text-yellow-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Set Up
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't set up your profile yet. Please complete your profile to view this page.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Set Up Profile
          </Link>
        </div>
      </div>
    );
  }

  const statsData = [
    { label: 'Years Experience', value: `${profile.years_experience || 0}+`, icon: Clock },
    { label: 'Projects Completed', value: `${stats?.total_projects || 0}+`, icon: Briefcase },
    { label: 'Happy Clients', value: `${stats?.happy_clients || 0}+`, icon: Trophy },
    { label: 'Skills Mastered', value: `${stats?.total_skills || 0}+`, icon: Award },
  ];

  // Group skills by category
  const groupedSkills = Array.isArray(skills) 
    ? skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, typeof skills>)
    : {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Me</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {profile.tagline || 'Building amazing digital experiences with modern technologies'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon size={32} className="text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {profile.bio && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">My Story</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {!skillsLoading && Object.keys(groupedSkills).length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Skills</h2>
              <p className="text-xl text-gray-600">Technologies and tools I work with</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center capitalize">
                    <Code className="mr-2 text-blue-600" size={24} />
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {categorySkills.map((skill) => (
                      <li key={skill.id} className="flex items-center justify-between text-gray-700">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                          {skill.name}
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {skill.proficiency}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {experiences && experiences.length > 0 && (
        <ExperienceTimeline experiences={experiences} isLoading={experiencesLoading} />
      )}

      {/* Education & Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            {education && education.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <GraduationCap className="mr-3 text-blue-600" size={32} />
                  Education
                </h2>
                
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {edu.degree} in {edu.field_of_study}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-2">{edu.institution}</p>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(edu.start_date).getFullYear()} - {edu.is_current ? 'Present' : new Date(edu.end_date!).getFullYear()}
                      </p>
                      {edu.description && (
                        <p className="text-gray-700 leading-relaxed mt-4">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <Award className="mr-3 text-blue-600" size={32} />
                  Certifications
                </h2>
                
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.name}</h3>
                      <p className="text-blue-600 font-semibold mb-1">{cert.issuing_organization}</p>
                      <p className="text-gray-600 text-sm">
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </p>
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2"
                        >
                          View Credential
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 text-blue-100">
            Have a project in mind? I'd love to hear about it and see how I can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105 shadow-lg"
            >
              <Mail className="mr-2" size={20} />
              Get In Touch
            </Link>
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
