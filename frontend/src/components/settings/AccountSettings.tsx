'use client';

import { useState } from 'react';
import { useUpdateAccount } from '@/src/hooks/useSettings';
import { User as UserType } from '@/src/types';
import { Check, Loader2, Mail, User } from 'lucide-react';

interface Props {
  user?: UserType;
}

export default function AccountSettings({ user }: Props) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isModified, setIsModified] = useState(false);

  const updateAccount = useUpdateAccount();

  const handleChange = () => {
    setIsModified(
      name !== user?.name || email !== user?.email
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateAccount.mutateAsync({ name, email });
      setIsModified(false);
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-600 mt-1">
          Update your account information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline mr-2" size={16} />
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleChange();
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline mr-2" size={16} />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleChange();
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
          <p className="text-sm text-gray-500 mt-1">
            We'll send a verification email if you change this
          </p>
        </div>

        {/* Account Created */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>Account created:</strong>{' '}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'N/A'}
          </p>
        </div>

        {/* Submit Button */}
        {isModified && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={updateAccount.isPending}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateAccount.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setIsModified(false);
              }}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Success Message */}
        {updateAccount.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm font-medium">
              ✓ Account updated successfully
            </p>
          </div>
        )}

        {/* Error Message */}
        {updateAccount.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm font-medium">
              Failed to update account. Please try again.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
