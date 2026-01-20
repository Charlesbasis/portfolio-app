import { useState } from 'react';
import { Profile, useUpdateProfile, useProfileSkills, useProfileExperiences, useProfileProjects } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Loader2 } from 'lucide-react';
import { SkillsEditor } from './SkillsEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { Textarea } from '../ui/textarea';

interface ProfileEditorProps {
  profile: Profile;
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    role: profile.role || '',
    location: profile.location || '',
    headline: profile.headline || '',
    summary: profile.summary || '',
    contact_email: profile.contact_email || '',
    linkedin_url: profile.linkedin_url || '',
    github_url: profile.github_url || '',
    portfolio_url: profile.portfolio_url || '',
  });

  const updateProfile = useUpdateProfile();
  const { data: skills } = useProfileSkills(profile.id);
  const { data: experiences } = useProfileExperiences(profile.id);
  const { data: projects } = useProfileProjects(profile.id);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile.mutate({ id: profile.id, ...formData });
  };

  const hasChanges = 
    formData.full_name !== profile.full_name ||
    formData.role !== (profile.role || '') ||
    formData.location !== (profile.location || '') ||
    formData.headline !== (profile.headline || '') ||
    formData.summary !== (profile.summary || '') ||
    formData.contact_email !== (profile.contact_email || '') ||
    formData.linkedin_url !== (profile.linkedin_url || '') ||
    formData.github_url !== (profile.github_url || '') ||
    formData.portfolio_url !== (profile.portfolio_url || '');

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <Card>
        <CardHeader>
          <CardTitle>Header</CardTitle>
          <CardDescription>Your name, title, and location that appear at the top of your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Primary Role / Title</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="Building products that make people's lives easier"
            />
            <p className="text-sm text-muted-foreground">A one-line statement that captures your professional identity</p>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
          <CardDescription>A brief overview of your experience and expertise (3-4 lines recommended)</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="I'm a software engineer with 8+ years of experience building scalable web applications. I specialize in React, TypeScript, and cloud infrastructure. Currently leading a team at..."
            rows={5}
          />
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add keywords that highlight your expertise (ATS-friendly)</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillsEditor profileId={profile.id} skills={skills || []} />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Your work history in reverse chronological order</CardDescription>
        </CardHeader>
        <CardContent>
          <ExperienceEditor profileId={profile.id} experiences={experiences || []} />
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Showcase notable projects you've worked on (optional)</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectsEditor profileId={profile.id} projects={projects || []} />
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>How recruiters and hiring managers can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="jane@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/janedoe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              value={formData.github_url}
              onChange={(e) => handleChange('github_url', e.target.value)}
              placeholder="https://github.com/janedoe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio / Website URL</Label>
            <Input
              id="portfolio_url"
              value={formData.portfolio_url}
              onChange={(e) => handleChange('portfolio_url', e.target.value)}
              placeholder="https://janedoe.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending || !hasChanges}
          size="lg"
          className="shadow-lg"
        >
          {updateProfile.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save changes
        </Button>
      </div>
    </div>
  );
}
