'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '@/lib/auth/utils';
import { parseAuthError } from '@/lib/auth/errorHandling';
import { useRouter } from 'next/navigation';


const signUpSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
        .refine(password => {
            return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
        }, {
            message: 'Password must contain uppercase, lowercase, and a number',
        }),
    username: z.string().min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    fullName: z.string().optional(),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
        // Set loading state
        setIsLoading(true);
        setError(null);
        
        const { data: authData, error } = await signUp({
            email: data.email,
                password: data.password,
            username: data.username,
            full_name: data.fullName,
        });

        // If there was an error during signup, throw it
        if (error) throw error;
        
        // Extra validation: ensure we have a valid user
        if (!authData?.user?.id) {
            throw new Error('Failed to create account. Please try again later.');
        }
        
        // If email confirmation is enabled in Supabase, this will be true
        const emailConfirmationRequired = authData?.user?.identities?.length === 0 || 
                                      authData?.user?.identities?.[0]?.identity_data?.email_confirmed_at === null;
        
        console.log('Signup successful:', authData);
        console.log('Email confirmation required?', emailConfirmationRequired);
        console.log('User identities:', authData?.user?.identities);
        console.log('Email confirmed at:', authData?.user?.identities?.[0]?.identity_data?.email_confirmed_at);

        // During development, always redirect to confirmation page for testing
        router.push('/auth/confirmation');
            
        } catch (err: unknown) {
            // Use the parseAuthError utility function for better error messages
            setError(parseAuthError(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
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

            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    placeholder="johnsmith"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    {...register('username')}
                />
                {errors.username && (
                    <p className="text-red-600 text-sm">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                    id="fullName"
                    type="text"
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    {...register('fullName')}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    {...register('password')}
                />
                {errors.password && (
                    <p className="text-red-600 text-sm">{errors.password.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters and include uppercase, lowercase, and a number
                </p>
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
                        Creating account...
                    </div>
                ) : (
                    'Create Account'
                )}
            </button>
            
            <div className="mt-6">
                <p className="text-xs text-center text-gray-600">
                    By signing up, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </form>
    );
}