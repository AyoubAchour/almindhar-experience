import { notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ExperienceForm from '@/components/admin/ExperienceForm';
import { getExperience } from '@/lib/experiences/actions';

interface EditExperiencePageProps {
  params: {
    id: string;
  };
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  try {
    const experience = await getExperience(params.id);
    
    return (
      <AdminLayout>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Edit Experience</h2>
          <p className="text-gray-500">`Update the details for {experience.title}`.</p>
        </div>
        
        <ExperienceForm initialData={experience} experienceId={params.id} />
      </AdminLayout>
    );
  } catch (error ) {
    console.error('Error fetching experience:', error);
    notFound();
  }
}