import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BadgesList } from "./components/BadgesList";

type BadgeWithStatus = {
  id: string;
  name: string;
  label: string;
  description: string;
  earned: boolean;
  earned_at?: string;
};

export default async function BadgesPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile to ensure profile is complete
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('profile_complete')
    .eq('id', user.id)
    .single();

  if (!profile || profile.profile_complete !== true) {
    return redirect("/complete-profile");
  }

  // Fetch all badges
  const { data: allBadges } = await supabase
    .from('badges')
    .select('id, name, label, description')
    .order('name');

  // Fetch user's earned badges - log the query and results for debugging
  const { data: userBadges, error: badgesError } = await supabase
    .from('user_badges')
    .select('badge_id, awarded_at')
    .eq('user_id', user.id);


  // Create a map of earned badge IDs for quick lookup
  const earnedBadgesMap = new Map();
  if (userBadges && userBadges.length > 0) {
    userBadges.forEach(badge => {
      earnedBadgesMap.set(badge.badge_id, badge.awarded_at);
    });
  }

  // Combine all badges with earned status
  const badgesWithStatus: BadgeWithStatus[] = allBadges?.map(badge => ({
    ...badge,
    earned: earnedBadgesMap.has(badge.id),
    earned_at: earnedBadgesMap.get(badge.id) || undefined
  })) || [];

  // Count earned badges
  const earnedBadgesCount = badgesWithStatus.filter(badge => badge.earned).length;
  const totalBadges = badgesWithStatus.length;
  const progressPercentage = totalBadges > 0 ? Math.round((earnedBadgesCount / totalBadges) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Vos Badges</h1>
          <p className="text-blue-100 text-lg max-w-3xl">
            Collectionnez des badges en participant à des expériences et en relevant des défis.
          </p>
          
          {/* Progress bar */}
          <div className="mt-8 max-w-2xl">
            <div className="flex justify-between text-sm mb-2">
              <span>{earnedBadgesCount} badges obtenus</span>
              <span>{totalBadges} total</span>
            </div>
            <div className="h-3 bg-blue-800 bg-opacity-40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Badges list with filtering */}
          <BadgesList badges={badgesWithStatus} />
          
          {/* Call to action */}
          {earnedBadgesCount < totalBadges && (
            <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-indigo-100 text-center">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Débloquez plus de badges!</h3>
              <p className="text-gray-600 mb-4">
                Participez à des expériences et relevez des défis pour obtenir tous les badges.
              </p>
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                <Link href="/experiences">Découvrir les Expériences</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
