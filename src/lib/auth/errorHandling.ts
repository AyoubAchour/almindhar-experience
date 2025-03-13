/**
 * Parses Supabase authentication errors and returns user-friendly messages
 */
export function parseAuthError(error: unknown): string {
  if (!error) return 'An unexpected error occurred';
  
  // Convert error to string if it's not already
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  
  // Check for common error patterns and provide user-friendly messages
  
  // Username already exists
  if (errorMessage.includes('profiles_username_key') || 
      errorMessage.includes('duplicate key value violates unique constraint')) {
    return 'This username is already taken. Please choose a different username.';
  }
  
  // Email already exists (usually handled by Supabase directly, but just in case)
  if (errorMessage.includes('email already exists') || 
      errorMessage.includes('unique constraint "auth_users_email_key"') ||
      errorMessage.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in or reset your password.';
  }
  
  // Invalid login credentials
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  // Email not confirmed
  if (errorMessage.includes('Email not confirmed')) {
    return 'Please confirm your email address before signing in. Check your inbox for a confirmation link.';
  }
  
  // Rate limiting
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return 'Too many attempts. Please try again later.';
  }
  
  // Return original error message if no specific case is matched
  return errorMessage;
}