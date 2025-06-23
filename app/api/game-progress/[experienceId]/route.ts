import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/game-progress/:experienceId
export async function GET(request: Request, context: any) {
  const { experienceId } = await context.params;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_game_progress')
      .select('progress')
      .eq('user_id', user.id)
      .eq('experience_id', experienceId)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tutorialCompleted = data?.progress?.tutorialCompleted === true;
    return NextResponse.json({ tutorialCompleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/game-progress/:experienceId
export async function POST(request: Request, context: any) {
  const { experienceId } = await context.params;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    if (body?.tutorialCompleted !== true) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Check if a progress record already exists
    const { data: existing, error: fetchError } = await supabase
      .from('user_game_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('experience_id', experienceId)
      .maybeSingle();
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existing?.id) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_game_progress')
        .update({
          progress: { tutorialCompleted: true },
          last_played_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    } else {
      // Insert new progress record
      const { error: insertError } = await supabase
        .from('user_game_progress')
        .insert({
          user_id: user.id,
          experience_id: experienceId,
          progress: { tutorialCompleted: true },
        });
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ tutorialCompleted: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 