import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';


export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 justify-center items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Discover Tunisian Adventures</h1>
          <p className="text-lg mb-8">
            Join Almindhar Experience to explore unique activities and earn rewards through interactive games.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Play Games</h3>
              <p className="text-sm text-blue-100">Try out our interactive mini-games that simulate real experiences.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-blue-100">Get discounts and badges for high scores in our games.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create your account</h2>
            <p className="mt-3 text-gray-600">
              Join Almindhar Experience to discover amazing Tunisian adventures
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <SignUpForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}