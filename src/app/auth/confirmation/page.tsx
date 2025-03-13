import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 justify-center items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Almost There!</h1>
          <p className="text-lg mb-8">
            Your account is being created. Just one more step to unlock amazing Tunisian adventures.
          </p>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Why verify your email?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Secure your personal information</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Protect your bookings and rewards</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Receive important updates about your adventures</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-8">
              We've sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                <p className="font-medium">Didn't receive the email?</p>
                <p className="mt-1">Check your spam folder or try signing in. We can resend the verification email if needed.</p>
              </div>
              
              <Link 
                href="/auth/login" 
                className="inline-block w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
