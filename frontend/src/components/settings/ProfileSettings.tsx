'use client';

import { useState, useRef } from 'react';
import { UserProfile } from '@/src/types';
import { 
  useUpdateProfile, 
  useUploadAvatar, 
  useUploadCoverImage,
  useDeleteAvatar,
  useDeleteCoverImage
} from '@/src/hooks/useProfile';
import { Camera, Trash2, Upload, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Props {
  profile?: UserProfile | null;
}

export default function ProfileSettings({ profile }: Props) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    job_title: profile?.job_title || '',
    company: profile?.company || '',
    years_experience: profile?.years_experience || 0,
    phone: profile?.phone || '',
    github_url: profile?.github_url || '',
    linkedin_url: profile?.linkedin_url || '',
    twitter_url: profile?.twitter_url || '',
  });

  const [isModified, setIsModified] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const uploadCover = useUploadCoverImage();
  const deleteAvatar = useDeleteAvatar();
  const deleteCover = useDeleteCoverImage();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsModified(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(formData);
      setIsModified(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar.mutateAsync(file);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadCover.mutateAsync(file);
    } catch (error) {
      console.error('Failed to upload cover:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600 mt-1">
          Customize your public portfolio appearance
        </p>
      </div>

      {/* Cover Image */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image
        </label>
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden">
          {profile?.cover_image_url && (
            <Image
              src={profile.cover_image_url}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={() => coverInputRef.current?.click()}
              className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
              disabled={uploadCover.isPending}
            >
              {uploadCover.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Upload size={18} />
              )}
              Upload New
            </button>
            
            {profile?.cover_image_url && (
              <button
                onClick={() => deleteCover.mutate()}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
                disabled={deleteCover.isPending}
              >
                {deleteCover.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}
                Remove
              </button>
            )}
          </div>
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">
          Recommended: 1200x300px, max 5MB
        </p>
      </div>

      {/* Avatar */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile?.avatar_url ? (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(formData.full_name || 'UN')}
              </div>
            )}
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
              disabled={uploadAvatar.isPending}
            >
              {uploadAvatar.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Camera size={16} />
              )}
            </button>
          </div>

          <div className="flex-1">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="text-sm text-gray-600 mb-2">
              Upload a professional photo
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Upload new
              </button>
              {profile?.avatar_url && (
                <button
                  onClick={() => deleteAvatar.mutate()}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                  disabled={deleteAvatar.isPending}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            maxLength={500}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="A short, catchy description"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.tagline.length}/500 characters
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Professional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              name="years_experience"
              value={formData.years_experience}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Social Links</h3>
          
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="url"
            name="twitter_url"
            value={formData.twitter_url}
            onChange={handleChange}
            placeholder="https://twitter.com/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        {isModified && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {updateProfile.isPending ? (
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
                setFormData({
                  full_name: profile?.full_name || '',
                  tagline: profile?.tagline || '',
                  bio: profile?.bio || '',
                  location: profile?.location || '',
                  website: profile?.website || '',
                  job_title: profile?.job_title || '',
                  company: profile?.company || '',
                  years_experience: profile?.years_experience || 0,
                  phone: profile?.phone || '',
                  github_url: profile?.github_url || '',
                  linkedin_url: profile?.linkedin_url || '',
                  twitter_url: profile?.twitter_url || '',
                });
                setIsModified(false);
              }}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
