import { supabase } from '@/lib/supabase/client';

export type SignUpCredentials = {
    email: string;
    password: string;
    username: string;
    full_name?: string;
};

export type SignInCredentials = {
    email: string;
    password: string;
};

export async function signUp({ email, password, username, full_name }: SignUpCredentials) {
    // First check if the email already exists
    const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: false, // Don't create a new user
        },
    });
    
    // If there's no error when trying to send an OTP to this email,
    // it means the email exists (since shouldCreateUser is false)
    if (!signInError) {
        return {
            data: null,
            error: new Error('An account with this email already exists. Please sign in or reset your password.')
        };
    }

    // Now check if the username already exists
    const { data: existingUsers } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .limit(1);
    
    // If username already exists, return an error
    if (existingUsers && existingUsers.length > 0) {
        return {
            data: null,
            error: new Error('This username is already taken. Please choose a different username.')
        };
    }

    // Proceed with signup if email and username are available
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
                full_name: full_name || username,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    // Explicitly check for the case where a user might not have been created
    if (!error && (!data || !data.user)) {
        return {
            data: null,
            error: new Error('Failed to create account. Please try again.')
        };
    }

    return { data, error };
}

export async function signIn({ email, password }: SignInCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password-confirmation`,
    });

    return { data, error };
}

export async function updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
        password,
    });

    return { data, error };
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}