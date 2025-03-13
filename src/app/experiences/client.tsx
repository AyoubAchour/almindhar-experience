'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import ExperienceCard from '@/components/experiences/ExperienceCard';

type Experience = {
  id: string;
  title: string;
  short_description: string;
  location: string;
  price: number;
  duration: string;
  difficulty: string;
  image_urls: string[];
};

interface ClientExperiencesProps {
  initialExperiences: Experience[];
  initialIsAdmin: boolean;
}

export default function ClientExperiences({ 
  initialExperiences,
  initialIsAdmin
}: ClientExperiencesProps) {
  const { isAdmin, refreshAdminStatus } = useAuth();
  const [experiences] = useState<Experience[]>(initialExperiences);
  const [adminChecked, setAdminChecked] = useState(false);
  const [showControls, setShowControls] = useState(initialIsAdmin);
  
  // Refresh admin status when component mounts
  useEffect(() => {
    const syncAdminStatus = async () => {
      try {
        await refreshAdminStatus();
        setAdminChecked(true);
        setShowControls(isAdmin);
      } catch (error) {
        console.error("Error refreshing admin status:", error);
        // Fall back to server-side determination if client-side fails
        setShowControls(initialIsAdmin);
      }
    };
    
    syncAdminStatus();
    
    // Also check if there's a localStorage value
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    if (storedIsAdmin) {
      setShowControls(true);
    }
  }, [refreshAdminStatus, isAdmin, initialIsAdmin]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tunisian Experiences</h1>
          <p className="text-gray-600 mt-1">Discover amazing adventures in Tunisia</p>
        </div>
        
        {showControls && (
          <Link
            href="/admin/experiences/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add New Experience
          </Link>
        )}
      </div>
      
      {/* Filter Section - To be expanded later */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Categories</option>
              <option value="Desert Adventures">Desert Adventures</option>
              <option value="Aquatic Experiences">Aquatic Experiences</option>
              <option value="Aerial Activities">Aerial Activities</option>
              <option value="Cultural Experiences">Cultural Experiences</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Any Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="duration_low">Duration: Shortest First</option>
              <option value="duration_high">Duration: Longest First</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Experiences Grid */}
      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No experiences available yet</h2>
          <p className="text-gray-500">Check back soon for exciting Tunisian adventures!</p>
          {showControls && (
            <Link
              href="/admin/experiences/create"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Create First Experience
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              id={experience.id}
              title={experience.title}
              shortDescription={experience.short_description}
              location={experience.location}
              price={experience.price}
              duration={experience.duration}
              difficulty={experience.difficulty}
              imageUrl={experience.image_urls[0] || '/placeholder-experience.jpg'}
            />
          ))}
        </div>
      )}
    </div>
  );
}