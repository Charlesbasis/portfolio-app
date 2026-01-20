import { useState } from 'react';
import { Experience, useAddExperience, useUpdateExperience, useDeleteExperience } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { toast } from "sonner";

interface ExperienceEditorProps {
  profileId: string | number;
  experiences: Experience[];
}

interface ExperienceFormData {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  bullets: string;
}

const emptyForm: ExperienceFormData = {
  company: '',
  role: '',
  start_date: '',
  end_date: '',
  is_current: false,
  bullets: '',
};

export function ExperienceEditor({ profileId, experiences }: ExperienceEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>(emptyForm);

  const addExperience = useAddExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const handleAdd = () => {
    if (!formData.company || !formData.role || !formData.start_date) {
      toast.error('Required fields', {
        description: 'Please fill in company, role, and start date.'
      });
      return;
    }

    const bullets = formData.bullets.split('\n').filter(b => b.trim());
    
    addExperience.mutate({
      profile_id: profileId,
      company: formData.company,
      role: formData.role,
      start_date: formData.start_date,
      end_date: formData.is_current ? '' : formData.end_date,
      is_current: formData.is_current,
      bullets,
      sort_order: experiences.length,
    }, {
      onSuccess: () => {
        setIsAdding(false);
        setFormData(emptyForm);
      }
    });
  };

  const handleUpdate = (id: string | number) => {
    if (!formData.company || !formData.role || !formData.start_date) {
      toast.error('Required fields', {
        description: 'Please fill in company, role, and start date.'
      });
      return;
    }

    const bullets = formData.bullets.split('\n').filter(b => b.trim());

    updateExperience.mutate({
      id,
      profile_id: profileId,
      company: formData.company,
      role: formData.role,
      start_date: formData.start_date,
      end_date: formData.is_current ? '' : formData.end_date,
      is_current: formData.is_current,
      bullets,
    }, {
      onSuccess: () => {
        setEditingId(null);
        setFormData(emptyForm);
      }
    });
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      role: exp.role,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current || false,
      bullets: exp.bullets.join('\n'),
    });
  };

  const handleDelete = (exp: Experience) => {
    deleteExperience.mutate({ id: exp.id, profile_id: profileId });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const renderForm = (isEdit: boolean, id?: string | number) => (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Company *</Label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            placeholder="Acme Inc."
          />
        </div>
        <div className="space-y-2">
          <Label>Role / Title *</Label>
          <Input
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Senior Engineer"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Input
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            placeholder="Jan 2022"
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            placeholder="Dec 2023"
            disabled={formData.is_current}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_current"
          checked={formData.is_current}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_current: !!checked }))}
        />
        <Label htmlFor="is_current" className="font-normal">I currently work here</Label>
      </div>
      <div className="space-y-2">
        <Label>Key Accomplishments</Label>
        <Textarea
          value={formData.bullets}
          onChange={(e) => setFormData(prev => ({ ...prev, bullets: e.target.value }))}
          placeholder="One bullet point per line&#10;Led team of 5 engineers to deliver new product&#10;Reduced page load time by 40%"
          rows={4}
        />
        <p className="text-sm text-muted-foreground">One accomplishment per line. Focus on impact and results.</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button 
          onClick={() => isEdit && id ? handleUpdate(id) : handleAdd()}
          disabled={addExperience.isPending || updateExperience.isPending}
        >
          <Check className="h-4 w-4 mr-1" />
          {isEdit ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        editingId === exp.id ? (
          <div key={exp.id}>{renderForm(true, exp.id)}</div>
        ) : (
          <Card key={exp.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{exp.role}</h4>
                <p className="text-muted-foreground">{exp.company}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date || 'Present'}
                </p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(exp)}
                  disabled={deleteExperience.isPending}
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
          Add experience
        </Button>
      )}
    </div>
  );
}
