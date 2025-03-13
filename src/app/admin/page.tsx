import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { checkAdminAccess } from '@/lib/auth/adminCheck';
import { listExperiences } from '@/lib/experiences/actions';

export default async function AdminDashboard() {
  const isAdmin = await checkAdminAccess();
  
  if (!isAdmin) {
    redirect('/');
  }
  
  const experiences = await listExperiences(true);
  
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">Experiences</h2>
          <p className="text-blue-700 mb-2">Total: {experiences.length}</p>
          <p className="text-blue-700 mb-4">Active: {experiences.filter(e => e.is_active).length}</p>
          <Link 
            href="/admin/experiences" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Manage Experiences
          </Link>
        </div>
        
        {/* Other admin modules can be added here */}
      </div>
    </AdminLayout>
  );
}