'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An authentication error occurred.';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-red-600 to-red-800 text-white p-10 justify-center items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Authentication Error</h1>
          <p className="text-lg mb-8">
            Something went wrong during the authentication process. Don't worry, we're here to help you get back on track.
          </p>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-xl mb-3">What you can do:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Try signing in with your email and password</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Request a new confirmation email if needed</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-red-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Reset your password if you're having trouble signing in</span>
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
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-8">
              {errorMessage}
            </p>
            
            <div className="space-y-4">
              <Link 
                href="/auth/login" 
                className="inline-block w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Go to Sign In
              </Link>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Link 
                  href="/auth/reset-password" 
                  className="inline-block w-full sm:w-1/2 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  Reset Password
                </Link>
                <Link 
                  href="/" 
                  className="inline-block w-full sm:w-1/2 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
