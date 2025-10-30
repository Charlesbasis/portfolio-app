import { ExperienceTimelineProps } from '@/src/types';
import { Briefcase, Calendar, ExternalLink, MapPin } from 'lucide-react';

export default function ExperienceTimeline({ experiences, isLoading }: ExperienceTimelineProps) {
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Work Experience</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Work Experience</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative">
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Content Card */}
                <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
                    {/* Date Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={16} className="text-blue-600" />
                      <span className="text-sm font-semibold text-blue-600">
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date!)}
                      </span>
                      {exp.is_current && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold ml-2">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Position & Company */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {exp.position}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase size={16} className="text-gray-600" />
                      {exp.company_url ? (
                        <a
                          href={exp.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
                        >
                          {exp.company}
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-gray-600 font-semibold">{exp.company}</span>
                      )}
                    </div>

                    {/* Location */}
                    {exp.location && (
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin size={16} />
                        <span className="text-sm">{exp.location}</span>
                      </div>
                    )}

                    {/* Description */}
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {exp.description}
                      </p>
                    )}

                    {/* Technologies */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
