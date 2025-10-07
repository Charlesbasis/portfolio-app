import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Code, Briefcase, Mail, Github, Linkedin, Twitter, ExternalLink, Star } from 'lucide-react';

export default function Home() {
  const featuredProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured online shopping platform with real-time inventory, payment processing, and order management.',
      image: '/images/project1.jpg',
      technologies: ['Laravel', 'React', 'MySQL', 'Stripe'],
      slug: 'e-commerce-platform',
      featured: true,
    },
    {
      id: 2,
      title: 'Task Management SaaS',
      description: 'Cloud-based project management tool with team collaboration, real-time updates, and analytics.',
      image: '/images/project2.jpg',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Socket.io'],
      slug: 'task-management-saas',
      featured: true,
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for managing multiple social media accounts with automated posting and insights.',
      image: '/images/project3.jpg',
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'Redis'],
      slug: 'social-media-dashboard',
      featured: true,
    },
  ];

  const skills = [
    { name: 'React/Next.js', level: 95 },
    { name: 'Laravel/PHP', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'TypeScript', level: 88 },
    { name: 'MySQL/PostgreSQL', level: 87 },
    { name: 'AWS/Docker', level: 80 },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'Outstanding work! Delivered our project on time with exceptional quality. Highly recommend!',
      avatar: '/images/avatar1.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager, InnovateCo',
      content: 'Professional, skilled, and great communicator. Made our vision come to life perfectly.',
      avatar: '/images/avatar2.jpg',
    },
  ];

  return (
    
      {/* Hero Section */}
      
        
        
        
        
          
            
              
                Full Stack
                Web Developer
              
              
                Crafting modern, scalable web applications with cutting-edge technologies. 
                Transforming ideas into powerful digital solutions.
              
              
              
                
                  View My Work
                  
                
                
                  Get in Touch
                  
                
              

              
                
                  
                
                
                  
                
                
                  
                
              
            

            
              
                
                
                  
                    
                      
                      Available for freelance work
                    
                    
                      50+
                      Projects Completed
                    
                    
                      5+
                      Years Experience
                    
                    
                      40+
                      Happy Clients
                    
                  
                
              
            
          
        
      

      {/* Skills Overview */}
      
        
          
            Technical Expertise
            
              Proficient in modern technologies and frameworks to build robust applications
            
          

          
            {skills.map((skill, index) => (
              
                
                  {skill.name}
                  {skill.level}%
                
                
                  
                
              
            ))}
          
        
      

      {/* Featured Projects */}
      
        
          
            
              Featured Projects
              Some of my recent work
            
            
              View All Projects
              
            
          

          
            {featuredProjects.map((project) => (
              
                
                  
                    
                  
                  
                    
                      
                      Featured
                    
                  
                
                
                
                  {project.title}
                  {project.description}
                  
                  
                    {project.technologies.slice(0, 3).map((tech) => (
                      
                        {tech}
                      
                    ))}
                  
                  
                  
                    View Details
                    
                  
                
              
            ))}
          

          
            
              View All Projects
              
            
          
        
      

      {/* Services Section */}
      
        
          
            What I Do
            
              Comprehensive web development services to bring your ideas to life
            
          

          
            
              
                
              
              Frontend Development
              
                Creating responsive, modern user interfaces with React, Next.js, Vue.js, and cutting-edge CSS frameworks.
              
              
                
                  ✓
                  Responsive Design
                
                
                  ✓
                  Performance Optimization
                
                
                  ✓
                  Cross-browser Compatibility
                
              
            

            
              
                
              
              Backend Development
              
                Building robust server-side applications and APIs with Laravel, Node.js, and efficient database design.
              
              
                
                  ✓
                  RESTful API Development
                
                
                  ✓
                  Database Architecture
                
                
                  ✓
                  Authentication & Security
                
              
            

            
              
                
              
              Full Stack Solutions
              
                End-to-end web application development, from concept to deployment and maintenance.
              
              
                
                  ✓
                  Cloud Deployment (AWS, Vercel)
                
                
                  ✓
                  CI/CD Pipeline Setup
                
                
                  ✓
                  Performance Monitoring
                
              
            
          
        
      

      {/* Testimonials */}
      
        
          
            What Clients Say
            Testimonials from satisfied clients
          

          
            {testimonials.map((testimonial, index) => (
              
                
                  {[...Array(5)].map((_, i) => (
                    
                  ))}
                
                
                  "{testimonial.content}"
                
                
                  
                    {testimonial.name.charAt(0)}
                  
                  
                    {testimonial.name}
                    {testimonial.role}
                  
                
              
            ))}
          
        
      

      {/* CTA Section */}
      
        
          Ready to Start Your Project?
          
            Let's collaborate and create something amazing together. 
            I'm available for freelance projects and consultations.
          
          
            
              Get In Touch
              
            
            
              View Portfolio
              
            
          
        
      

      {/* Stats Section */}
      
        
          
            
              50+
              Projects Completed
            
            
              40+
              Happy Clients
            
            
              5+
              Years Experience
            
            
              24/7
              Support Available
            
          
        
      
    
  );
}
