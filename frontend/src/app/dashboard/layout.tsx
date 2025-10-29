'use client';

import ProtectedRoute from '@/src/components/auth/ProtectedRoute';
import Sidebar from '@/src/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-0 lg:ml-64">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
