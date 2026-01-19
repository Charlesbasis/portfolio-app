import { 
  getAllProjects, 
  getAllExperiences, 
  getAllSkills, 
  getProfile 
} from "@/lib/wordpress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github, Calendar, MapPin, Briefcase, Beaker } from "lucide-react";
import Link from "next/link";
import { StateDemo } from "@/components/state-demo";

export const metadata = {
  title: "Portfolio | Profolio",
  description: "My professional experience, projects, and skills.",
};

export default async function PortfolioPage() {
  const [projects, experiences, skills, profile] = await Promise.all([
    getAllProjects(),
    getAllExperiences(),
    getAllSkills(),
    getProfile(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Profile Header */}
      <section className="mb-16 text-center">
        {profile && (
          <>
            <h1 className="text-4xl font-bold mb-4">{profile.name}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {profile.description || "Welcome to my professional portfolio."}
            </p>
          </>
        )}
      </section>

      {/* Interactive Lab Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
          <Beaker className="h-6 w-6 text-primary" />
          Interactive Lab
        </h2>
        <StateDemo />
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="text-sm py-1 px-3">
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Experiences Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Work Experience</h2>
        <div className="space-y-8">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-8 border-l-2 border-muted last:border-0 pb-8">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{exp.acf.position || exp.title.rendered}</h3>
                  <div className="text-lg text-primary font-medium">{exp.acf.company}</div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 mt-1 md:mt-0">
                  <Calendar className="h-4 w-4" />
                  {exp.acf.start_date} - {exp.acf.is_current ? "Present" : exp.acf.end_date}
                </div>
              </div>
              {exp.acf.location && (
                <div className="text-muted-foreground flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4" />
                  {exp.acf.location}
                </div>
              )}
              <div 
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: exp.content.rendered }} 
              />
              {exp.acf.technologies && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.acf.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
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
        <h2 className="text-2xl font-semibold mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle>{project.title.rendered}</CardTitle>
                <CardDescription>{project.acf.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div 
                  className="text-sm text-muted-foreground mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }}
                />
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.acf.tech_stack?.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.acf.project_url && (
                    <Link 
                      href={project.acf.project_url} 
                      target="_blank"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Link>
                  )}
                  {project.acf.repo_url && (
                    <Link 
                      href={project.acf.repo_url} 
                      target="_blank"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      Source Code
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
