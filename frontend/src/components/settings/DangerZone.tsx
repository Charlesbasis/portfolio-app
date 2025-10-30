'use client';

import { useState } from 'react';
import { useDeleteAccount } from '@/src/hooks/useSettings';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2, Lock, Loader2 } from 'lucide-react';

export default function DangerZone() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  
  const deleteAccount = useDeleteAccount();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmation !== 'DELETE') return;

    try {
      await deleteAccount.mutateAsync(password);
      
      // Clear local storage and redirect
      localStorage.removeItem('auth_token');
      router.push('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This action is <strong className="text-red-600">permanent</strong> and{' '}
            <strong className="text-red-600">cannot be undone</strong>. All your data will be permanently deleted:
          </p>
          
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside bg-red-50 p-3 rounded-lg">
            <li>Profile and personal information</li>
            <li>All projects and portfolios</li>
            <li>Skills and experiences</li>
            <li>Education and certifications</li>
            <li>Messages and contacts</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Your password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="DELETE"
            />
          </div>

          {deleteAccount.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">
                Failed to delete account. Please check your password.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleDeleteAccount}
            disabled={
              deleteAccount.isPending ||
              confirmation !== 'DELETE' ||
              !password
            }
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleteAccount.isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete Forever
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setPassword('');
              setConfirmation('');
            }}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
        <p className="text-gray-600 mt-1">
          Irreversible and destructive actions
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">
              Proceed with Caution
            </h3>
            <p className="text-sm text-red-800">
              Actions in this section are permanent and cannot be reversed. Make sure
              you understand the consequences before proceeding.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Account
            </h3>
            <p className="text-gray-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                All your data will be permanently deleted
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Your portfolio will become inaccessible
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                This action cannot be undone
              </li>
            </ul>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              Delete My Account
            </button>
          </div>

          <div className="p-3 bg-red-100 rounded-full">
            <Lock className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Data Export Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Before You Go</h3>
        <p className="text-sm text-blue-800">
          Consider exporting your data before deleting your account. You can download
          your portfolio data as JSON or PDF from your profile settings.
        </p>
      </div>

      {showDeleteModal && <DeleteModal />}
    </div>
  );
}
