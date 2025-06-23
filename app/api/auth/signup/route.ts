import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';

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
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Create the user with auto-confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
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
      const { data: signInData, error: signInError } = await attemptSignIn(supabase, email, password);
      
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
      await createUserProfile(supabase, data.user.id, email);
      
      // Sign in the user
      const { error: signInError } = await attemptSignIn(supabase, email, password);

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
