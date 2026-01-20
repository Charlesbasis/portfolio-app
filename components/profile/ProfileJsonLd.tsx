import { Profile, Skill, Experience } from '@/hooks/useProfile';

interface ProfileJsonLdProps {
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
}

export function ProfileJsonLd({ profile, skills, experiences }: ProfileJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name,
    jobTitle: profile.role || undefined,
    description: profile.summary || undefined,
    url: `${window.location.origin}/${profile.username}`,
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
    worksFor: experiences.length > 0 && experiences[0].is_current ? {
      '@type': 'Organization',
      name: experiences[0].company,
    } : undefined,
  };

  // Remove undefined values
  const cleanJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd, null, 2) }}
    />
  );
}
