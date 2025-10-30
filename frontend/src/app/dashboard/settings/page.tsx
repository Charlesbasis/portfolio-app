'use client';

import { useState } from 'react';
import { useSettings } from '@/src/hooks/useSettings';
import { 
  User, 
  Shield, 
  Bell, 
  Trash2, 
  Activity,
  Settings as SettingsIcon,
  Loader2 
} from 'lucide-react';
import AccountSettings from '@/src/components/settings/AccountSettings';
import ProfileSettings from '@/src/components/settings/ProfileSettings';
import PrivacySettings from '@/src/components/settings/PrivacySettings';
import SecuritySettings from '@/src/components/settings/SecuritySettings';
import DangerZone from '@/src/components/settings/DangerZone';
import ActivityLog from '@/src/components/settings/ActivityLog';

type TabType = 'account' | 'profile' | 'privacy' | 'security' | 'activity' | 'danger';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const { data: settings, isLoading } = useSettings();

  const tabs = [
    { id: 'account' as TabType, label: 'Account', icon: User },
    { id: 'profile' as TabType, label: 'Profile', icon: SettingsIcon },
    { id: 'privacy' as TabType, label: 'Privacy', icon: Shield },
    { id: 'security' as TabType, label: 'Security', icon: Bell },
    { id: 'activity' as TabType, label: 'Activity', icon: Activity },
    { id: 'danger' as TabType, label: 'Danger Zone', icon: Trash2 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Layout */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === 'danger';

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? isDanger
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats Card */}
          {settings && (
            <div className="mt-8 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-semibold">{settings.stats.projects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills</span>
                  <span className="font-semibold">{settings.stats.skills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experiences</span>
                  <span className="font-semibold">{settings.stats.experiences}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {activeTab === 'account' && <AccountSettings user={settings?.user} />}
            {activeTab === 'profile' && <ProfileSettings profile={settings?.profile} />}
            {activeTab === 'privacy' && <PrivacySettings profile={settings?.profile} />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'activity' && <ActivityLog />}
            {activeTab === 'danger' && <DangerZone />}
          </div>
        </div>
      </div>
    </div>
  );
}
