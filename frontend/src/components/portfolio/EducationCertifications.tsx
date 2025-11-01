import { Education, Certification, EducationCertificationsProps } from '@/src/types';
import { GraduationCap, Award, ExternalLink, Calendar } from 'lucide-react';

export default function EducationCertifications({
  education,
  certifications,
  isLoadingEducation,
  isLoadingCertifications
}: EducationCertificationsProps) {
  const hasEducation = education && education.length > 0;
  const hasCertifications = certifications && certifications.length > 0;

  if (!hasEducation && !hasCertifications && !isLoadingEducation && !isLoadingCertifications) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Education & Certifications
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Education */}
          {(hasEducation || isLoadingEducation) && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="text-blue-600" size={28} />
                </div>
                Education
              </h3>

              {isLoadingEducation ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-40"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow"
                    >
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {edu.degree} in {edu.field_of_study}
                      </h4>
                      <p className="text-blue-600 font-semibold mb-3">
                        {edu.institution}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Calendar size={16} />
                        <span>
                          {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date!)}
                        </span>
                        {edu.is_current && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold ml-2">
                            Current
                          </span>
                        )}
                      </div>

                      {edu.grade && (
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Grade: {edu.grade}
                          </span>
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {(hasCertifications || isLoadingCertifications) && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="text-purple-600" size={28} />
                </div>
                Certifications
              </h3>

              {isLoadingCertifications ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-32"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-purple-100"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {cert.name}
                          </h4>
                          <p className="text-purple-600 font-semibold mb-2">
                            {cert.issuing_organization}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              Issued {formatDate(cert.issue_date)}
                            </span>
                            {cert.expiry_date && (
                              <span>
                                Expires {formatDate(cert.expiry_date)}
                              </span>
                            )}
                            {!cert.expiry_date && (
                              <span className="text-green-600 font-semibold">
                                No Expiration
                              </span>
                            )}
                          </div>

                          {cert.credential_id && (
                            <p className="text-xs text-gray-500 mb-2">
                              Credential ID: {cert.credential_id}
                            </p>
                          )}
                        </div>

                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            <ExternalLink size={16} />
                            Verify
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
