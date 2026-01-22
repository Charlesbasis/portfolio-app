import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getExperiencesByProfileId,
  getFirstProfile,
  getProjectsByProfileId,
  getSkillsByProfileId
} from "@/lib/profile";
import {
  getAllExperiences,
  getAllProjects,
  getAllSkills,
  getProfile as getWpProfile
} from "@/lib/wordpress";
import { ProfileJsonLd } from "@/components/profile/ProfileJsonLd";
import { siteConfig } from "@/site.config";
import { Briefcase, Calendar, ExternalLink, Github, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Experience, Project, Skill, Profile } from "@/lib/types";

export const metadata = {
  title: "Portfolio | Profolio",
  description: "My professional experience, projects, and skills.",
};

export default async function PortfolioPage() {
  // Try to get the custom profile first
  const customProfile = await getFirstProfile();
  
  let projects: any[], experiences: any[], skills: Skill[], profileData: Partial<Profile> & { full_name: string } | null;

  if (customProfile) {
    const [p, e, s] = await Promise.all([
      getProjectsByProfileId(customProfile.id.toString()),
      getExperiencesByProfileId(customProfile.id.toString()),
      getSkillsByProfileId(customProfile.id.toString()),
    ]);
    
    // Map to local types for JSON-LD and UI
    projects = p.map(proj => ({
      ...proj,
      title: { rendered: proj.name },
      excerpt: { rendered: proj.description || "" },
      acf: {
        description: proj.description,
        tech_stack: proj.tech_stack,
        project_url: proj.url,
        repo_url: ""
      }
    }));
    
    experiences = e.map(exp => ({
      ...exp,
      title: { rendered: exp.role },
      content: { rendered: exp.bullets.length > 0 ? `<ul class="list-disc pl-5 space-y-1">${exp.bullets.map(b => `<li>${b}</li>`).join("")}</ul>` : "" },
      acf: {
        company: exp.company,
        position: exp.role,
        start_date: exp.start_date,
        end_date: exp.end_date,
        is_current: exp.is_current,
        location: "",
        technologies: []
      }
    }));
    
    skills = s;
    profileData = customProfile as unknown as Profile;
  } else {
    // Fallback to WordPress
    const [wpProjects, wpExperiences, wpSkills, wpProfile] = await Promise.all([
      getAllProjects(),
      getAllExperiences(),
      getAllSkills(),
      getWpProfile(),
    ]);
    
    projects = wpProjects;
    experiences = wpExperiences;
    skills = wpSkills.map(s => ({ id: s.id, profile_id: 0, skill_name: s.name }));
    profileData = wpProfile ? {
      full_name: wpProfile.name,
      summary: wpProfile.description,
      avatar_url: null,
      role: "Professional",
    } : null;
  }

  if (!profileData) {
    return <div className="container py-20 text-center">No profile found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <ProfileJsonLd 
        profile={profileData as any} 
        skills={skills} 
        experiences={experiences as any} 
        baseUrl={siteConfig.site_domain} 
      />
      
      {/* Profile Header */}
      <section className="mb-20 flex flex-col items-center text-center">
        {profileData.avatar_url && (
          <div className="relative w-32 h-32 mb-6 group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors" />
            <Image
              src={profileData.avatar_url}
              alt={profileData.full_name}
              fill
              className="rounded-full object-cover border-4 border-background relative z-10 shadow-xl"
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{profileData.full_name}</h1>
        {profileData.role && (
          <p className="text-xl text-primary font-medium mb-4">{profileData.role}</p>
        )}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {profileData.summary || profileData.headline || "Welcome to my professional portfolio."}
        </p>
      </section>

      {/* Skills Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Expertise</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="text-sm py-1.5 px-4 font-medium">
              {skill.skill_name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Experiences Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-10">Professional Journey</h2>
        <div className="space-y-12">
          {experiences.map((exp: any) => (
            <div key={exp.id} className="relative pl-8 border-l-2 border-muted hover:border-primary transition-colors last:border-0 pb-8">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{exp.acf.position || exp.title.rendered}</h3>
                  <div className="text-lg text-primary font-semibold">{exp.acf.company}</div>
                </div>
                <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full text-muted-foreground flex items-center gap-2 mt-2 md:mt-0">
                  <Calendar className="h-4 w-4" />
                  {exp.acf.start_date} - {exp.acf.is_current ? "Present" : exp.acf.end_date}
                </div>
              </div>
              {exp.acf.location && (
                <div className="text-muted-foreground flex items-center gap-2 mb-4 text-sm">
                  <MapPin className="h-4 w-4" />
                  {exp.acf.location}
                </div>
              )}
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: exp.content.rendered }} 
              />
              {exp.acf.technologies && exp.acf.technologies.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {exp.acf.technologies.map((tech: string) => (
                    <Badge key={tech} variant="outline" className="text-xs font-normal">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <h2 className="text-2xl font-bold mb-10">Selected Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project: any) => (
            <Card key={project.id} className="group border-muted bg-card/50 hover:bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{project.title.rendered}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">{project.acf.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }}
                />
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {project.acf.tech_stack?.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-primary/5 text-primary border-none">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-6 items-center border-t pt-6">
                  {project.acf.project_url && (
                    <Link 
                      href={project.acf.project_url} 
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Preview
                    </Link>
                  )}
                  {project.acf.repo_url && (
                    <Link 
                      href={project.acf.repo_url} 
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      View Code
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
