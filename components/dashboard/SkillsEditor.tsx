import { useState } from 'react';
import { Skill, useAddSkill, useDeleteSkill } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface SkillsEditorProps {
  profileId: string | number;
  skills: Skill[];
}

export function SkillsEditor({ profileId, skills }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState('');
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();

  const handleAddSkill = () => {
    const skillName = newSkill.trim();
    if (!skillName) return;
    
    // Check for duplicates
    if (skills.some(s => s.skill_name.toLowerCase() === skillName.toLowerCase())) {
      return;
    }

    addSkill.mutate({ profile_id: profileId, skill_name: skillName });
    setNewSkill('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleDelete = (skill: Skill) => {
    deleteSkill.mutate({ id: skill.id, profile_id: profileId });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddSkill}
          disabled={!newSkill.trim() || addSkill.isPending}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-tag-bg text-tag-text text-sm rounded-md"
            >
              {skill.skill_name}
              <button
                onClick={() => handleDelete(skill)}
                className="hover:text-destructive ml-1"
                disabled={deleteSkill.isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No skills added yet. Add skills that match job descriptions you're targeting.
        </p>
      )}
    </div>
  );
}
