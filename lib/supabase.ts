// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);