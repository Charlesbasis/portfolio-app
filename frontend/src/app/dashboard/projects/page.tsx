'use client';

import { useState } from 'react';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import ProjectGrid from '@/components/projects/ProjectGrid';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Plus, Loader2 } from 'lucide-react';

export default function DashboardProjectsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProjects(page);
  const createProject = useCreateProject();

  if (isLoading) {
    return (
      
        
      
    );
  }

  const projects = data?.data.data || [];

  return (
    
      
        
        //   Projects
        //   Manage your portfolio projects
        
        
          
        //   Add Project
        
      

      
    
  );
}
