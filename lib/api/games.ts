import { createClient } from '@/utils/supabase/server';

/**
 * Get game scores for a specific experience and user
 */
export async function getGameScores(experienceId: string): Promise<{ 
  highScore: number; 
  completed: boolean;
  hasReward: boolean;
  rewardDiscount?: number;
}> {
  const supabase = await createClient();
  
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { highScore: 0, completed: false, hasReward: false };
    }
    
    // Fetch the user's game scores for this experience
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', user.id)
      .eq('experience_id', experienceId)
      .order('score', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return { highScore: 0, completed: false, hasReward: false };
      }
      console.error('Error fetching game scores:', error);
      return { highScore: 0, completed: false, hasReward: false };
    }
    
    // Check if the score qualifies for a reward
    // For now, we'll use a simple threshold system
    // In a real implementation, this would be more sophisticated
    const hasReward = data.score >= 75; // 75% score threshold for reward
    const rewardDiscount = hasReward ? 15 : 0; // 15% discount for high scores
    
    return { 
      highScore: data.score, 
      completed: data.completed, 
      hasReward,
      rewardDiscount: hasReward ? rewardDiscount : undefined
    };
  } catch (error) {
    console.error('Unexpected error fetching game scores:', error);
    return { highScore: 0, completed: false, hasReward: false };
  }
}

/**
 * Save a game score for the current user
 */
export async function saveGameScore(
  experienceId: string, 
  score: number, 
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Check if a record already exists
    const { data: existingScore } = await supabase
      .from('game_scores')
      .select('id, score')
      .eq('user_id', user.id)
      .eq('experience_id', experienceId)
      .single();
    
    // Only update if the new score is higher or there's no existing score
    if (!existingScore || existingScore.score < score) {
      // Determine if the score qualifies for rewards
      const qualifiesForReward = score >= 75; // 75% score threshold
      
      // Prepare rewards data if qualified
      const rewardsEarned = qualifiesForReward 
        ? [{ type: 'discount', value: 15, description: '15% de réduction' }] 
        : [];
      
      if (existingScore) {
        // Update existing record
        const { error } = await supabase
          .from('game_scores')
          .update({ 
            score, 
            completed, 
            rewards_earned: rewardsEarned,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingScore.id);
        
        if (error) {
          console.error('Error updating game score:', error);
          return { success: false, error: error.message };
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('game_scores')
          .insert([{ 
            user_id: user.id, 
            experience_id: experienceId, 
            score, 
            completed, 
            rewards_earned: rewardsEarned
          }]);
        
        if (error) {
          console.error('Error saving game score:', error);
          return { success: false, error: error.message };
        }
      }
      
      // Update user game progress
      await updateGameProgress(experienceId, score, completed);
      
      return { success: true };
    }
    
    return { success: true }; // No update needed
  } catch (error: any) {
    console.error('Unexpected error saving game score:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

/**
 * Update the user's game progress
 * @private Internal helper function
 */
async function updateGameProgress(
  experienceId: string, 
  score: number, 
  completed: boolean
): Promise<void> {
  const supabase = await createClient();
  
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Check if a progress record already exists
    const { data: existingProgress } = await supabase
      .from('user_game_progress')
      .select('id, progress')
      .eq('user_id', user.id)
      .eq('experience_id', experienceId)
      .single();
    
    const now = new Date().toISOString();
    const progressData = {
      lastScore: score,
      completed,
      lastPlayed: now
    };
    
    if (existingProgress) {
      // Update existing record
      await supabase
        .from('user_game_progress')
        .update({ 
          progress: progressData,
          last_played_at: now,
          updated_at: now
        })
        .eq('id', existingProgress.id);
    } else {
      // Insert new record
      await supabase
        .from('user_game_progress')
        .insert([{ 
          user_id: user.id, 
          experience_id: experienceId, 
          progress: progressData,
          last_played_at: now
        }]);
    }
  } catch (error) {
    console.error('Error updating game progress:', error);
  }
}
