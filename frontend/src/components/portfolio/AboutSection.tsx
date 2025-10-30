import { AboutSectionProps } from '@/src/types';
import { Globe, Mail, Phone, User } from 'lucide-react';

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile.bio) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Bio */}
          <div className="md:col-span-2">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Contact Info Card */}
          <div>
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                {profile.show_email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-gray-900 hover:text-blue-600 break-all"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {profile.show_phone && profile.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-gray-900 hover:text-blue-600"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-blue-600 break-all"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-start gap-3">
                    <User className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Resume Button */}
              <button className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
