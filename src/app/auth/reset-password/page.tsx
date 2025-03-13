'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@/lib/auth/utils';
import { parseAuthError } from '@/lib/auth/errorHandling';
import Link from 'next/link';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(data.email);

      if (error) throw error;

      // Show success message
      setIsSubmitted(true);
    } catch (err: unknown) {
      // Use the parseAuthError utility function for better error messages
      setError(parseAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 justify-center items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Password Recovery</h1>
          <p className="text-lg mb-8">
            We'll help you recover your account and get back to exploring amazing Tunisian adventures.
          </p>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-xl mb-3">How it works:</h3>
            <ol className="space-y-4 list-decimal list-inside">
              <li className="pl-2">
                <span className="text-blue-200 font-medium">Enter your email</span>
                <p className="text-sm ml-6 mt-1">Provide the email address you used to register.</p>
              </li>
              <li className="pl-2">
                <span className="text-blue-200 font-medium">Check your inbox</span>
                <p className="text-sm ml-6 mt-1">We'll send you a secure link to reset your password.</p>
              </li>
              <li className="pl-2">
                <span className="text-blue-200 font-medium">Create a new password</span>
                <p className="text-sm ml-6 mt-1">Follow the link to set up a new, secure password.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Reset Your Password</h2>
            <p className="mt-3 text-gray-600">
              {!isSubmitted 
                ? 'Enter your email address to receive a password reset link' 
                : 'Check your email for a password reset link'}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">{errors.email.message}</p>
                  )}
                </div>

                {error && <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
                
                <div className="text-center mt-4">
                  <Link
                    href="/auth/login"
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg text-center">
                  <svg className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-green-800 font-medium mb-2">Email Sent Successfully!</p>
                  <p className="text-green-700 text-sm">
                    If an account exists with this email, you will receive a password reset link shortly. Please check your inbox and spam folder.
                  </p>
                </div>
                
                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="inline-block px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Return to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
