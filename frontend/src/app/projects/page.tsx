'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Github, ExternalLink, Star, Calendar, Code } from 'lucide-react';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      description: 'A comprehensive online shopping solution with real-time inventory management, secure payment gateway integration, order tracking, and customer analytics dashboard.',
      image: '/images/project1.jpg',
      technologies: ['Laravel', 'React', 'MySQL', 'Stripe', 'Redis'],
      category: 'fullstack',
      github_url: 'https://github.com/username/ecommerce',
      live_url: 'https://demo-ecommerce.com',
      featured: true,
      status: 'published',
      date: '2024-01-15',
      stats: { views: '2.5k', likes: 145 }
    },
    {
      id: 2,
      title: 'Task Management SaaS',
      slug: 'task-management-saas',
      description: 'Cloud-based project management tool featuring real-time collaboration, kanban boards, time tracking, team chat, and comprehensive analytics for productivity monitoring.',
      image: '/images/project2.jpg',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Socket.io', 'AWS'],
      category: 'fullstack',
      github_url: 'https://github.com/username/taskmanager',
      live_url: 'https://demo-taskmanager.com',
      featured: true,
      status: 'published',
      date: '2024-02-20',
      stats: { views: '1.8k', likes: 98 }
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      slug: 'social-media-dashboard',
      description: 'Unified dashboard for managing multiple social media accounts with scheduled posting, analytics, engagement metrics, and AI-powered content suggestions.',
      image: '/images/project3.jpg',
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
      category: 'fullstack',
      github_url: 'https://github.com/username/social-dashboard',
      live_url: 'https://demo-social.com',
      featured: true,
      status: 'published',
      date: '2024-03-10',
      stats: { views: '3.2k', likes: 203 }
    },
    {
      id: 4,
      title: 'Restaurant Booking System',
      slug: 'restaurant-booking-system',
      description: 'Online reservation platform for restaurants with table management, menu display, customer reviews, and integrated payment system for advance bookings.',
      image: '/images/project4.jpg',
      technologies: ['React', 'Express', 'MongoDB', 'Stripe'],
      category: 'frontend',
      github_url: 'https://github.com/username/restaurant-booking',
      live_url: 'https://demo-restaurant.com',
      featured: false,
      status: 'published',
      date: '2023-11-05',
      stats: { views: '1.2k', likes: 67 }
    },
    {
      id: 5,
      title: 'Healthcare Portal',
      slug: 'healthcare-portal',
      description: 'Patient management system with appointment scheduling, medical records, prescription management, and telemedicine video consultation features.',
      image: '/images/project5.jpg',
      technologies: ['Laravel', 'Vue.js', 'MySQL', 'WebRTC'],
      category: 'backend',
      github_url: 'https://github.com/username/healthcare',
      featured: false,
      status: 'published',
      date: '2023-12-18',
      stats: { views: '950', likes: 54 }
    },
    {
      id: 6,
      title: 'Real Estate Marketplace',
      slug: 'real-estate-marketplace',
      description: 'Property listing platform with advanced search filters, virtual tours, mortgage calculator, and integrated messaging between buyers and sellers.',
      image: '/images/project6.jpg',
      technologies: ['Next.js', 'Django', 'PostgreSQL', 'AWS S3'],
      category: 'fullstack',
      github_url: 'https://github.com/username/realestate',
      live_url: 'https://demo-realestate.com',
      featured: false,
      status: 'published',
      date: '2024-01-25',
      stats: { views: '1.5k', likes: 89 }
    },
    {
      id: 7,
      title: 'Fitness Tracking App',
      slug: 'fitness-tracking-app',
      description: 'Comprehensive fitness application with workout plans, nutrition tracking, progress photos, and social features for community motivation.',
      image: '/images/project7.jpg',
      technologies: ['React Native', 'Firebase', 'Node.js'],
      category: 'mobile',
      github_url: 'https://github.com/username/fitness-tracker',
      featured: false,
      status: 'published',
      date: '2023-10-12',
      stats: { views: '880', likes: 45 }
    },
    {
      id: 8,
      title: 'Learning Management System',
      slug: 'learning-management-system',
      description: 'Educational platform with course creation tools, video hosting, quizzes, certificates, student progress tracking, and discussion forums.',
      image: '/images/project8.jpg',
      technologies: ['Laravel', 'React', 'MySQL', 'Vimeo API'],
      category: 'fullstack',
      github_url: 'https://github.com/username/lms',
      live_url: 'https://demo-lms.com',
      featured: false,
      status: 'published',
      date: '2024-02-05',
      stats: { views: '2.1k', likes: 134 }
    },
    {
      id: 9,
      title: 'Event Management Platform',
      slug: 'event-management-platform',
      description: 'Complete event organization solution with ticketing, attendee management, QR code check-ins, and post-event analytics and feedback collection.',
      image: '/images/project9.jpg',
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Stripe'],
      category: 'fullstack',
      github_url: 'https://github.com/username/event-manager',
      featured: false,
      status: 'published',
      date: '2023-09-20',
      stats: { views: '750', likes: 38 }
    },
  ];

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'mobile', label: 'Mobile' },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">My Projects</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Explore my portfolio of web applications, mobile apps, and full-stack solutions. 
            Each project represents a unique challenge and learning experience.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Star size={28} className="text-yellow-500 fill-current" />
              <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all">
                      <Code className="text-white opacity-30 group-hover:opacity-50 transition-opacity" size={80} />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Star size={12} fill="currentColor" />
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={18} className="text-gray-800" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={18} className="text-gray-800" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group"
                      >
                        View Details
                        <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Projects */}
      {regularProjects.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Projects</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gradient-to-br from-gray-400 to-gray-600 overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all">
                      <Code className="text-white opacity-20" size={60} />
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={16} className="text-gray-800" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} className="text-gray-800" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group"
                    >
                      Learn More
                      <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Filter size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Like What You See?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's work together on your next project
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Start a Project
            <ExternalLink className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
