import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Code, 
  Briefcase, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  Star,
  Zap,
  Users,
  Award,
  CheckCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const featuredProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured online shopping platform with real-time inventory management, secure payment processing with Stripe, order tracking, customer analytics, and comprehensive admin dashboard for managing products and orders.',
      image: '/images/project1.jpg',
      technologies: ['Laravel', 'React', 'MySQL', 'Stripe', 'Redis', 'AWS'],
      slug: 'e-commerce-platform',
      featured: true,
      stats: { users: '10k+', transactions: '$2M+' }
    },
    {
      id: 2,
      title: 'Task Management SaaS',
      description: 'Cloud-based project management tool with team collaboration features, real-time updates via WebSockets, kanban boards, time tracking, automated workflows, and comprehensive analytics for productivity monitoring.',
      image: '/images/project2.jpg',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Socket.io', 'Docker'],
      slug: 'task-management-saas',
      featured: true,
      stats: { teams: '500+', tasks: '50k+' }
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      description: 'Unified analytics dashboard for managing multiple social media accounts with scheduled posting, engagement metrics, AI-powered content suggestions, competitor analysis, and comprehensive reporting tools.',
      image: '/images/project3.jpg',
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Redis', 'AWS'],
      slug: 'social-media-dashboard',
      featured: true,
      stats: { accounts: '1k+', posts: '100k+' }
    },
  ];

  const skills = [
    { name: 'React/Next.js', level: 95, color: 'from-blue-500 to-cyan-500' },
    { name: 'Laravel/PHP', level: 90, color: 'from-red-500 to-orange-500' },
    { name: 'Node.js', level: 85, color: 'from-green-500 to-emerald-500' },
    { name: 'TypeScript', level: 88, color: 'from-blue-600 to-indigo-600' },
    { name: 'MySQL/PostgreSQL', level: 87, color: 'from-purple-500 to-pink-500' },
    { name: 'AWS/Docker', level: 80, color: 'from-yellow-500 to-orange-500' },
  ];

  const services = [
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'Creating responsive, modern user interfaces with React, Next.js, Vue.js, and cutting-edge CSS frameworks for exceptional user experiences.',
      features: ['Responsive Design', 'Performance Optimization', 'Cross-browser Compatibility', 'Accessibility Standards'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Briefcase,
      title: 'Backend Development',
      description: 'Building robust server-side applications and RESTful APIs with Laravel, Node.js, efficient database design, and scalable architecture.',
      features: ['RESTful API Development', 'Database Architecture', 'Authentication & Security', 'Scalable Solutions'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Zap,
      title: 'Full Stack Solutions',
      description: 'End-to-end web application development, from concept to deployment and maintenance, with modern DevOps practices and cloud infrastructure.',
      features: ['Cloud Deployment', 'CI/CD Pipeline Setup', 'Performance Monitoring', 'Ongoing Support'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      company: 'TechStart Inc.',
      content: 'Outstanding work! The project was delivered on time with exceptional quality. Communication was excellent throughout, and the final product exceeded our expectations. Highly recommend for any web development project!',
      avatar: '/images/avatar1.jpg',
      rating: 5,
      project: 'E-Commerce Platform'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager, InnovateCo',
      company: 'InnovateCo',
      content: 'Professional, skilled, and a great communicator. Made our vision come to life perfectly. The attention to detail and commitment to quality was impressive. Would definitely work together again!',
      avatar: '/images/avatar2.jpg',
      rating: 5,
      project: 'Task Management App'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, StartupHub',
      company: 'StartupHub',
      content: 'Exceptional developer who truly understands both technical and business requirements. Delivered a scalable solution that has helped our business grow. The code quality is top-notch!',
      avatar: '/images/avatar3.jpg',
      rating: 5,
      project: 'Social Dashboard'
    },
  ];

  const stats = [
    { value: '50+', label: 'Projects Completed', icon: Briefcase },
    { value: '40+', label: 'Happy Clients', icon: Users },
    { value: '5+', label: 'Years Experience', icon: Award },
    { value: '98%', label: 'Client Satisfaction', icon: TrendingUp },
  ];

  const techStack = [
    { name: 'React', icon: '⚛️' },
    { name: 'Laravel', icon: '🔺' },
    { name: 'Node.js', icon: '💚' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'MySQL', icon: '🗄️' },
    { name: 'MongoDB', icon: '🍃' },
    { name: 'Docker', icon: '🐳' },
    { name: 'AWS', icon: '☁️' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Available for Freelance Work</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Full Stack
                <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Web Developer
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                Crafting modern, scalable web applications with cutting-edge technologies. 
                Transforming complex ideas into powerful, user-friendly digital solutions.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/projects"
                  className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
                >
                  View My Work
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
                >
                  Get in Touch
                  <Mail className="ml-2" size={20} />
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                   className="group hover:scale-110 transition-transform">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-lg group-hover:bg-white group-hover:bg-opacity-30">
                    <Github size={24} />
                  </div>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                   className="group hover:scale-110 transition-transform">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-lg group-hover:bg-white group-hover:bg-opacity-30">
                    <Linkedin size={24} />
                  </div>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="group hover:scale-110 transition-transform">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-lg group-hover:bg-white group-hover:bg-opacity-30">
                    <Twitter size={24} />
                  </div>
                </a>
              </div>
            </div>

            {/* Stats Card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white border-opacity-20 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white border-opacity-20">
                      <Sparkles className="text-yellow-300" size={28} />
                      <span className="text-lg font-semibold">Portfolio Highlights</span>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'Projects Completed', value: '50+', icon: Briefcase },
                        { label: 'Years Experience', value: '5+', icon: Award },
                        { label: 'Happy Clients', value: '40+', icon: Users },
                        { label: 'Success Rate', value: '98%', icon: TrendingUp },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                              <Icon size={20} className="text-blue-200" />
                              <span className="text-blue-100">{item.label}</span>
                            </div>
                            <span className="text-2xl font-bold">{item.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 font-medium mb-6">Technologies I Work With</p>
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
                <span className="text-2xl">{tech.icon}</span>
                <span className="font-semibold text-gray-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Technical Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proficient in modern technologies and frameworks to build robust, scalable applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                  <span className="text-2xl font-bold bg-gradient-to-r ${skill.color} bg-clip-text text-transparent">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${skill.color} h-full rounded-full transition-all duration-1000 relative overflow-hidden`}
                    style={{ width: `${skill.level}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600">Some of my recent work that I'm proud of</p>
            </div>
            <Link 
              href="/projects"
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg group mt-4 md:mt-0"
            >
              View All Projects
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all">
                    <Code className="text-white opacity-30 group-hover:opacity-50 transition-opacity group-hover:scale-110 transform duration-300" size={80} />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    {Object.entries(project.stats).map(([key, value]) => (
                      <div key={key} className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-gray-800">
                        {value} {key}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group/link"
                  >
                    View Project Details
                    <ArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link 
              href="/projects"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg"
            >
              View All Projects
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What I Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive web development services to bring your ideas to life with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className={`${service.bgColor} p-8 rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2`}>
                  <div className={`bg-gradient-to-r ${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className={`text-green-600 flex-shrink-0 mt-0.5`} size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Clients Say
            </h2>
            <p className="text-xl text-gray-600">Testimonials from satisfied clients around the world</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-blue-600 text-xs font-semibold mt-1">{testimonial.project}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
                      <Icon size={32} />
                    </div>
                  </div>
                  <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                  <p className="text-blue-100 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-10 text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Let's collaborate and create something amazing together. 
            I'm available for freelance projects, consulting, and full-time opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-10 py-5 rounded-xl font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl text-lg"
            >
              <Mail className="mr-2" size={24} />
              Get In Touch
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-10 py-5 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all text-lg"
            >
              <ExternalLink className="mr-2" size={24} />
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
