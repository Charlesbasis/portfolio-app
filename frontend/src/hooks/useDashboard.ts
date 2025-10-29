import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  DashboardStats,
  RecentProject,
  RecentMessage,
  Activity,
  Analytics,
  DashboardSummary,
} from '@/src/types';
import { dashboardApi } from '@/src/services/dashboardApi.service';

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats(): UseQueryResult<DashboardStats> {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 0, // 0 minutes
    refetchOnWindowFocus: true,
    // gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch recent projects
 */
export function useRecentProjects(
  limit: number = 5
): UseQueryResult<RecentProject[]> {
  return useQuery({
    queryKey: ['dashboard', 'recent-projects', limit],
    queryFn: () => dashboardApi.getRecentProjects(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch recent messages
 */
export function useRecentMessages(
  limit: number = 10
): UseQueryResult<RecentMessage[]> {
  return useQuery({
    queryKey: ['dashboard', 'recent-messages', limit],
    queryFn: () => dashboardApi.getRecentMessages(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes - messages should refresh more frequently
  });
}

/**
 * Hook to fetch activity log
 */
export function useActivity(limit: number = 20): UseQueryResult<Activity[]> {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: () => dashboardApi.getActivity(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch analytics data
 */
export function useAnalytics(period: number = 30): UseQueryResult<Analytics> {
  return useQuery({
    queryKey: ['dashboard', 'analytics', period],
    queryFn: () => dashboardApi.getAnalytics(period),
    staleTime: 30 * 60 * 1000, // 30 minutes - analytics can be cached longer
  });
}

/**
 * Hook to fetch dashboard summary
 */
export function useDashboardSummary(): UseQueryResult<DashboardSummary> {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to prefetch all dashboard data
 * Useful for preloading when user navigates to dashboard
 */
export function usePrefetchDashboard() {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'stats'],
      queryFn: dashboardApi.getStats,
    });

    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'recent-projects', 5],
      queryFn: () => dashboardApi.getRecentProjects(5),
    });

    queryClient.prefetchQuery({
      queryKey: ['dashboard', 'recent-messages', 10],
      queryFn: () => dashboardApi.getRecentMessages(10),
    });
  };

  return { prefetch };
}
