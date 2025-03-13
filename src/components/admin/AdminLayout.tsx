import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { checkAdminAccess } from '@/lib/auth/adminCheck';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const isAdmin = await checkAdminAccess();
  
  if (!isAdmin) {
    redirect('/');
  }
  
  return (
    <div className="admin-layout">
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}