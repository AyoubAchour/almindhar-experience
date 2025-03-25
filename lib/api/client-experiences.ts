import { Experience } from '@/types';

/**
 * Fetch a single experience by ID from the API route
 */
export async function getExperienceById(id: string): Promise<Experience | null> {
  try {
    const response = await fetch(`/api/experiences/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching experience with ID ${id}:`, errorData.error);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Unexpected error fetching experience with ID ${id}:`, error);
    return null;
  }
}
