import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user's bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, experiences(*)')
    .eq('user_id', user.id)
    .order('booking_date', { ascending: false });

  // Fetch user's rewards
  const { data: rewards } = await supabase
    .from('user_rewards')
    .select('*, rewards(*)')
    .eq('user_id', user.id);

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-6xl mx-auto p-4 md:p-8">
      <div className="bg-gradient-to-r from-primary to-primary/70 text-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Bienvenue, {profile?.full_name || user.email}</h1>
            <p className="text-white/80">Gérez vos aventures et récompenses</p>
          </div>
          <form action={signOutAction} className="mt-4 md:mt-0">
            <Button type="submit" variant="outline" className="bg-white text-primary hover:bg-white/90">
              Déconnexion
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="font-bold text-xl mb-4">Actions Rapides</h2>
          <div className="space-y-3">
            <Link href="/experiences" className="block">
              <Button className="w-full justify-start" variant="outline">
                Parcourir les Expériences
              </Button>
            </Link>
            <Link href="/protected/profile" className="block">
              <Button className="w-full justify-start" variant="outline">
                Modifier le Profil
              </Button>
            </Link>
            <Link href="/games" className="block">
              <Button className="w-full justify-start" variant="outline">
                Jouer aux Jeux
              </Button>
            </Link>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="font-bold text-xl mb-4">Vos Réservations</h2>
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="border-b pb-3">
                  <p className="font-medium">{booking.experiences?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.booking_date).toLocaleDateString()} • {booking.number_of_people} {booking.number_of_people === 1 ? 'personne' : 'personnes'}
                  </p>
                  <p className="text-xs mt-1 capitalize">{booking.status}</p>
                </div>
              ))}
              {bookings.length > 3 && (
                <Link href="/protected/bookings" className="text-sm text-primary hover:underline block mt-2">
                  Voir toutes les réservations
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Aucune réservation pour le moment</p>
              <Link href="/experiences">
                <Button variant="default" size="sm">Réserver une Expérience</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Rewards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="font-bold text-xl mb-4">Vos Récompenses</h2>
          {rewards && rewards.length > 0 ? (
            <div className="space-y-4">
              {rewards.slice(0, 3).map((userReward) => (
                <div key={userReward.id} className="border-b pb-3">
                  <p className="font-medium">{userReward.rewards?.name}</p>
                  <p className="text-sm text-muted-foreground">{userReward.rewards?.description}</p>
                  <p className="text-xs mt-1">{userReward.redeemed ? 'Utilisée' : 'Disponible'}</p>
                </div>
              ))}
              {rewards.length > 3 && (
                <Link href="/protected/rewards" className="text-sm text-primary hover:underline block mt-2">
                  Voir toutes les récompenses
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Aucune récompense pour le moment</p>
              <Link href="/experiences">
                <Button variant="default" size="sm">Gagner des Récompenses</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="font-bold text-xl mb-4">Expériences Recommandées</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Bientôt disponible !</p>
          </div>
        </div>
      </div>
    </div>
  );
}
