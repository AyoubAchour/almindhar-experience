import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimit } from '@/lib/rate-limit';

// Sanitize string input
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 100); // Limit length
}

// Validate URL
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await apiRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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
      full_name.trim().length < 2 ||
      full_name.trim().length > 100
    ) {
      return NextResponse.json(
        { error: 'Full name must be between 2 and 100 characters.' },
        { status: 400 }
      );
    }

    if (!avatar_url || typeof avatar_url !== 'string' || !isValidUrl(avatar_url)) {
      return NextResponse.json(
        { error: 'Avatar URL must be a valid URL.' },
        { status: 400 }
      );
    }

    // Validate avatar URL is from allowed domains
    const avatarUrlObj = new URL(avatar_url);
    const allowedDomains = ['jogxouotwtbjhoioyofa.supabase.co'];
    if (!allowedDomains.includes(avatarUrlObj.hostname)) {
      return NextResponse.json(
        { error: 'Avatar URL must be from an allowed domain.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(preferences) || preferences.length === 0 || preferences.length > 10) {
      return NextResponse.json(
        { error: 'Please select between 1 and 10 preferences.' },
        { status: 400 }
      );
    }

    // Sanitize preferences
    const sanitizedPreferences = preferences
      .filter(p => typeof p === 'string')
      .map(p => sanitizeInput(p))
      .filter(p => p.length > 0);

    if (sanitizedPreferences.length === 0) {
      return NextResponse.json(
        { error: 'Invalid preferences provided.' },
        { status: 400 }
      );
    }

    // Update profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({
        full_name: sanitizeInput(full_name),
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
    console.error('Profile update error:', err);
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