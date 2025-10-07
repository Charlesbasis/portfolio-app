'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types';
import { Github, ExternalLink, Calendar, Eye, Heart, Star } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Project Image/Thumbnail */}
      <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden group">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-20">
              {project.title.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Star size={14} fill="currentColor" />
              Featured
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white bg-opacity-95 backdrop-blur-sm p-2.5 rounded-full hover:bg-opacity-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
              title="View Source Code"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={18} className="text-gray-800" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 bg-opacity-95 backdrop-blur-sm p-2.5 rounded-full hover:bg-opacity-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
              title="View Live Demo"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={18} className="text-white" />
            </a>
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium hover:bg-blue-200 transition-colors"
            >
              {tech}
            </span>
          ))}
          {project.technologies && project.technologies.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {project.created_at && (
              <span className="flex items-center gap-1" title="Published Date">
                <Calendar size={14} />
                {new Date(project.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            )}
          </div>

          {/* View Details Link */}
          <Link
            href={`/projects/${project.slug}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1 group"
          >
            View Details
            <ExternalLink 
              size={14} 
              className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" 
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
