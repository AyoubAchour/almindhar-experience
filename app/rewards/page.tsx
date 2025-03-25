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
    <div className="flex flex-col">
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

      {/* Rewards Section */}
      <section id="rewards-section" className="py-20 px-4 bg-gradient-to-b from-indigo-50 to-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Récompenses Disponibles</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les récompenses exclusives que vous pouvez gagner en participant à notre programme de fidélité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      {reward.requirements.type === 'bookings' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {reward.requirements.type === 'games' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {reward.requirements.type === 'referrals' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{reward.title}</h3>
                  <p className="text-gray-600 mb-4">{reward.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Validité:</span> {reward.validityPeriod}
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                      {reward.requirements.type === 'bookings' && `${reward.requirements.count} réservation${reward.requirements.count > 1 ? 's' : ''}`}
                      {reward.requirements.type === 'games' && `${reward.requirements.count} jeu${reward.requirements.count > 1 ? 'x' : ''} terminé${reward.requirements.count > 1 ? 's' : ''}`}
                      {reward.requirements.type === 'referrals' && `${reward.requirements.count} parrainage${reward.requirements.count > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <Link 
                    href={`/rewards/${reward.id}`}
                    className="block text-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 transition-all duration-300"
                  >
                    Voir les Détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Rewards Section - Only visible for logged in users */}
      {session && (
        <section className="py-20 px-4 bg-white w-full">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Vos Récompenses</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Voici les récompenses que vous avez gagnées en participant à notre programme de fidélité
              </p>
            </div>
            
            {/* This will be replaced with actual user rewards data in future implementation */}
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">
                Vous n'avez pas encore gagné de récompenses. Participez à nos expériences et jeux pour en gagner !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Link href="/experiences">Découvrir les Expériences</Link>
                </Button>
                <Button asChild className="bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  <Link href="/games">Jouer aux Jeux</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

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
              Notre programme de récompenses vous offre de nombreux avantages exclusifs:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">Récompenses Exclusives</h3>
                  <p className="text-gray-200">
                    Accédez à des avantages et des offres disponibles uniquement pour les membres
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">Économies Substantielles</h3>
                  <p className="text-gray-200">
                    Réduisez le coût de vos expériences grâce à nos récompenses et réductions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">Expériences Améliorées</h3>
                  <p className="text-gray-200">
                    Bénéficiez de surclassements et d'options premium pour enrichir vos voyages
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">Programme Gratuit</h3>
                  <p className="text-gray-200">
                    Aucun frais d'adhésion - il vous suffit de participer à nos expériences et jeux
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white rounded-md px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
              <Link href="#rewards-section">Découvrir les Récompenses</Link>
            </Button>
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
