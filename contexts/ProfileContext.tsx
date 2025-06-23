'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

type Profile = {
  full_name: string;
  avatar_url: string | null;
  preferences: string[];
};

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
  userId: string;
  initialProfile?: Profile;
}

export function ProfileProvider({ children, userId, initialProfile }: ProfileProviderProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null);
  const supabase = createClient();

  const refreshProfile = async () => {
    console.log('Refreshing profile...');
    const { data } = await supabase
      .from('user_profiles')
      .select('full_name, avatar_url, preferences')
      .eq('id', userId)
      .single();

    if (data) {
      console.log('Got fresh profile data:', data);
      setProfile(data as Profile);
    }
  };

  const updateProfile = (newProfile: Profile) => {
    console.log('Updating profile in context:', newProfile);
    setProfile(newProfile);
  };

  useEffect(() => {
    // Subscribe to profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`
        },
        async (payload) => {
          console.log('Profile change detected:', payload);
          await refreshProfile();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
