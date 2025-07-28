import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, avatar_url, preferences } = body;

    // Enhanced validation
    if (
      !full_name ||
      typeof full_name !== 'string' ||
      full_name.trim().length === 0 ||
      full_name.length > 100 ||
      !avatar_url ||
      typeof avatar_url !== 'string' ||
      !/^https?:\/\//.test(avatar_url) ||
      avatar_url.length > 500 ||
      !Array.isArray(preferences) ||
      preferences.length === 0 ||
      preferences.length > 20 ||
      preferences.some(pref => typeof pref !== 'string' || pref.length > 50)
    ) {
      return NextResponse.json(
        { error: 'Invalid input: full_name must be 1-100 characters, avatar_url must be a valid URL under 500 characters, and preferences must be an array of 1-20 strings under 50 characters each.' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedFullName = full_name.trim();
    const sanitizedPreferences = preferences.map(pref => pref.trim()).filter(pref => pref.length > 0);

    // Update profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({
        full_name: sanitizedFullName,
        avatar_url,
        preferences: sanitizedPreferences,
        profile_complete: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
} 