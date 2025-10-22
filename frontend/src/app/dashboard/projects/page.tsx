'use client';
import { useProjects, useSkills } from '../../../hooks/useApi';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects({ featured: true });
  const { data: skills } = useSkills();
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{/* Render projects */}</div>;
}
