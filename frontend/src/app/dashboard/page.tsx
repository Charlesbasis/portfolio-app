'use client';

import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import { 
  FolderKanban, 
  Award, 
  Mail, 
  TrendingUp,
  Users,
  Eye,
  Heart
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { 
      label: 'Total Projects',
      value: '24',
      icon: FolderKanban,
      color: 'blue',
      trend: '+12%'
    },
    { 
      label: 'Total Skills',
      value: '18',
      icon: Award,
      color: 'green',
      trend: '+5%'
    },
    { 
      label: 'Messages',
      value: '47',
      icon: Mail,
      color: 'purple',
      trend: '+23%'
    },
    { 
      label: 'Total Views',
      value: '12.5k',
      icon: Eye,
      color: 'orange',
      trend: '+18%'
    },
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      status: 'published',
      views: 2543,
      likes: 145,
      date: '2024-10-01'
    },
    {
      id: 2,
      title: 'Task Management SaaS',
      status: 'published',
      views: 1876,
      likes: 98,
      date: '2024-09-28'
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      status: 'draft',
      views: 0,
      likes: 0,
      date: '2024-10-05'
    },
  ];

  const recentMessages = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      subject: 'Project Inquiry',
      date: '2024-10-08',
      read: false
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@example.com',
      subject: 'Collaboration Opportunity',
      date: '2024-10-07',
      read: false
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@example.com',
      subject: 'Question about Services',
      date: '2024-10-06',
      read: true
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your portfolio today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    {stat.trend} from last month
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-full ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                  <Icon size={28} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
            <a href="/dashboard/projects" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {project.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {project.likes}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
            <a href="/dashboard/messages" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className={`p-4 rounded-lg border ${
                message.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{message.name}</h3>
                      {!message.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">{message.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/projects?action=new"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FolderKanban className="text-blue-600" size={24} />
            <span className="font-semibold text-gray-900">Add New Project</span>
          </a>
          <a
            href="/dashboard/skills?action=new"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Award className="text-green-600" size={24} />
            <span className="font-semibold text-gray-900">Add New Skill</span>
          </a>
          <a
            href="/dashboard/messages"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Mail className="text-purple-600" size={24} />
            <span className="font-semibold text-gray-900">View Messages</span>
          </a>
        </div>
      </Card>
    </div>
  );
}
