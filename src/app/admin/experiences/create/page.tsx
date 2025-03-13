import AdminLayout from '@/components/admin/AdminLayout';
import ExperienceForm from '@/components/admin/ExperienceForm';

export default function CreateExperiencePage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Create New Experience</h2>
        <p className="text-gray-500">Add a new adventure experience to the catalog.</p>
      </div>
      
      <ExperienceForm />
    </AdminLayout>
  );
}