'use server';

import { ArrowRight, Briefcase, CheckCircle, Code, ExternalLink, Mail, Star } from 'lucide-react';
import Link from 'next/link';
import ContactForm from '../components/forms/ContactForm';
import { 
  projectsService, 
  skillsService, 
  testimonialsService,
  servicesService,
  contactService,
  authService
} from '../services/api.service';
import { Skill } from '../types';

export default async function Home() {

  // Fetch all data with Promise.allSettled for better error handling
  const results = await Promise.allSettled([
    projectsService.getAll({ featured: true, per_page: 3 }),
    skillsService.getAll(),
    testimonialsService.getAll(),
    servicesService.getAll(),
  ]);

  // Extract data with fallbacks
  const featuredProjects = results[0].status === 'fulfilled' ? results[0].value : [];
  const skills = (results[1].status === 'fulfilled' ? results[1].value : []) as Skill[];
  const testimonials = results[2].status === 'fulfilled' ? results[2].value : [];
  const services = results[3].status === 'fulfilled' ? results[3].value : [];

  // Log errors in development
  const isDevelopment = process.env.NODE_ENV !== 'production';
  if (isDevelopment) {
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const names = ['Projects', 'Skills', 'Testimonials', 'Services'];
        console.error(`Failed to fetch ${names[index]}:`, result.reason);
      }
    });
  }
  
  // console.log('projects', featuredProjects);
  // console.log('skills', skills);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="bg-blue-500 bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  👋 Welcome to my portfolio
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block">Full Stack</span>
                <span className="block bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
                  Web Developer
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Crafting modern, scalable web applications with cutting-edge technologies. 
                Transforming ideas into powerful digital solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  View My Work
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  Get in Touch
                  <Mail className="ml-2" size={20} />
                </Link>
              </div>

              <div className="flex gap-4 mt-8 justify-center lg:justify-start">
                <a
                  href="https://github.com/charlesbasis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-opacity-10 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-20 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github-icon lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/charles-valerio-howlader/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-opacity-10 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-20 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-opacity-10 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-20 transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                      <CheckCircle className="text-green-300" size={24} />
                      <span className="font-semibold">Available for freelance work</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">50+</div>
                        <div className="text-blue-200 text-sm">Projects Completed</div>
                      </div>
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">5+</div>
                        <div className="text-blue-200 text-sm">Years Experience</div>
                      </div>
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">40+</div>
                        <div className="text-blue-200 text-sm">Happy Clients</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Expertise</h2>
            <p className="text-xl text-gray-600">
              Proficient in modern technologies and frameworks to build robust applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills?.map((skill, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{skill.name}</span>
                  <span className="text-blue-600 font-bold">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Projects</h2>
              <p className="text-xl text-gray-600">Some of my recent work</p>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All Projects
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProjects?.map((project) => (
              <div
                key={project.id}
                // key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all">
                    <Code className="text-white opacity-30 group-hover:opacity-50 transition-opacity" size={60} />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{project?.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project?.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project?.technologies?.slice(0, 3)?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/projects/${project?.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group"
                  >
                    View Details
                    <ExternalLink size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Projects
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What I Do</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive web development services to bring your ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 hover:shadow-xl transition-shadow border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Code className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Clients Say</h2>
            <p className="text-xl text-gray-600">Testimonials from satisfied clients</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials?.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
                  "{testimonial?.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial?.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial?.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100">
            Let's collaborate and create something amazing together. 
            I'm available for freelance projects and consultations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Get In Touch
              <Mail className="ml-2" size={20} />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              View Portfolio
              <Briefcase className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">50+</div>
              <div className="text-gray-400">Projects Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">40+</div>
              <div className="text-gray-400">Happy Clients</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">5+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Me</h2>
            <p className="text-xl text-gray-600">
              Let's work together and create something amazing
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
