import { Booking } from '@/types';

/**
 * Create a new booking through the API route
 */
export async function createBooking(bookingData: Partial<Booking>) {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Error creating booking:', result.error);
      return { success: false, error: result.error };
    }
    
    return result;
  } catch (error: any) {
    console.error('Unexpected error creating booking:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
}
