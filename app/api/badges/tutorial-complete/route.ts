import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the badge ID for 'premier_pas_tutorial'
    const { data: badge, error: badgeError } = await supabase
      .from('badges')
      .select('id')
      .eq('name', 'premier_pas_tutorial')
      .single();

    if (badgeError || !badge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      );
    }

    // Check if user already has this badge
    const { data: existingBadge } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', user.id)
      .eq('badge_id', badge.id)
      .single();

    if (existingBadge) {
      return NextResponse.json(
        { success: true, alreadyAwarded: true },
        { status: 200 }
      );
    }

    // Award the badge
    const { data: userBadge, error: awardError } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: user.id,
          badge_id: badge.id,
          notification_shown: false
        }
      ])
      .select('*, badges(*)')
      .single();

    if (awardError) {
      return NextResponse.json(
        { error: 'Failed to award badge' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      badge: {
        id: userBadge.badge_id,
        name: userBadge.badges.name,
        label: userBadge.badges.label,
        description: userBadge.badges.description,
        shouldShowNotification: true
      }
    });
  } catch (error) {
    console.error('Error awarding tutorial badge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
