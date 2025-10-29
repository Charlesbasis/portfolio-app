'use client';

import { useState } from 'react';
import { useAnalytics } from '../../../hooks/useDashboard';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatNumber } from '@/src/lib/utils';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<number>(30);
  const { data: analytics, isLoading, error, refetch } = useAnalytics(period);

  const periods = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
    { label: '1 Year', value: 365 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card padding="lg" className="max-w-md">
          <div className="text-center">
            <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to load analytics
            </h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  const totalProjects = analytics?.projects_over_time.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalMessages = analytics?.messages_over_time.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600 text-lg">
            Track your portfolio performance and engagement
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === p.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Projects Created
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(totalProjects || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last {period} days</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Messages Received
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(totalMessages || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last {period} days</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Skill Categories
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics?.skills_by_category.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total categories</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <PieChart size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Technologies
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {Object.keys(analytics?.top_technologies || {}).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Unique technologies</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar size={24} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Projects Over Time */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Projects Over Time
          </h2>
          {analytics?.projects_over_time.length ? (
            <div className="space-y-2">
              {analytics.projects_over_time.map((item, index) => {
                const maxCount = Math.max(
                  ...analytics.projects_over_time.map((i) => i.count)
                );
                const percentage = (item.count / maxCount) * 100;

                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 20 && (
                            <span className="text-white text-xs font-semibold">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {percentage <= 20 && (
                      <span className="text-sm font-semibold text-gray-900 w-8">
                        {item.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Messages Over Time */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Messages Over Time
          </h2>
          {analytics?.messages_over_time.length ? (
            <div className="space-y-2">
              {analytics.messages_over_time.map((item, index) => {
                const maxCount = Math.max(
                  ...analytics.messages_over_time.map((i) => i.count)
                );
                const percentage = (item.count / maxCount) * 100;

                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-purple-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 20 && (
                            <span className="text-white text-xs font-semibold">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {percentage <= 20 && (
                      <span className="text-sm font-semibold text-gray-900 w-8">
                        {item.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Skills by Category */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Skills by Category
          </h2>
          {analytics?.skills_by_category.length ? (
            <div className="space-y-4">
              {analytics.skills_by_category.map((item, index) => {
                const total = analytics.skills_by_category.reduce(
                  (sum, i) => sum + i.count,
                  0
                );
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">
                        {item.category}
                      </span>
                      <span className="text-gray-600">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Top Technologies */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Top Technologies
          </h2>
          {analytics?.top_technologies &&
          Object.keys(analytics.top_technologies).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(analytics.top_technologies)
                .slice(0, 10)
                .map(([tech, count], index) => {
                  const maxCount = Math.max(
                    ...Object.values(analytics.top_technologies)
                  );
                  const percentage = (count / maxCount) * 100;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-semibold text-gray-900 text-lg w-6">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-gray-900">{tech}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-orange-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-600 font-semibold w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>
      </div>
    </div>
  );
}
