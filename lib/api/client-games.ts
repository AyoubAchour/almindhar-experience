/**
 * Fetch game scores for a specific experience from the API route
 */
export async function getGameScores(experienceId: string) {
  try {
    const response = await fetch(`/api/games/scores/${experienceId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching game scores for experience ${experienceId}:`, errorData.error);
      return { hasReward: false, rewardDiscount: 0, scores: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Unexpected error fetching game scores for experience ${experienceId}:`, error);
    return { hasReward: false, rewardDiscount: 0, scores: [] };
  }
}
