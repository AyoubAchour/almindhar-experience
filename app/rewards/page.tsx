import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ScrollButton from '@/components/scroll-button';
import { Metadata } from "next";
import RewardsClientComponents from "./client-components";

export const metadata: Metadata = {
  title: "Programme de Récompenses | Almindhar Experience",
  description: "Découvrez notre programme de fidélité et gagnez des récompenses exclusives en participant à nos expériences et jeux interactifs.",
};

export default async function RewardsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();

  // Fetch rewards data - this will be expanded in future implementations
  // For now, we'll use static data
  const rewards = [
    {
      id: "free-guide",
      title: "Guide Touristique Gratuit",
      description: "Recevez un guide touristique numérique exclusif sur la destination de votre choix",
      image: "/reward-guide.jpg",
      requirements: {
        type: 'bookings',
        count: 1
      },
      validityPeriod: "1 an"
    },
    {
      id: "discount-10",
      title: "Réduction de 10%",
      description: "Obtenez une réduction de 10% sur votre prochaine réservation d'expérience",
      image: "/reward-discount.jpg",
      requirements: {
        type: 'games',
        count: 3
      },
      validityPeriod: "6 mois"
    },
    {
      id: "private-tour",
      title: "Visite Privée",
      description: "Profitez d'une visite privée exclusive pour vous et jusqu'à 3 invités",
      image: "/reward-tour.jpg",
      requirements: {
        type: 'bookings',
        count: 3
      },
      validityPeriod: "1 an"
    },
    {
      id: "premium-upgrade",
      title: "Surclassement Premium",
      description: "Bénéficiez d'un surclassement vers une expérience premium sans frais supplémentaires",
      image: "/reward-upgrade.jpg",
      requirements: {
        type: 'referrals',
        count: 2
      },
      validityPeriod: "6 mois"
    }
  ];

  return (
    <div className="flex flex-col" data-section="rewards">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        {/* Animated Blob Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-800">
          {/* Blob 1 */}
          <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 opacity-30 blur-3xl animate-blob"></div>
          {/* Blob 2 */}
          <div className="absolute top-[20%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
          {/* Blob 3 */}
          <div className="absolute bottom-[10%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-blue-500 to-teal-500 opacity-30 blur-3xl animate-blob animation-delay-4000"></div>
          {/* Blob 4 */}
          <div className="absolute bottom-[20%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-30 blur-3xl animate-blob animation-delay-6000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 md:px-8 w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            PROGRAMME DE RÉCOMPENSES
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mb-10">
            Gagnez des récompenses exclusives en participant à nos expériences et jeux interactifs.
          </p>
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
            <Link href="#rewards-section">Découvrir les Récompenses</Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <ScrollButton targetId="how-it-works" />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment Ça Marche</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre programme de récompenses vous permet de gagner des avantages exclusifs en participant à nos expériences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Participez</h3>
              <p className="text-gray-600">
                Réservez des expériences, jouez à nos jeux interactifs ou parrainez des amis
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Collectez</h3>
              <p className="text-gray-600">
                Accumulez des points et débloquez des récompenses exclusives
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Profitez</h3>
              <p className="text-gray-600">
                Utilisez vos récompenses pour améliorer vos futures expériences
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-800 text-white w-full overflow-hidden">
        {/* Blob decorations */}
        <div className="absolute top-[10%] left-[15%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Avantages du Programme</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Rejoignez Almindhar Experience et transformez chaque jeu ou expérience en une opportunité de gagner des récompenses concrètes et de vivre des moments uniques en Tunisie.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-xl p-6 shadow flex flex-col items-start">
              <h3 className="text-xl font-bold mb-2">Réductions Immédiates</h3>
              <p className="text-gray-200">
                Obtenez des coupons ou remises à utiliser lors de vos prochaines réservations, en fonction de vos scores ou de votre fidélité.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 shadow flex flex-col items-start">
              <h3 className="text-xl font-bold mb-2">Badges & Trophées</h3>
              <p className="text-gray-200">
                Collectionnez des badges pour chaque défi ou expérience accomplie et affichez vos succès dans votre profil.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à Gagner des Récompenses?</h2>
              <p className="text-xl max-w-2xl mx-auto mb-8">
                Commencez dès maintenant à participer à nos expériences et jeux pour débloquer des avantages exclusifs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                  <Link href="/experiences">Réserver une Expérience</Link>
                </Button>
                <Button asChild size="lg" className="bg-transparent border border-white text-white hover:bg-white hover:text-indigo-700 transition-all duration-300">
                  <Link href="/games">Jouer aux Jeux</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
