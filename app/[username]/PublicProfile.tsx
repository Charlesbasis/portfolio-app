'use client';

import { Mail, Linkedin, Github, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProfileJsonLd } from '@/components/profile/ProfileJsonLd';
import Link from 'next/link';

interface PublicProfileProps {
  profile: any;
  skills: any[];
  experiences: any[];
  projects: any[];
}

export default function PublicProfile({ profile, skills, experiences, projects }: PublicProfileProps) {
  return (
    <div className="min-h-screen bg-background">
      <ProfileJsonLd profile={profile} skills={skills || []} experiences={experiences || []} />

      {/* Sticky Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:hidden z-50">
        <ContactButton profile={profile} />
      </div>

      <main className="container mx-auto px-4 py-12 max-w-2xl pb-24 md:pb-12">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
            {profile.full_name}
          </h1>
          {profile.role && (
            <p className="text-xl text-muted-foreground mt-1">{profile.role}</p>
          )}
          {profile.location && (
            <p className="text-muted-foreground mt-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </p>
          )}
          {profile.headline && (
            <p className="text-foreground mt-4 text-lg">{profile.headline}</p>
          )}
          
          {/* Desktop Contact Button */}
          <div className="hidden md:block mt-6">
            <ContactButton profile={profile} />
          </div>
        </header>

        {/* Summary Section */}
        {profile.summary && (
          <Section title="About">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {profile.summary}
            </p>
          </Section>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md"
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <Section title="Experience">
            <div className="space-y-6">
              {experiences.map((exp) => (
                <ExperienceItem key={exp.id} experience={exp} />
              ))}
            </div>
          </Section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </div>
          </Section>
        )}

        {/* Contact Section */}
        <Section title="Contact">
          <div className="flex flex-wrap gap-4">
            {profile.contact_email && (
              <ContactLink
                href={`mailto:${profile.contact_email}`}
                icon={<Mail className="h-4 w-4" />}
                label={profile.contact_email}
              />
            )}
            {profile.linkedin_url && (
              <ContactLink
                href={profile.linkedin_url}
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
              />
            )}
            {profile.github_url && (
              <ContactLink
                href={profile.github_url}
                icon={<Github className="h-4 w-4" />}
                label="GitHub"
              />
            )}
            {profile.portfolio_url && (
              <ContactLink
                href={profile.portfolio_url}
                icon={<Globe className="h-4 w-4" />}
                label="Portfolio"
              />
            )}
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Created with{' '}
            <Link href="/" className="text-primary hover:underline">
              Profolio
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide text-sm">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ExperienceItem({ experience }: { experience: any }) {
  const dateRange = experience.is_current
    ? `${experience.start_date} – Present`
    : `${experience.start_date} – ${experience.end_date || 'Present'}`;

  return (
    <div>
      <h3 className="font-semibold text-foreground">{experience.role}</h3>
      <p className="text-muted-foreground">{experience.company}</p>
      <p className="text-sm text-muted-foreground mb-2">{dateRange}</p>
      {experience.bullets && experience.bullets.length > 0 && (
        <ul className="list-disc list-inside space-y-1 text-foreground">
          {experience.bullets.map((bullet: string, i: number) => (
            <li key={i} className="text-sm">{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectItem({ project }: { project: any }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          {project.description && (
            <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
          )}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tech_stack.map((tech: string, i: number) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 shrink-0"
          >
            <Globe className="h-4 w-4" />
          </a>
        )}
      </div>
    </Card>
  );
}

function ContactLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}

function ContactButton({ profile }: { profile: any }) {
  const contactHref = profile.contact_email 
    ? `mailto:${profile.contact_email}` 
    : profile.linkedin_url || '#';

  if (!profile.contact_email && !profile.linkedin_url) {
    return null;
  }

  return (
    <Button asChild className="w-full md:w-auto">
      <a href={contactHref}>
        <Mail className="h-4 w-4 mr-2" />
        Contact
      </a>
    </Button>
  );
}