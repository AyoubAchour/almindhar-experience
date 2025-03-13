'use client';

import { useSearchParams } from 'next/navigation';
import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get('confirmed') === 'true';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 justify-center items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-lg mb-8">
            Sign in to access your Almindhar Experience account and discover amazing Tunisian adventures.
          </p>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Why join us?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Access exclusive Tunisian adventure experiences</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Play mini-games to earn rewards and discounts</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Track your bookings and collect achievement badges</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Sign in to your account</h2>
        <p className="mt-3 text-gray-600">
        Welcome back to Almindhar Experience
        </p>
        </div>
        
        {confirmed && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg className="h-5 w-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-medium">Email confirmed successfully!</span>
                </div>
                <p className="text-sm">You can now sign in with your credentials.</p>
              </div>
            )}
            
            <div className="bg-white p-8 rounded-xl shadow-md">
            <SignInForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account yet?{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
