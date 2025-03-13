'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword } from '@/lib/auth/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters')
    .refine(password => {
      return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
    }, {
      message: 'Password must contain uppercase, lowercase, and a number',
    }),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordConfirmationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

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
      const { error } = await updatePassword(data.password);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to update password');
      } else {
        setError('Failed to update password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 justify-center items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Reset Your Password</h1>
          <p className="text-lg mb-8">
            Choose a new secure password for your Almindhar Experience account.
          </p>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-xl mb-3">Password Tips:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Use a mix of letters, numbers, and symbols</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Avoid using personal information</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-300 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Create a password you don't use elsewhere</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create New Password</h2>
            <p className="mt-3 text-gray-600">
              {!isSuccess 
                ? 'Please enter and confirm your new password' 
                : 'Your password has been updated successfully'}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm">{errors.password.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters and include uppercase, lowercase, and a number
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
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
                      Updating Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg text-center">
                  <svg className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-green-800 font-medium mb-2">Password Updated Successfully!</p>
                  <p className="text-green-700 text-sm">
                    Your password has been reset. You will be redirected to the login page shortly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}