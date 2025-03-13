import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect to login if no session (this is a fallback, middleware should catch most cases)
  if (!session) {
    redirect('/auth/login?returnUrl=/profile');
  }
  
  // Get the user's profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  // Get user's badges (for future implementation)
  const { data: badges } = await supabase
    .from('user_badges')
    .select('badges(id, name, description, image_url)')
    .eq('user_id', session.user.id)
    .limit(3);

  // Get user's recent bookings (for future implementation)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, booking_date, experience:experiences(id, title, image_url)')
    .eq('user_id', session.user.id)
    .order('booking_date', { ascending: false })
    .limit(3);

  // Get user's game progress (for future implementation)
  const { data: gameProgress } = await supabase
    .from('game_progress')
    .select('game:games(id, title), score, last_played')
    .eq('user_id', session.user.id)
    .order('last_played', { ascending: false })
    .limit(3);
  
  // Format username for avatar if full name not available
  const userInitial = profile?.full_name 
    ? profile.full_name.charAt(0).toUpperCase()
    : profile?.username?.charAt(0).toUpperCase() || 'U';

  // Calculate days since join
  const joinDate = new Date(session.user.created_at);
  const daysSinceJoin = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 3600 * 24));
  
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mb-12">
      {/* Header section with avatar and main info */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        {/* Banner background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 md:h-40"></div>
        
        <div className="px-4 md:px-8 relative">
          {/* Profile info container - repositioned to be lower on the white background */}
          <div className="flex flex-col md:flex-row md:items-center -mt-16 mb-4">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-md">
              {userInitial}
            </div>
            
            {/* Name and username - moved down to be more on the white background */}
            <div className="md:ml-6 mt-10 md:mt-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {profile?.full_name || profile?.username || 'User'}
              </h1>
              <p className="text-gray-600">@{profile?.username || 'username'}</p>
            </div>
            
            {/* Edit Profile button - repositioned to align better */}
            <div className="md:ml-auto mt-10 md:mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition shadow-md">
                Edit Profile
              </button>
            </div>
          </div>
          
          {/* Stats bar */}
          <div className="flex flex-wrap justify-between sm:justify-start sm:gap-8 my-6 py-4 border-b border-gray-200">
            <div className="text-center w-1/4 sm:w-auto">
              <p className="text-sm text-gray-500">Member for</p>
              <p className="text-xl font-bold text-gray-800">{daysSinceJoin} days</p>
            </div>
            <div className="text-center w-1/4 sm:w-auto">
              <p className="text-sm text-gray-500">Badges</p>
              <p className="text-xl font-bold text-gray-800">{badges?.length || 0}</p>
            </div>
            <div className="text-center w-1/4 sm:w-auto">
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-xl font-bold text-gray-800">{bookings?.length || 0}</p>
            </div>
            <div className="text-center w-1/4 sm:w-auto">
              <p className="text-sm text-gray-500">Games</p>
              <p className="text-xl font-bold text-gray-800">{gameProgress?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content - two column layout on desktop */}
      <div className="mt-6 grid md:grid-cols-12 gap-6">
        {/* Left column - Account information */}
        <div className="md:col-span-5">
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{session.user.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Username</p>
                <p className="text-gray-800 font-medium">{profile?.username || 'Not set'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-gray-800 font-medium">{profile?.full_name || 'Not set'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-gray-800 font-medium">{joinDate.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          {/* Game Progress Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Game Progress
              </h2>
              <Link href="/games" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            
            {(!gameProgress || gameProgress.length === 0) ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">No games played yet</p>
                <p className="text-gray-500 text-sm mt-1">Try our games to earn badges and discounts!</p>
                <Link 
                  href="/games" 
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Play Games
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {/* This would render actual game progress when implemented */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Desert Rider</p>
                      <p className="text-xs text-gray-500">Last played: 3 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">120</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Badges and Bookings */}
        <div className="md:col-span-7">
          {/* Badges Section */}
          <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Your Badges
              </h2>
              <button className="text-sm text-blue-600 hover:underline">
                View all
              </button>
            </div>
            
            {(!badges || badges.length === 0) ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">No badges earned yet</p>
                <p className="text-gray-500 text-sm mt-1">Complete experiences and play games to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* This would be populated with actual badges when available */}
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="font-medium">First Time Player</p>
                  <p className="text-xs text-gray-500">Played your first game</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Bookings Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Recent Bookings
              </h2>
              <Link href="/bookings" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            
            {(!bookings || bookings.length === 0) ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">No bookings found</p>
                <p className="text-gray-500 text-sm mt-1">Browse our experiences to book your next adventure!</p>
                <Link 
                  href="/experiences" 
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Explore Experiences
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* This would be populated with actual bookings when available */}
                <div className="bg-gray-50 rounded-lg p-4 relative overflow-hidden">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Desert Adventure</h3>
                      <p className="text-sm text-gray-500">Booked for: May 15, 2025</p>
                      <div className="mt-2">
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 h-full w-1 bg-blue-600"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
