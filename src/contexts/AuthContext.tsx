'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  checkAdminStatus: (userId: string) => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin using the API endpoint
  const checkAdminStatus = async (userId: string) => {
    try {
      // First try to use the API endpoint
      const response = await fetch('/api/auth/check-admin');
      if (response.ok) {
        const { isAdmin } = await response.json();
        setIsAdmin(isAdmin);
        localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
        return;
      }
      
      // Fallback to direct Supabase query if API fails
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      } else {
        setIsAdmin(false);
        localStorage.setItem('isAdmin', 'false');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
    }
  };
  
  // Function to refresh admin status - can be called when needed
  const refreshAdminStatus = async () => {
    if (user) {
      await checkAdminStatus(user.id);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      // Check if there's a stored admin status
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(storedIsAdmin);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          await checkAdminStatus(user.id);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await checkAdminStatus(currentUser.id);
        } else {
          setIsAdmin(false);
          localStorage.setItem('isAdmin', 'false');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isLoading, 
      checkAdminStatus, 
      refreshAdminStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}