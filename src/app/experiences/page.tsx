import { Suspense } from 'react';
import { listExperiences } from '@/lib/experiences/actions';
import { isCurrentUserAdmin } from '@/lib/auth/adminCheck';
import ClientExperiences from './client';

export const metadata = {
  title: 'Experiences | Almindhar',
  description: 'Browse our collection of exciting Tunisian adventures',
};

export default async function ExperiencesPage() {
  const experiences = await listExperiences();
  const isAdmin = await isCurrentUserAdmin();
  
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading experiences...</div>}>
      <ClientExperiences 
        initialExperiences={experiences} 
        initialIsAdmin={isAdmin} 
      />
    </Suspense>
  );
}