import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }

  // Get badge details
  const { data: badge, error: badgeError } = await supabase
    .from('badges')
    .select('id, name, label, description')
    .eq('name', 'nouvel_aventurier')
    .single();

  if (badgeError || !badge) {
    return NextResponse.json({ error: 'Badge introuvable' }, { status: 404 });
  }

  // Insert badge award with notification status
  const { data: userBadge, error: insertError } = await supabase
    .from('user_badges')
    .insert({
      user_id: user.id,
      badge_id: badge.id,
      notification_shown: false
    })
    .select('id, awarded_at')
    .single();

  // If duplicate, get existing badge award
  if (insertError?.code === '23505') {
    const { data: existingBadge, error: fetchError } = await supabase
      .from('user_badges')
      .select('id, awarded_at, notification_shown')
      .eq('user_id', user.id)
      .eq('badge_id', badge.id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // If notification was already shown, don't show it again
    if (existingBadge.notification_shown) {
      return NextResponse.json({
        success: true,
        badge: {
          ...badge,
          earned_at: existingBadge.awarded_at,
          shouldShowNotification: false
        }
      });
    }

    // Update notification status
    const { error: updateError } = await supabase
      .from('user_badges')
      .update({ notification_shown: true })
      .eq('id', existingBadge.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      badge: {
        ...badge,
        earned_at: existingBadge.awarded_at,
        shouldShowNotification: true
      }
    });
  }

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Return badge details with notification flag
  return NextResponse.json({
    success: true,
    badge: {
      ...badge,
      earned_at: userBadge.awarded_at,
      shouldShowNotification: true
    }
  });
}