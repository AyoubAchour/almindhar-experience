import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  
  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to an error page if something went wrong
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${encodeURIComponent('Failed to confirm email. Please try again.')}`);
      }
      
      // If it's a signup confirmation, redirect to login with a success message
      if (type === 'signup' || !type) {
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?confirmed=true`);
      }
      
      // If it's a password reset confirmation, redirect to the reset page
      if (type === 'recovery') {
        return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password-confirmation`);
      }
    } catch (err) {
      console.error('Error in auth callback:', err);
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${encodeURIComponent('An error occurred during authentication.')}`);
    }
  }

  // Fallback redirect to the homepage
  return NextResponse.redirect(requestUrl.origin);
}