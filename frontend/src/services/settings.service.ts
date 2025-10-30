import api, { handleApiRequest } from '../lib/api';
import { extractData } from '../lib/utils';
import { AccountUpdateData, ActivityLog, ApiResponse, PasswordUpdateData, PrivacySettings, SettingsData, User, UserProfile } from '../types';



export const settingsService = {
  /**
   * Get all settings data
   */
  getAll: async (): Promise<SettingsData | null> => {
    const response = await handleApiRequest(
      () => api.get('/settings'),
      null
    );
    
    if (!response) return null;
    return extractData<SettingsData>(response);
  },

  /**
   * Update account information
   */
  updateAccount: async (data: AccountUpdateData): Promise<ApiResponse<User>> => {
    const { data: responseData } = await api.put('/settings/account', data);
    return responseData;
  },

  /**
   * Update password
   */
  updatePassword: async (data: PasswordUpdateData): Promise<ApiResponse<void>> => {
    const { data: responseData } = await api.put('/settings/password', data);
    return responseData;
  },

  /**
   * Update privacy settings
   */
  updatePrivacy: async (data: PrivacySettings): Promise<ApiResponse<UserProfile>> => {
    const { data: responseData } = await api.put('/settings/privacy', data);
    return responseData;
  },

  /**
   * Delete avatar
   */
  deleteAvatar: async (): Promise<ApiResponse<void>> => {
    const { data } = await api.delete('/settings/avatar');
    return data;
  },

  /**
   * Delete cover image
   */
  deleteCoverImage: async (): Promise<ApiResponse<void>> => {
    const { data } = await api.delete('/settings/cover-image');
    return data;
  },

  /**
   * Delete account
   */
  deleteAccount: async (password: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete('/settings/account', {
      data: { password, confirmation: 'DELETE' }
    });
    return data;
  },

  /**
   * Get activity log
   */
  getActivityLog: async (): Promise<ActivityLog[]> => {
    const response = await handleApiRequest(
      () => api.get('/settings/activity'),
      []
    );
    
    const extracted = extractData<ActivityLog[]>(response);
    return Array.isArray(extracted) ? extracted : [];
  },
};
