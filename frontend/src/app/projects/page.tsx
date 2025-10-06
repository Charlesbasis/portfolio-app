'use client';

import { useState } from 'react';
// import { useProjects } from '@/hooks/useProjects';
// import ProjectCard from '@/components/projects/ProjectCard';
import { Loader2 } from 'lucide-react';
import { useProjects } from '@/src/hooks/useProjects';

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProjects(page);

  if (isLoading) {
    return (
      
        
      
    );
  }

  if (error) {
    return (
      
        
        //   Failed to load projects. Please try again later.
        
      
    );
  }

  const projects = data?.data.data || [];
  const pagination = data?.data;

  return (
    
    //   My Projects
      
    //     Here are some of the projects I've worked on. Each one represents a unique
    //     challenge and learning experience.
      

      
    //     {projects.map((project) => (
          
    //     ))}
      

    //   {/* Pagination */}
    //   {pagination && pagination.last_page > 1 && (
        
    //       <button
    //         onClick={() => setPage(page - 1)}
    //         disabled={page === 1}
    //         className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
    //       >
    //         Previous
          
          
    //         Page {pagination.current_page} of {pagination.last_page}
          
    //       <button
    //         onClick={() => setPage(page + 1)}
    //         disabled={page === pagination.last_page}
    //         className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
    //       >
    //         Next
          
        
    //   )}
    
  );
}
