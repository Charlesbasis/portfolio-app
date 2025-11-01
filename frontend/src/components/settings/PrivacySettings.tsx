'use client';

import { useState, useEffect } from 'react';
import { useUpdatePrivacy } from '@/src/hooks/useSettings';
import { UserProfile } from '@/src/types';
import { Eye, EyeOff, Globe, Lock, Mail, Phone, Check } from 'lucide-react';

interface Props {
  profile?: UserProfile | null;
}

export default function PrivacySettings({ profile }: Props) {
  const [settings, setSettings] = useState({
    is_public: profile?.is_public || false,
    show_email: profile?.show_email || false,
    show_phone: profile?.show_phone || false,
  });

  const updatePrivacy = useUpdatePrivacy();

  useEffect(() => {
    if (profile) {
      setSettings({
        is_public: profile.is_public,
        show_email: profile.show_email,
        show_phone: profile.show_phone,
      });
    }
  }, [profile]);

  const handleToggle = async (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    try {
      await updatePrivacy.mutateAsync({ [key]: newSettings[key] });
    } catch (error) {
      // Revert on error
      setSettings(settings);
      console.error('Failed to update privacy settings:', error);
    }
  };

  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // console.log('from privacy settings', profile)
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
        <p className="text-gray-600 mt-1">
          Control what information is visible to others
        </p>
      </div>

      <div className="space-y-6">
        {/* Public Profile */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {settings.is_public ? (
                <Globe className="text-blue-600" size={20} />
              ) : (
                <Lock className="text-blue-600" size={20} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Public Profile</h3>
              <p className="text-sm text-gray-600 mt-1">
                Make your portfolio visible to everyone. When disabled, only you can
                see your profile.
              </p>
              {settings.is_public && profile?.username && (
                <p className="text-sm text-blue-600 mt-2">
                  Your profile is live at: /portfolio/{profile?.username}
                </p>
              )}
            </div>
          </div>
          <ToggleSwitch
            checked={settings.is_public}
            onChange={() => handleToggle('is_public')}
          />
        </div>

        {/* Show Email */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Display Email Address</h3>
              <p className="text-sm text-gray-600 mt-1">
                Show your email address on your public profile. Others will be able
                to contact you directly.
              </p>
              {settings.show_email && profile?.email && (
                <p className="text-sm text-gray-500 mt-2">
                  Visible email: {profile.email}
                </p>
              )}
            </div>
          </div>
          <ToggleSwitch
            checked={settings.show_email}
            onChange={() => handleToggle('show_email')}
          />
        </div>

        {/* Show Phone */}
        <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Display Phone Number</h3>
              <p className="text-sm text-gray-600 mt-1">
                Show your phone number on your public profile. Enable this only if
                you want to receive calls.
              </p>
              {settings.show_phone && profile?.phone && (
                <p className="text-sm text-gray-500 mt-2">
                  Visible phone: {profile.phone}
                </p>
              )}
              {settings.show_phone && !profile?.phone && (
                <p className="text-sm text-yellow-600 mt-2">
                  ⚠️ Add phone number in profile settings first
                </p>
              )}
            </div>
          </div>
          <ToggleSwitch
            checked={settings.show_phone}
            onChange={() => handleToggle('show_phone')}
          />
        </div>

        {/* Success Message */}
        {updatePrivacy.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={18} />
              <p className="text-green-800 text-sm font-medium">
                Privacy settings updated successfully
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            <Eye className="inline mr-2" size={16} />
            Privacy Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Review your privacy settings regularly</li>
            <li>Only share contact info you're comfortable with</li>
            <li>You can change these settings anytime</li>
            <li>Public profiles are indexed by search engines</li>
          </ul>
        </div>

        {/* Warning for Private Profile */}
        {!settings.is_public && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <EyeOff className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">
                  Profile is Private
                </h4>
                <p className="text-sm text-yellow-800">
                  Your portfolio is currently not visible to the public. Enable
                  "Public Profile" to share your work with others.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
