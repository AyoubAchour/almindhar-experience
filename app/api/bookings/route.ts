import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    
    const bookingData = await request.json();
    
    // Ensure the user_id matches the authenticated user
    if (bookingData.user_id !== user.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID mismatch' 
      }, { status: 403 });
    }
    
    // Insert the booking into the database
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      booking 
    });
  } catch (error: any) {
    console.error('Unexpected error creating booking:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
