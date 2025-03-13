import { createClient } from '@/lib/supabase/server';


/**
 * Checks if the current user is an admin (server-side)
 * @returns Boolean indicating if user is admin
 */
export async function isCurrentUserAdmin() {
  const supabase = await createClient();
  
  // Get current user's session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  
  // Check if user ID exists in admins table
  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', session.user.id)
    .single();
  
  // If no error and data exists, user is an admin
  const isAdmin = !error && !!data;
  
  // Cookie setting approach for Next.js 14+
  // Reading cookies is synchronous, but we're not setting them from server components
  // We'll handle this on the client side instead
  
  return isAdmin;
}

/**
 * Server component version for use in React Server Components
 */
export async function checkAdminAccess() {
  const isAdmin = await isCurrentUserAdmin();
  
  if (!isAdmin) {
    return false;
  }
  
  return true;
}

/**
 * Client-side function to get admin status
 * Uses localStorage for client-side state persistence
 */
export function getClientAdminStatus(): boolean {
  // Implementation will be used in client components
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAdmin') === 'true';
  }
  
  return false;
}