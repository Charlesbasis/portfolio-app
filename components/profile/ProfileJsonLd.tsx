import { Profile, Skill, Experience } from '@/lib/types';

interface ProfileJsonLdProps {
  profile: Partial<Profile> & { full_name: string };
  skills: Skill[];
  experiences: Experience[];
  baseUrl?: string;
}

export function ProfileJsonLd({ profile, skills, experiences, baseUrl }: ProfileJsonLdProps) {
  // Helper to get field that might be on root or in acf (WP fallback)
  const getField = (obj: any, field: string) => obj[field] ?? obj.acf?.[field];

  const currentExperience = experiences.find(exp => getField(exp, 'is_current'));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name,
    jobTitle: profile.role || profile.headline || undefined,
    description: profile.summary || undefined,
    image: profile.avatar_url || undefined,
    url: baseUrl && profile.username ? `${baseUrl}/${profile.username}` : undefined,
    address: profile.location ? {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    } : undefined,
    knowsAbout: skills.map(s => s.skill_name),
    sameAs: [
      profile.linkedin_url,
      profile.github_url,
      profile.portfolio_url,
    ].filter(Boolean),
    email: profile.contact_email || undefined,
    worksFor: currentExperience ? {
      '@type': 'Organization',
      name: getField(currentExperience, 'company'),
    } : undefined,
  };

  // Remove undefined values
  const cleanJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd) }}
    />
  );
}
