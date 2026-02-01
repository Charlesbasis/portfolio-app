import { useState } from 'react';
import { Project, useAddProject, useUpdateProject, useDeleteProject } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Edit2, X, Check, Globe } from 'lucide-react';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface ProjectsEditorProps {
  profileId: string | number;
  projects: Project[];
}

interface ProjectFormData {
  name: string;
  description: string;
  tech_stack: string;
  url: string;
}

const emptyForm: ProjectFormData = {
  name: '',
  description: '',
  tech_stack: '',
  url: '',
};

export function ProjectsEditor({ profileId, projects }: ProjectsEditorProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);

  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleAdd = () => {
    if (!formData.name) {
      toast.error('Required field', {
        description: 'Please enter a project name.'
      });
      return;
    }

    const tech_stack = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);

    addProject.mutate({
      profile_id: profileId,
      name: formData.name,
      description: formData.description || null,
      tech_stack,
      url: formData.url || null,
      sort_order: projects.length,
    }, {
      onSuccess: () => {
        setIsAdding(false);
        setFormData(emptyForm);
        router.refresh();
      }
    });
  };

  const handleUpdate = (id: string | number) => {
    if (!formData.name) {
      toast.error('Required field', {
        description: 'Please enter a project name.'
      });
      return;
    }

    const tech_stack = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);

    updateProject.mutate({
      id,
      profile_id: profileId,
      name: formData.name,
      description: formData.description || null,
      tech_stack,
      url: formData.url || null,
    }, {
      onSuccess: () => {
        setEditingId(null);
        setFormData(emptyForm);
        router.refresh();
      }
    });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description || '',
      tech_stack: project.tech_stack.join(', '),
      url: project.url || '',
    });
  };

  const handleDelete = (project: Project) => {
    deleteProject.mutate(
      { id: project.id, profile_id: profileId },
      {
        onSuccess: () => {
          router.refresh();
        }
      }
    );
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const renderForm = (isEdit: boolean, id?: string | number) => (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <div className="space-y-2">
        <Label>Project Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="E-commerce Platform"
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="A one-sentence description of the project and your role"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>Tech Stack</Label>
        <Input
          value={formData.tech_stack}
          onChange={(e) => setFormData(prev => ({ ...prev, tech_stack: e.target.value }))}
          placeholder="React, TypeScript, PostgreSQL"
        />
        <p className="text-sm text-muted-foreground">Separate technologies with commas</p>
      </div>
      <div className="space-y-2">
        <Label>Project URL</Label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://project.example.com"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          onClick={() => isEdit && id ? handleUpdate(id) : handleAdd()}
          disabled={addProject.isPending || updateProject.isPending}
        >
          <Check className="h-4 w-4 mr-1" />
          {isEdit ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        editingId === project.id ? (
          <div key={project.id}>{renderForm(true, project.id)}</div>
        ) : (
          <Card key={project.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{project.name}</h4>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-link-hover"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                )}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tech_stack.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-tag-bg text-tag-text rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(project)}
                  disabled={deleteProject.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        )
      ))}

      {isAdding ? (
        renderForm(false)
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add project
        </Button>
      )}
    </div>
  );
}
