import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { rateLimit } from '@/utils/rate-limit';

// Helper function to handle sign-in attempt
async function attemptSignIn(
  supabase: SupabaseClient, 
  email: string, 
  password: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

// Helper function to create user profile
async function createUserProfile(
  supabase: SupabaseClient, 
  userId: string, 
  email: string
): Promise<{ error: any }> {
  const { error } = await supabase.from('user_profiles').insert({
    id: userId,
    email,
    created_at: new Date().toISOString(),
  });
  
  if (error) {
    console.error('Error creating user profile:', error);
  }
  
  return { error };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const { email, password } = await request.json();
    
    // Enhanced input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: 'Password must be between 8 and 128 characters long' },
        { status: 400 }
      );
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    const supabase = await createClient();
    
    // Create the user with auto-confirmation
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          email_confirmed: true
        }
      }
    });

    // Handle email confirmation errors by trying to sign in directly
    if (error && (error.message.includes("Email not confirmed") || 
                  error.message.includes("already registered"))) {
      const { data: signInData, error: signInError } = await attemptSignIn(supabase, sanitizedEmail, password);
      
      if (signInError) {
        return NextResponse.json({ 
          error: "This email is already registered with a different password"
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Signed in successfully',
        user: signInData.user 
      });
    }
    
    // Handle other signup errors
    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If the user was created successfully
    if (data?.user) {
      // Create a user profile
      await createUserProfile(supabase, data.user.id, sanitizedEmail);
      
      // Sign in the user
      const { error: signInError } = await attemptSignIn(supabase, sanitizedEmail, password);

      if (signInError) {
        console.error('Error signing in user:', signInError);
        return NextResponse.json({ 
          success: true, 
          message: 'Account created but automatic login failed. Please sign in manually.',
          user: data.user 
        });
      }

      return NextResponse.json({ success: true, user: data.user });
    }

    return NextResponse.json(
      { error: 'Something went wrong during signup' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
