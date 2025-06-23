import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookingsList } from "./components/BookingsList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingWithExperience } from "./components/BookingCard";

interface Booking {
  id: string;
  booking_date: string;
  number_of_people: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  payment_status: string;
  total_price: number;
  experience_id: string;
}

interface Experience {
  id: string;
  title: string;
  image_url?: string;
  location: string;
}

export default async function BookingsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile to ensure profile is complete
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('profile_complete')
    .eq('id', user.id)
    .single();

  if (!profile || profile.profile_complete !== true) {
    return redirect("/complete-profile");
  }

  // Fetch all user's bookings
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, booking_date, number_of_people, status, payment_status, total_price, experience_id')
    .eq('user_id', user.id)
    .order('booking_date', { ascending: false });

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError);
    return null; // Or handle error appropriately
  }

  // Fetch associated experience details
  let bookingsWithExperiences: BookingWithExperience[] = [];
  if (bookings && bookings.length > 0) {
    const experienceIds = bookings.map(booking => booking.experience_id);
    
    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('id, title, image_url, location')
      .in('id', experienceIds);

    if (experiencesError) {
      console.error('Error fetching experiences:', experiencesError);
      return null;
    }

    // Create a map for quick experience lookup
    const experienceMap = new Map<string, Experience>(
      experiences?.map((exp: Experience) => [exp.id, exp] as [string, Experience]) || []
    );

    // Combine the data
    bookingsWithExperiences = bookings.map((booking: Booking): BookingWithExperience => {
      const experience = experienceMap.get(booking.experience_id);
      return {
        ...booking,
        experiences: experience ? [experience] : []
      };
    });
  }

  // Calculate booking statistics
  const totalBookings = bookingsWithExperiences.length;
  const upcomingBookings = bookingsWithExperiences.filter(
    booking => new Date(booking.booking_date) > new Date() && booking.status !== 'cancelled'
  ).length;
  const confirmedBookings = bookingsWithExperiences.filter(
    booking => booking.status === 'confirmed'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Vos Réservations</h1>
              <p className="text-blue-100 text-lg max-w-3xl">
                Gérez vos réservations et suivez le statut de vos expériences
              </p>
            </div>
            <Link href="/experiences">
              <Button className="bg-white text-indigo-600 hover:bg-blue-50">
                Réserver une expérience
              </Button>
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">{totalBookings}</div>
              <div className="text-blue-100">Total réservations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">{upcomingBookings}</div>
              <div className="text-blue-100">Réservations à venir</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">{confirmedBookings}</div>
              <div className="text-blue-100">Réservations confirmées</div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Bookings List with Filtering */}
        <BookingsList bookings={bookingsWithExperiences} />

        {/* Call to action for no bookings */}
        {(!bookingsWithExperiences || bookingsWithExperiences.length === 0) && (
          <div className="mt-12 text-center">
            <Link href="/experiences">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                Découvrir les expériences
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
