import { createClient } from '@/utils/supabase/server';
import { Booking } from '@/types';

/**
 * Create a new booking in the database
 */
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const supabase = await createClient();
  
  try {
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Ensure the booking is being created for the authenticated user
    if (bookingData.user_id !== user.id) {
      return { success: false, error: 'Unauthorized booking attempt' };
    }

    // Insert the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
    
    // Update available spots for the date
    await updateAvailableSpots(
      bookingData.experience_id, 
      new Date(bookingData.booking_date).toISOString().split('T')[0], 
      bookingData.number_of_people
    );
    
    return { success: true, booking: data as Booking };
  } catch (error: any) {
    console.error('Unexpected error creating booking:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

/**
 * Get all bookings for the current user
 */
export async function getUserBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }
    
    // Fetch bookings for the user
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        experiences (
          id, 
          title, 
          image_url, 
          location
        )
      `)
      .eq('user_id', user.id)
      .order('booking_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
    
    return data as unknown as Booking[];
  } catch (error) {
    console.error('Unexpected error fetching user bookings:', error);
    return [];
  }
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = await createClient();
  
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }
    
    // Fetch the booking
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        experiences (
          id, 
          title, 
          description, 
          image_url, 
          location, 
          price, 
          duration, 
          difficulty
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure the booking belongs to the user
      .single();
    
    if (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      return null;
    }
    
    return data as unknown as Booking;
  } catch (error) {
    console.error(`Unexpected error fetching booking with ID ${id}:`, error);
    return null;
  }
}

/**
 * Update available spots for a specific date of an experience
 * @private Internal helper function
 */
async function updateAvailableSpots(experienceId: string, bookingDate: string, numberOfPeople: number): Promise<boolean> {
  const supabase = await createClient();
  
  try {
    // First get the current experience data
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('available_dates')
      .eq('id', experienceId)
      .single();
    
    if (fetchError || !experience) {
      console.error('Error fetching experience for updating spots:', fetchError);
      return false;
    }
    
    // Parse available dates if needed
    const availableDates = typeof experience.available_dates === 'string'
      ? JSON.parse(experience.available_dates)
      : experience.available_dates;
    
    // Find and update the specific date
    const updatedDates = availableDates.map((date: any) => {
      if (date.date.split('T')[0] === bookingDate) {
        const newSpotsLeft = Math.max(0, date.spots_left - numberOfPeople);
        return {
          ...date,
          spots_left: newSpotsLeft,
          available: newSpotsLeft > 0
        };
      }
      return date;
    });
    
    // Update the experience with new available dates
    const { error: updateError } = await supabase
      .from('experiences')
      .update({ available_dates: updatedDates })
      .eq('id', experienceId);
    
    if (updateError) {
      console.error('Error updating available spots:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating available spots:', error);
    return false;
  }
}
