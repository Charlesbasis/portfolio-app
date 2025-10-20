import { MetadataRoute } from 'next';
import { projectsService } from '../services/projects.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await projectsService.getAll();
  
  console.log('from sitemap', projects);
  const projectUrls = projects.map((project) => ({
    url: `https://localhost:3000/projects/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://localhost:3000',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://localhost:3000/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://localhost:3000/projects',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectUrls,
  ];
}
