import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EditableProfile from './components/EditableProfile';

const PREFERENCES = [
  { id: 'desert', name: 'Aventure dans le désert', icon: '🏜️' },
  { id: 'culture', name: 'Visites culturelles', icon: '🏛️' },
  { id: 'family', name: 'Activités familiales', icon: '👨‍👩‍👧‍👦' },
  { id: 'food', name: 'Gastronomie', icon: '🍽️' },
  { id: 'nature', name: 'Nature & Randonnée', icon: '🌄' },
  { id: 'sports', name: 'Sports & Loisirs', icon: '🏄‍♂️' },
  { id: 'wellness', name: 'Bien-être & Spa', icon: '💆‍♀️' },
  { id: 'shopping', name: 'Artisanat & Shopping', icon: '🛍️' },
];

type UserBadgeWithLabel = {
  id: string;
  badges: { label: string } | { label: string }[];
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/sign-in');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, avatar_url, preferences, profile_complete')
    .eq('id', user.id)
    .single();

  if (!profile || profile.profile_complete !== true) {
    return redirect('/complete-profile');
  }

  const preferences: string[] = profile.preferences || [];

  // Fetch user badges
  const { data: userBadgesRaw } = await supabase
    .from('user_badges')
    .select('id, badges(label)')
    .eq('user_id', user.id);
  const userBadges = (userBadgesRaw ?? []) as UserBadgeWithLabel[];

  return (
    <div className="flex-1 w-full flex flex-col gap-6 max-w-2xl mx-auto p-4 md:p-8">
      <EditableProfile
        initialProfile={{
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          preferences: preferences,
        }}
        userEmail={user.email ?? ''}
        userId={user.id}
        userBadges={userBadges}
      />
    </div>
  );
} 