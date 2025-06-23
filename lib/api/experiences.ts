import { createClient } from '@/utils/supabase/server';
import { Experience } from '@/types';

/**
 * Fetch all experiences from Supabase
 */
export async function getAllExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching experiences:', error);
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
    console.error('Unexpected error fetching experiences:', error);
    return [];
  }
}

/**
 * Fetch a single experience by ID
 */
export async function getExperienceById(id: string): Promise<Experience | null> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching experience with ID ${id}:`, error);
      return null;
    }
    
    // Parse JSON strings into objects if needed
    return {
      ...data,
      features: typeof data.features === 'string'
        ? JSON.parse(data.features)
        : data.features,
      available_dates: typeof data.available_dates === 'string'
        ? JSON.parse(data.available_dates)
        : data.available_dates
    } as Experience;
  } catch (error) {
    console.error(`Unexpected error fetching experience with ID ${id}:`, error);
    return null;
  }
}

/**
 * Get unique locations from all experiences
 */
export async function getUniqueLocations(): Promise<string[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('location');
    
    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
    
    // Extract unique locations using Array.from to handle Set conversion
    const locations = Array.from(new Set(data.map((item: { location: string }) => item.location)));
    return locations;
  } catch (error) {
    console.error('Unexpected error fetching locations:', error);
    return [];
  }
}

/**
 * Get min and max price from all experiences
 */
export async function getPriceRange(): Promise<{min: number, max: number}> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('price');
    
    if (error) {
      console.error('Error fetching price range:', error);
      return { min: 0, max: 500 };
    }
    
    const prices = data.map((item: { price: number }) => item.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  } catch (error) {
    console.error('Unexpected error fetching price range:', error);
    return { min: 0, max: 500 };
  }
}

/**
 * Search experiences by query
 */
export async function searchExperiences(query: string): Promise<Experience[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);
    
    if (error) {
      console.error('Error searching experiences:', error);
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
    console.error('Unexpected error searching experiences:', error);
    return [];
  }
}
