import { Activity, Analytics, DashboardStats, DashboardSummary, RecentMessage, RecentProject } from "../types";
import api from "./api.service";

export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  /**
   * Get recent projects
   */
  getRecentProjects: async (limit: number = 5): Promise<RecentProject[]> => {
    const response = await api.get('/dashboard/recent-projects', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get recent messages
   */
  getRecentMessages: async (limit: number = 10): Promise<RecentMessage[]> => {
    const response = await api.get('/dashboard/recent-messages', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get activity log
   */
  getActivity: async (limit: number = 20): Promise<Activity[]> => {
    const response = await api.get('/dashboard/activity', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get analytics data
   */
  getAnalytics: async (period: number = 30): Promise<Analytics> => {
    const response = await api.get('/dashboard/analytics', {
      params: { period },
    });
    return response.data.data;
  },

  /**
   * Get dashboard summary
   */
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data.data;
  },
};
