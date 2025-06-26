'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/common/Button';

// Enhanced Project interface for the preview
export interface ProjectPreview {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  tags: string[];
  status?: 'planning' | 'construction' | 'completed' | 'recruiting';
  completionDate?: string;
}

interface ProjectsPreviewProps {
  /**
   * Array of projects to display (shows latest 3-4)
   */
  projects: ProjectPreview[];
  
  /**
   * Maximum number of projects to display
   */
  maxItems?: number;
  
  /**
   * Custom className for styling
   */
  className?: string;
}

/**
 * ProjectsPreview component displays a responsive grid of the latest social housing projects
 * with images, titles, locations, tag chips, and a CTA link to view all projects.
 */
export const ProjectsPreview: React.FC<ProjectsPreviewProps> = ({
  projects,
  maxItems = 4,
  className = ''
}) => {
  const t = useTranslations('common');
  const tProjects = useTranslations('projects');

  // Get the latest projects (limited by maxItems)
  const latestProjects = projects.slice(0, maxItems);

  // Status color mapping
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'construction':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'recruiting':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status text mapping
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'planning':
        return '기획중';
      case 'construction':
        return '건설중';
      case 'completed':
        return '완공';
      case 'recruiting':
        return '입주모집';
      default:
        return status;
    }
  };

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <section className={`py-12 px-4 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {tProjects('title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {tProjects('subtitle')}
            </p>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="text-gray-500 text-lg">
                아직 등록된 프로젝트가 없습니다.
              </div>
              <p className="text-gray-400 mt-2">
                곧 다양한 사회주택 프로젝트를 만나보실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {tProjects('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tProjects('subtitle')}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {latestProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              {/* Project Image */}
              <div className="relative aspect-video bg-gray-200">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Status Badge */}
                {project.status && (
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {project.title}
                </h3>
                
                {/* Location */}
                <div className="flex items-center text-gray-600 mb-2">
                  <svg
                    className="w-4 h-4 mr-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm truncate">{project.location}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* View Details Link */}
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                >
                  {t('detail')}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className="text-center">
          <Link href="/projects">
            <Button
              variant="outline"
              size="lg"
              className="inline-flex items-center"
            >
              모든 프로젝트 보기
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
