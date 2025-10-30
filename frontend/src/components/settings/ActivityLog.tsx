'use client';

import { useActivityLog } from '@/src/hooks/useSettings';
import { 
  Activity, 
  Briefcase, 
  Code, 
  FileText, 
  Loader2,
  Clock
} from 'lucide-react';

export default function ActivityLog() {
  const { data: activities, isLoading } = useActivityLog();

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return Code;
      case 'experience':
        return Briefcase;
      case 'skill':
        return Activity;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-600';
      case 'experience':
        return 'bg-green-100 text-green-600';
      case 'skill':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
        <p className="text-gray-600 mt-1">
          Your recent actions and updates
        </p>
      </div>

      {activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const colorClass = getTypeColor(activity.type);

            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.action}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Activity className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Activity Yet
          </h3>
          <p className="text-gray-600">
            Your recent actions will appear here
          </p>
        </div>
      )}

      {/* Activity Types Legend */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3">Activity Types</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-100 text-blue-600 rounded">
              <Code size={14} />
            </div>
            <span className="text-blue-800">Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-100 text-green-600 rounded">
              <Briefcase size={14} />
            </div>
            <span className="text-blue-800">Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-purple-100 text-purple-600 rounded">
              <Activity size={14} />
            </div>
            <span className="text-blue-800">Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gray-100 text-gray-600 rounded">
              <FileText size={14} />
            </div>
            <span className="text-blue-800">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
}
