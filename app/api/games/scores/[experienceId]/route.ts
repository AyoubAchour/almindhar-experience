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
    
    // Determine reward based on best eligible tier in rewards table
    let hasReward = false;
    let rewardDiscount = 0;
    if (gameScores && gameScores.length > 0) {
      const topScore = gameScores[0].score;
      const { data: eligibleRewards, error: rewardError } = await supabase
        .from('rewards')
        .select('discount_percent')
        .eq('is_active', true)
        .lte('points_required', topScore)
        .or(`experience_id.eq.${experienceId},experience_id.is.null`)
        .order('points_required', { ascending: false })
        .limit(1);
      if (rewardError) {
        console.error('Error fetching rewards:', rewardError);
      }
      if (eligibleRewards && eligibleRewards.length > 0) {
        hasReward = true;
        rewardDiscount = eligibleRewards[0].discount_percent;
      }
    }
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ experienceId: string }> }
) {
  const { experienceId } = await params;
  const body = await request.json();
  const score = body?.score;
  if (typeof score !== 'number' || score < 0) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Insert new game score record
    const { data: newScore, error: insertError } = await supabase
      .from('game_scores')
      .insert({
        user_id: user.id,
        experience_id: experienceId,
        score,
        completed: true
      })
      .select('*')
      .single();
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Find an eligible reward
    const { data: eligible, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .lte('points_required', score)
      .or(`experience_id.eq.${experienceId},experience_id.is.null`)
      .order('points_required', { ascending: false })
      .limit(1);
    if (rewardError) {
      return NextResponse.json({ error: rewardError.message }, { status: 500 });
    }

    let awardedReward = null;
    if (eligible && eligible.length > 0) {
      const reward = eligible[0];

      // Check if user already has this reward
      const { data: existingReward, error: fetchUR } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user.id)
        .eq('reward_id', reward.id)
        .maybeSingle();
      if (fetchUR) {
        return NextResponse.json({ error: fetchUR.message }, { status: 500 });
      }

      if (!existingReward) {
        // Generate coupon code and expiration
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let coupon_code = '';
        for (let i = 0; i < 8; i++) {
          coupon_code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Insert user reward
        const { data: newUserReward, error: insertUR } = await supabase
          .from('user_rewards')
          .insert({
            user_id: user.id,
            reward_id: reward.id,
            coupon_code,
            expires_at
          })
          .select('*')
          .single();
        if (insertUR) {
          return NextResponse.json({ error: insertUR.message }, { status: 500 });
        }

        awardedReward = {
          id: newUserReward.id,
          name: reward.name,
          description: reward.description,
          discount_percent: reward.discount_percent,
          coupon_code: newUserReward.coupon_code,
          expires_at: newUserReward.expires_at
        };

        // Update the game_scores record with the earned reward
        await supabase
          .from('game_scores')
          .update({ rewards_earned: [reward.id] })
          .eq('id', newScore.id);
      }
    }

    return NextResponse.json({ newScore, awardedReward });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
