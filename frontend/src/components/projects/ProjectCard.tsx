'use client';

import Image from 'next/image';
import Link from 'next/link';
// import { Project } from '@/types';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '@/src/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    
    <h1>Project Card</h1>
    
    // {project?.image_url && (
        
          
        
      // )}
      
      
      //   {project?.title}
      //   {project?.description}
        
        
      //     {project.technologies?.map((tech) => (
            
      //         {tech}
            
      //     ))}
        
        
        
          
      //       View Details →
          
          
          
      //       {project?.github_url && (
              
                
              
      //       )}
      //       {project?.live_url && (
              
                
              
      //       )}
          
        
      
    
  );
}
