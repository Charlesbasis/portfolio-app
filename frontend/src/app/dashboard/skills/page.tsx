'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, Star, TrendingUp } from 'lucide-react';

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const skills = [
    // Frontend
    { id: 1, name: 'React', category: 'frontend', proficiency: 95, years: 4, icon: '⚛️' },
    { id: 2, name: 'Next.js', category: 'frontend', proficiency: 90, years: 3, icon: '▲' },
    { id: 3, name: 'Vue.js', category: 'frontend', proficiency: 85, years: 3, icon: '💚' },
    { id: 4, name: 'TypeScript', category: 'frontend', proficiency: 88, years: 3, icon: '📘' },
    { id: 5, name: 'Tailwind CSS', category: 'frontend', proficiency: 95, years: 4, icon: '🎨' },
    { id: 6, name: 'HTML5/CSS3', category: 'frontend', proficiency: 98, years: 5, icon: '🌐' },
    
    // Backend
    { id: 7, name: 'Laravel', category: 'backend', proficiency: 92, years: 5, icon: '🔺' },
    { id: 8, name: 'Node.js', category: 'backend', proficiency: 87, years: 4, icon: '💚' },
    { id: 9, name: 'PHP', category: 'backend', proficiency: 90, years: 5, icon: '🐘' },
    { id: 10, name: 'Python', category: 'backend', proficiency: 78, years: 2, icon: '🐍' },
    { id: 11, name: 'Express.js', category: 'backend', proficiency: 85, years: 3, icon: '🚀' },
    
    // Database
    { id: 12, name: 'MySQL', category: 'database', proficiency: 90, years: 5, icon: '🗄️' },
    { id: 13, name: 'PostgreSQL', category: 'database', proficiency: 82, years: 3, icon: '🐘' },
    { id: 14, name: 'MongoDB', category: 'database', proficiency: 80, years: 3, icon: '🍃' },
    { id: 15, name: 'Redis', category: 'database', proficiency: 75, years: 2, icon: '⚡' },
    
    // DevOps
    { id: 16, name: 'Docker', category: 'devops', proficiency: 85, years: 3, icon: '🐳' },
    { id: 17, name: 'AWS', category: 'devops', proficiency: 78, years: 2, icon: '☁️' },
    { id: 18, name: 'Git', category: 'devops', proficiency: 95, years: 5, icon: '🔀' },
    { id: 19, name: 'CI/CD', category: 'devops', proficiency: 80, years: 2, icon: '🔄' },
    { id: 20, name: 'Linux', category: 'devops', proficiency: 82, years: 4, icon: '🐧' },
    
    // Tools
    { id: 21, name: 'VS Code', category: 'tools', proficiency: 95, years: 5, icon: '💻' },
    { id: 22, name: 'Figma', category: 'tools', proficiency: 70, years: 2, icon: '🎨' },
    { id: 23, name: 'Postman', category: 'tools', proficiency: 90, years: 4, icon: '📮' },
    { id: 24, name: 'Jira', category: 'tools', proficiency: 85, years: 3, icon: '📊' },
  ];

  const categories = [
    { value: 'all', label: 'All Skills', count: skills.length },
    { value: 'frontend', label: 'Frontend', count: skills.filter(s => s.category === 'frontend').length },
    { value: 'backend', label: 'Backend', count: skills.filter(s => s.category === 'backend').length },
    { value: 'database', label: 'Database', count: skills.filter(s => s.category === 'database').length },
    { value: 'devops', label: 'DevOps', count: skills.filter(s => s.category === 'devops').length },
    { value: 'tools', label: 'Tools', count: skills.filter(s => s.category === 'tools').length },
  ];

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  const averageProficiency = Math.round(
    filteredSkills.reduce((acc, skill) => acc + skill.proficiency, 0) / filteredSkills.length
  );

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return 'bg-green-500';
    if (proficiency >= 75) return 'bg-blue-500';
    if (proficiency >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 60) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skills Management</h1>
          <p className="text-gray-600 text-lg">Manage your technical skills and expertise</p>
        </div>
        <Button>
          <Plus size={20} className="mr-2" />
          Add New Skill
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Skills</p>
              <p className="text-3xl font-bold text-gray-900">{skills.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Star size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Avg. Proficiency</p>
              <p className="text-3xl font-bold text-gray-900">{averageProficiency}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Expert Level</p>
              <p className="text-3xl font-bold text-gray-900">
                {skills.filter(s => s.proficiency >= 90).length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star size={24} className="text-purple-600 fill-current" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filters */}
      <Card padding="md">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === category.value
                  ? 'bg-white text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <Card key={skill.id} padding="md" hover className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{skill.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{skill.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{skill.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                  <Edit2 size={16} className="text-gray-400 group-hover:text-blue-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                  <Trash2 size={16} className="text-gray-400 group-hover:text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Proficiency</span>
                  <span className="font-bold text-gray-900">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${getProficiencyColor(skill.proficiency)} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  skill.proficiency >= 90 ? 'bg-green-100 text-green-800' :
                  skill.proficiency >= 75 ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getProficiencyLabel(skill.proficiency)}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {skill.years} {skill.years === 1 ? 'year' : 'years'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-12">
            <Star size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-600 mb-6">
              No skills match the selected category.
            </p>
            <Button onClick={() => setSelectedCategory('all')}>
              Show All Skills
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
