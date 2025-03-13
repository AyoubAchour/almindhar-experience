import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Tunisian Adventures
            </h1>
            <p className="mt-6 text-xl leading-7 max-w-2xl">
              Experience the beauty and culture of Tunisia through immersive adventures and unique experiences.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/experiences" 
                className="rounded-md bg-white px-5 py-3 text-center font-medium text-blue-600 hover:bg-gray-50"
              >
                Explore Experiences
              </Link>
              {!session ? (
                <Link 
                  href="/auth/signup" 
                  className="rounded-md bg-blue-400 bg-opacity-20 px-5 py-3 text-center font-medium text-white hover:bg-opacity-30"
                >
                  Sign Up
                </Link>
              ) : (
                <Link 
                  href="/profile" 
                  className="rounded-md bg-blue-400 bg-opacity-20 px-5 py-3 text-center font-medium text-white hover:bg-opacity-30"
                >
                  My Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Unforgettable Experiences
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
              Play mini-games to preview and earn rewards on your next adventure.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {/* Desert Rider Experience */}
            <div className="group relative bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="h-48 w-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Desert Rider</h3>
                <p className="mt-2 text-sm text-gray-500">Experience the Sahara desert on a camel ride adventure.</p>
                <div className="mt-4">
                  <Link 
                    href="/experiences"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Learn more
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Skyfall Simulator */}
            <div className="group relative bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Skyfall Simulator</h3>
                <p className="mt-2 text-sm text-gray-500">Experience the thrill of parachuting with amazing views.</p>
                <div className="mt-4">
                  <Link 
                    href="/experiences"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Learn more
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Coral Reef Explorer */}
            <div className="group relative bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="h-48 w-full bg-gradient-to-r from-teal-400 to-blue-500"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Coral Reef Explorer</h3>
                <p className="mt-2 text-sm text-gray-500">Discover the underwater world of Tunisia&apos;s coral reefs.</p>
                <div className="mt-4">
                  <Link 
                    href="/experiences"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Learn more
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
          </div>
          
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Play Mini-Games</h3>
              <p className="mt-2 text-base text-gray-500">Try out our interactive games that simulate the real experiences.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Earn Rewards</h3>
              <p className="mt-2 text-base text-gray-500">Score high to unlock discounts and special badges.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Book Adventures</h3>
              <p className="mt-2 text-base text-gray-500">Use your rewards to book real-life adventures in Tunisia.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready for your next adventure?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Sign up now and start exploring the amazing experiences Tunisia has to offer.
          </p>
          <Link
            href={session ? "/experiences" : "/auth/signup"}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            {session ? "Explore Experiences" : "Get Started"}
          </Link>
        </div>
      </div>
    </div>
  );
}
