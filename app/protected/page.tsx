import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";


type Experience = {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  price?: number;
  location: string;
  categories?: string[];
};

type UserBadgeWithLabel = {
  id: string;
  badges: { label: string } | { label: string }[];
};

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Route guard: redirect if profile is not complete
  if (!profile || profile.profile_complete !== true) {
    return redirect("/complete-profile");
  }

  // Client-side badge award handling is done in ProtectedContent component
  const ClientProtectedWrapper = (await import('./components/ClientProtectedWrapper')).default;


  // First, try a simple query without joins to verify bookings exist
  const { data: simpleBookings, error: simpleError } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id);


  // If we have bookings, then try the full query
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      id,
      booking_date,
      number_of_people,
      status,
      payment_status,
      total_price,
      experiences:experience_id (id, title, image_url, location)
    `)
    .eq('user_id', user.id)
    .order('booking_date', { ascending: false });

  // --- Experience Recommendations ---
  // 1. Preference name to ID mapping
  const PREFERENCE_NAME_TO_ID: Record<string, string> = {
    "Aventure dans le désert": "desert",
    "Visites culturelles": "culture",
    "Activités familiales": "family",
    "Nature & Randonnée": "nature",
    "Gastronomie": "food",
    "Sport & Loisirs": "sports"
  };

  // 2. Parse user preferences (names) and map to IDs
  const userPreferenceNames: string[] = Array.isArray(profile?.preferences)
    ? profile.preferences
    : Object.keys(profile?.preferences || {});
  const userPreferences = userPreferenceNames
    .map((name) => PREFERENCE_NAME_TO_ID[name])
    .filter(Boolean);

  // 3. Get user's booked experience IDs (separate query for recommendations)
  const { data: bookedExperiencesRaw } = await supabase
    .from('bookings')
    .select('experience_id')
    .eq('user_id', user.id);
  const bookedIds = (bookedExperiencesRaw ?? []).map(b => b.experience_id).filter(Boolean);

  // 4. Query for recommended experiences
  let recommendedExperiences = [];
  if (userPreferences.length > 0) {
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .not('id', 'in', `(${bookedIds.join(',') || ''})`)
      .overlaps('categories', userPreferences)
      .limit(3);
    recommendedExperiences = data || [];
  }
  // Fallback: If not enough recommendations, fill with random unbooked experiences
  if (!recommendedExperiences || recommendedExperiences.length < 3) {
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .not('id', 'in', `(${bookedIds.join(',') || ''})`)
      .limit(3 - (recommendedExperiences?.length || 0)) as { data: Experience[] };
    recommendedExperiences = [
      ...(recommendedExperiences || []),
      ...(data || [])
    ];
  }



  // Fetch user's badges
  const { data: userBadgesRaw } = await supabase
    .from('user_badges')
    .select('id, badges(label)')
    .eq('user_id', user.id);
  const userBadges = (userBadgesRaw ?? []) as UserBadgeWithLabel[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className=" mx-auto">
        <ClientProtectedWrapper />
        {/* Hero section with user greeting */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Bienvenue, {profile?.full_name || 'Aventurier'}</h1>
            <p className="text-blue-100">Découvrez de nouvelles aventures et suivez vos réservations</p>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Badges section with improved styling */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Vos Badges</h2>
              <Link
                href="/badges"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                data-nav="all-badges"
              >
                Voir tous les badges →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {userBadges && userBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {userBadges.map((badge) => (
                    <div key={badge.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">🏆</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {Array.isArray(badge.badges) ? badge.badges[0]?.label : badge.badges?.label}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">Aucun badge pour le moment</p>
                    <Link href="/experiences">
                      <Button variant="outline" size="sm" className="mt-2">
                        Commencer une aventure
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Quick Actions with enhanced styling */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Actions Rapides</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="space-y-3">
                    <Link href="/experiences" className="block">
                      <Button
                        className="w-full justify-start bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-sm"
                        variant="default"
                        data-action="browse-experiences"
                      >
                        <span className="mr-2">🧭</span> Parcourir les Expériences
                      </Button>
                    </Link>

                    <Link href="/games" className="block">
                      <Button className="w-full justify-start bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm" variant="default">
                        <span className="mr-2">🎮</span> Jouer aux Jeux
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings with enhanced styling */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vos Réservations</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  {bookings && bookings.length > 0 ? (
                    <div className="space-y-5">
                      {bookings.map((booking) => {
                        const experience = booking.experiences?.[0];
                        const bookingDate = new Date(booking.booking_date);
                        const formattedDate = `${bookingDate.getDate()}/${bookingDate.getMonth() + 1}/${bookingDate.getFullYear()}`;

                        // Status badge styling
                        let statusClass = "";
                        let statusText = "";

                        switch (booking.status) {
                          case "confirmed":
                            statusClass = "bg-green-100 text-green-800";
                            statusText = "Confirmé";
                            break;
                          case "pending":
                            statusClass = "bg-yellow-100 text-yellow-800";
                            statusText = "En attente";
                            break;
                          case "cancelled":
                            statusClass = "bg-red-100 text-red-800";
                            statusText = "Annulé";
                            break;
                          default:
                            statusClass = "bg-gray-100 text-gray-800";
                            statusText = booking.status || "Non défini";
                        }

                        return (
                          <div key={booking.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">{experience?.title || 'Expérience'}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  <span className="inline-block mr-2">📅 {formattedDate}</span>
                                  <span className="inline-block">👥 {booking.number_of_people} personne{booking.number_of_people > 1 ? 's' : ''}</span>
                                </p>
                              </div>
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusClass}`}>
                                {statusText}
                              </span>
                            </div>

                            {booking.total_price && (
                              <p className="text-sm font-medium text-gray-700 mt-2">
                                Prix total: {booking.total_price} DT
                              </p>
                            )}

                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                              <Link href={`/bookings/${booking.id}`}>
                                <Button variant="outline" size="sm" className="text-xs">
                                  Voir détails
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}

                      <div className="text-center pt-2">
                        <Link href="/bookings">
                          <Button variant="link" className="text-indigo-600 hover:text-indigo-800">
                            Voir toutes vos réservations →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-center">
                        <p className="text-gray-500 mb-2">Aucune réservation pour le moment</p>
                        <Link href="/experiences">
                          <Button variant="outline" size="sm" className="mt-2">
                            Découvrir des expériences
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - Recommended Experiences */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Expériences Recommandées</h2>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {recommendedExperiences && recommendedExperiences.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendedExperiences.map((exp) => (
                      <Link href={`/experiences/${exp.id}`} key={exp.id} className="group">
                        <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-indigo-300">
                          {exp.image_url ? (
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={exp.image_url}
                                alt={exp.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          ) : (
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">Image non disponible</span>
                            </div>
                          )}

                          <div className="p-4 flex-grow flex flex-col">
                            <div className="mb-2 flex items-start justify-between">
                              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors">{exp.title}</h3>
                              {exp.price && (
                                <span className="ml-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                  {exp.price} DT
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-gray-600 mb-2 flex items-center">
                              <span className="mr-1">📍</span> {exp.location}
                            </div>

                            {exp.description && (
                              <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow">
                                {exp.description}
                              </p>
                            )}

                            <div className="mt-auto pt-3 border-t border-gray-100">
                              <div className="flex justify-between items-center">
                                {exp.categories && exp.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {exp.categories.slice(0, 2).map((cat: string, idx: number) => (
                                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                        {cat}
                                      </span>
                                    ))}
                                    {exp.categories.length > 2 && (
                                      <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">+{exp.categories.length - 2}</span>
                                    )}
                                  </div>
                                )}
                                <Link
                                  href={`/experiences/${exp.id}`}
                                  className="text-xs text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors"
                                >
                                  Voir détails →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">Bientôt disponible !</p>
                      <p className="text-sm text-gray-400 mb-4">Nous préparons des recommandations personnalisées pour vous.</p>
                      <Link href="/experiences">
                        <Button variant="outline" size="sm">
                          Explorer toutes les expériences
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {recommendedExperiences && recommendedExperiences.length > 0 && (
                  <div className="mt-6 text-center">
                    <Link href="/experiences">
                      <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        Découvrir plus d'expériences
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
