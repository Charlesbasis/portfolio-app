import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    
      
        
        //   {/* Brand */}
          
        //     Portfolio
            
        //       Full Stack Web Developer specializing in modern web technologies.
            
          

        //   {/* Quick Links */}
          
        //     Quick Links
            
              
                
        //           Home
                
              
              
                
        //           Projects
                
              
              
                
        //           About
                
              
              
                
        //           Contact
                
              
            
          

        //   {/* Services */}
          
        //     Services
            
        //       Web Development
        //       API Development
        //       UI/UX Design
        //       Consulting
            
          

        //   {/* Social Links */}
          
        //     Connect
            
              
                
              
              
                
              
              
                
              
              
                
              
            
          
        

        
        //   &copy; {currentYear} Full Stack Developer. All rights reserved.
        
      
    
  );
}
