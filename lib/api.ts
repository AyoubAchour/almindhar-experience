/**
 * API service for fetching data from Supabase
 * 
 * This file re-exports all API functions from their specific modules.
 * For new code, import directly from the specific modules instead.
 */

// Re-export all experience-related functions
export {
  getAllExperiences,
  getExperienceById,
  getUniqueLocations,
  getPriceRange,
  searchExperiences,
} from './api/experiences';

// Re-export featured experience functions
export {
  getFeaturedExperiences,
  getExperiencesByDifficulty,
} from './api/featured';
