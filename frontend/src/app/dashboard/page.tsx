'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  useDashboardStats,
  useRecentProjects,
  useRecentMessages,
} from '../../hooks/useDashboard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  FolderKanban,
  Award,
  Mail,
  TrendingUp,
  Loader2,
  AlertCircle,
  Briefcase,
  MessageSquare,
  Server,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from '@/src/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats 
  } = useDashboardStats();
  
  const { 
    data: recentProjects, 
    isLoading: projectsLoading,
    refetch: refetchProjects 
  } = useRecentProjects(5);
  
  const { 
    data: recentMessages, 
    isLoading: messagesLoading,
    refetch: refetchMessages 
  } = useRecentMessages(5);

  const handleManualRefresh = async () => {
    setLastRefresh(new Date());
    await Promise.all([
      refetchStats(),
      refetchProjects(),
      refetchMessages()
    ]);
  };

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      setLastRefresh(new Date());
      refetchStats();
      refetchProjects();
      refetchMessages();
    }, 1 * 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, [autoRefresh, refetchStats, refetchProjects, refetchMessages]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card padding="lg" className="max-w-md">
          <div className="text-center">
            <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to load dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              {statsError instanceof Error ? statsError.message : 'An error occurred'}
            </p>
            <Button onClick={handleManualRefresh}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.projects.total || 0,
      icon: FolderKanban,
      color: 'blue',
      detail: `${stats?.projects.published || 0} published, ${stats?.projects.draft || 0} draft`,
    },
    {
      label: 'Total Skills',
      value: stats?.skills.total || 0,
      icon: Award,
      color: 'green',
      detail: Object.keys(stats?.skills.by_category || {}).length + ' categories',
    },
    {
      label: 'Messages',
      value: stats?.messages.total || 0,
      icon: Mail,
      color: 'purple',
      detail: `${stats?.messages.unread || 0} unread`,
      badge: stats?.messages.unread,
    },
    {
      label: 'Experiences',
      value: stats?.experiences.total || 0,
      icon: Briefcase,
      color: 'orange',
      detail: `${stats?.experiences.current || 0} current`,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="space-y-8">
      {/* Header with Refresh Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Admin'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your portfolio today.
          </p>
        </div>

        {/* Refresh Controls */}
        <div className="flex items-center gap-3">
          {/* Last Refresh Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>
              Updated {formatDistanceToNow(lastRefresh)} ago
            </span>
          </div>

          {/* Auto-refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={autoRefresh ? 'Auto-refresh enabled (every 1 min)' : 'Auto-refresh disabled'}
          >
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className={autoRefresh ? 'animate-pulse' : ''} />
              {autoRefresh ? 'Auto' : 'Manual'}
            </div>
          </button>

          {/* Manual Refresh Button */}
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            size="sm"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-xs">{stat.detail}</p>
                </div>
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-full ${
                      colorClasses[stat.color as keyof typeof colorClasses]
                    } flex items-center justify-center`}
                  >
                    <Icon size={28} />
                  </div>
                  {stat.badge !== undefined && stat.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {stat.badge}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <MessageSquare size={24} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.testimonials.total || 0}
              </p>
              <p className="text-sm text-gray-600">Testimonials</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Server size={24} className="text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.services.total || 0}
              </p>
              <p className="text-sm text-gray-600">Services</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.projects.featured || 0}
              </p>
              <p className="text-sm text-gray-600">Featured Projects</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
            <a
              href="/dashboard/projects"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              View All
            </a>
          </div>

          {projectsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : recentProjects && recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <span>
                        {formatDistanceToNow(new Date(project.created_at))} ago
                      </span>
                      {project.featured && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Award size={14} />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderKanban className="text-gray-300 mx-auto mb-2" size={48} />
              <p className="text-gray-600">No projects yet</p>
            </div>
          )}
        </Card>

        {/* Recent Messages */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
            <a
              href="/dashboard/messages"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              View All
            </a>
          </div>

          {messagesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : recentMessages && recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    message.status === 'unread'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {message.name}
                        </h3>
                        {message.status === 'unread' && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.email}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.created_at))} ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="text-gray-300 mx-auto mb-2" size={48} />
              <p className="text-gray-600">No messages yet</p>
            </div>
          )}
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
