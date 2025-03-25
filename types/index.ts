// TypeScript interfaces for data models

/**
 * Experience interface representing a tour or activity
 */
export interface Experience {
    id: string;
    title: string;
    description: string;
    location: string;
    image_url: string;
    price: number;
    duration: number; // in minutes
    capacity: number;
    difficulty: 'easy' | 'moderate' | 'challenging';
    features: Feature[];
    has_game: boolean;
    game_id?: string;
    available_dates: AvailableDate[];
    created_at: string;
    updated_at?: string;
}

/**
 * Feature interface for included/not included items in an experience
 */
export interface Feature {
    type: 'included' | 'not_included';
    name: string;
}

/**
 * AvailableDate interface for tracking available booking dates
 */
export interface AvailableDate {
    date: string;
    available: boolean;
    spots_left: number;
}

/**
 * Booking interface for user bookings
 */
export interface Booking {
    id: string;
    user_id: string;
    experience_id: string;
    booking_date: string;
    number_of_people: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    total_price: number;
    reward_id?: string;
    created_at: string;
    updated_at?: string;
}

/**
 * UserProfile interface for user information
 */
export interface UserProfile {
    id: string;
    full_name?: string;
    avatar_url?: string;
    preferences?: Record<string, any>;
    created_at: string;
    updated_at?: string;
}

/**
 * Reward interface for the loyalty program
 */
export interface Reward {
    id: string;
    name: string;
    description: string;
    points_required: number;
    image_url?: string;
    experience_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

/**
 * Database interface for Supabase type safety
 */
export interface Database {
    public: {
        Tables: {
            experiences: {
                Row: Experience;
                Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>;
            };
            bookings: {
                Row: Booking;
                Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>;
            };
            user_profiles: {
                Row: UserProfile;
                Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
            };
            rewards: {
                Row: Reward;
                Insert: Omit<Reward, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Reward, 'id' | 'created_at' | 'updated_at'>>;
            };
        };
    };
}