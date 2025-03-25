import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ experienceId: string }> }
) {
  try {
    // Await the params to get the experienceId
    const { experienceId } = await params;
    
    if (!experienceId) {
      return NextResponse.json({ error: "ID d'expérience manquant" }, { status: 400 });
    }
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Get the user's game scores for this experience
    const { data: gameScores, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('experience_id', experienceId)
      .eq('user_id', user.id)
      .order('score', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching game scores:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Check if the user has a reward based on their score
    const hasReward = gameScores && gameScores.length > 0 && gameScores[0].score >= 80;
    const rewardDiscount = hasReward ? 10 : 0; // 10% discount for high scores
    
    return NextResponse.json({
      hasReward,
      rewardDiscount,
      scores: gameScores || []
    });
  } catch (error: any) {
    console.error('Unexpected error fetching game scores:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
