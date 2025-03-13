import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getExperience, deleteExperience } from '@/lib/experiences/actions';
import { isCurrentUserAdmin } from '@/lib/auth/adminCheck';

interface ExperienceDetailPageProps {
  params: {
    id: string;
  };
}

interface Experience {
    id: string;
    title: string;
    description: string;
    location: string;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
    duration: number;
    max_participants: number;
    category: string;
    price: number;
    image_urls: string[];
  }

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  try {
    const experience = await getExperience(params.id) as Experience;
    const isAdmin = await isCurrentUserAdmin();
    
    // Format duration in hours and minutes
    const hours = Math.floor(experience.duration / 60);
    const minutes = experience.duration % 60;
    const formattedDuration = hours 
      ? `${hours} hour${hours > 1 ? 's' : ''}${minutes ? ` ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
      : `${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    // Map difficulty to color
    const difficultyColor = {
      'Easy': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Challenging': 'bg-red-100 text-red-800',
    }[experience.difficulty] || 'bg-gray-100 text-gray-800';
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Actions */}
        {isAdmin && (
          <div className="mb-6 flex gap-3">
            <Link
              href={`/admin/experiences/edit/${experience.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit Experience
            </Link>
            <form action={async () => {
              'use server';
              await deleteExperience(experience.id);
            }}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete Experience
              </button>
            </form>
          </div>
        )}
        
        {/* Image Gallery */}
        <div className="mb-8">
          {experience.image_urls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 relative h-96">
                <Image
                  src={experience.image_urls[0]}
                  alt={experience.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              {experience.image_urls.slice(1, 5).map((imageUrl, index) => (
                <div key={index} className="relative h-48">
                  <Image
                    src={imageUrl}
                    alt={`${experience.title} - Image ${index + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>
        
        {/* Experience Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-600">{experience.location}</span>
              <span className="text-gray-400">•</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColor}`}>
                {experience.difficulty}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold mb-2 text-gray-800">About this experience</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">{experience.description}</p>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{formattedDuration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Group Size</p>
                  <p className="font-medium">Up to {experience.max_participants} people</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{experience.category}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{experience.price} TND</span>
                  <span className="text-gray-500 text-sm">/ person</span>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {formattedDuration}
                </div>
              </div>
              
              <button
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition mb-4"
              >
                Book this Experience
              </button>
              
              <div className="text-sm text-gray-500 text-center">
                <p>Free cancellation up to 24 hours before start</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching experience:', error);
    notFound();
  }
}