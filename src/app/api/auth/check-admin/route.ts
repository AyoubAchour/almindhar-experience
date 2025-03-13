import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ isAdmin: false });
    }
    
    // Check if user ID exists in admins table
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('id', session.user.id)
      .single();
    
    // If no error and data exists, user is an admin
    const isAdmin = !error && !!data;
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false, error: 'Failed to check admin status' }, { status: 500 });
  }
}