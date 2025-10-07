import { Project } from '@/types';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  emptyMessage?: string;
}

export default function ProjectGrid({ 
  projects, 
  emptyMessage = 'No projects found.' 
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      
        {emptyMessage}
      
    );
  }

  return (
    
    //   {projects.map((project) => (
        
    //   ))}
    
  );
}
