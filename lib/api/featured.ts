import { createClient } from '@/utils/supabase/server';
import { Experience } from '@/types';

/**
 * Fetches a limited number of experiences for featured display
 * @param limit - Maximum number of experiences to return (default: 4)
 * @returns Promise with array of experiences or empty array if error
 */
export async function getFeaturedExperiences(limit: number = 4): Promise<Experience[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured experiences:', error);
      return [];
    }
    
    // Parse JSON strings into objects if needed
    return (data || []).map(experience => ({
      ...experience,
      features: typeof experience.features === 'string'
        ? JSON.parse(experience.features)
        : experience.features,
      available_dates: typeof experience.available_dates === 'string'
        ? JSON.parse(experience.available_dates)
        : experience.available_dates
    }));
  } catch (error) {
    console.error('Unexpected error fetching featured experiences:', error);
    return [];
  }
}

/**
 * Fetches experiences filtered by difficulty level
 * @param difficulty - The difficulty level to filter by
 * @returns Promise with array of experiences or empty array if error
 */
export async function getExperiencesByDifficulty(
  difficulty: 'easy' | 'moderate' | 'challenging'
): Promise<Experience[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('difficulty', difficulty)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching experiences with difficulty ${difficulty}:`, error);
      return [];
    }
    
    // Parse JSON strings into objects if needed
    return (data || []).map(experience => ({
      ...experience,
      features: typeof experience.features === 'string'
        ? JSON.parse(experience.features)
        : experience.features,
      available_dates: typeof experience.available_dates === 'string'
        ? JSON.parse(experience.available_dates)
        : experience.available_dates
    }));
  } catch (error) {
    console.error(`Unexpected error fetching experiences with difficulty ${difficulty}:`, error);
    return [];
  }
}
