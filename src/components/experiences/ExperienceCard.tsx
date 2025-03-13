import Link from 'next/link';
import Image from 'next/image';

interface ExperienceCardProps {
  id: string;
  title: string;
  shortDescription: string;
  location: string;
  price: number;
  duration: number;
  difficulty: string;
  imageUrl: string;
}

export default function ExperienceCard({
  id,
  title,
  shortDescription,
  location,
  price,
  duration,
  difficulty,
  imageUrl,
}: ExperienceCardProps) {
  // Map difficulty to color
  const difficultyColor = {
    'Easy': 'bg-green-100 text-green-800',
    'Moderate': 'bg-yellow-100 text-yellow-800',
    'Challenging': 'bg-red-100 text-red-800',
  }[difficulty] || 'bg-gray-100 text-gray-800';
  
  // Format duration in hours and minutes
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const formattedDuration = hours 
    ? `${hours}h${minutes ? ` ${minutes}m` : ''}`
    : `${minutes}m`;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{location}</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColor}`}>
            {difficulty}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shortDescription}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-bold text-blue-600">{price} TND</span>
            <span className="text-gray-500 text-sm ml-1">· {formattedDuration}</span>
          </div>
          <Link
            href={`/experiences/${id}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}