import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ScrollButton from '@/components/scroll-button';
import { Metadata } from "next";
import GamesClientComponents from "./client-components";

export const metadata: Metadata = {
  title: "Jeux Interactifs | Almindhar Experience",
  description: "Découvrez nos jeux interactifs qui vous permettent d'explorer virtuellement la Tunisie et de gagner des coupons de réduction pour vos réservations.",
};

export default async function GamesPage() {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  // Fetch game data - this will be expanded in future implementations
  // For now, we'll use static data that matches your homepage
  const games = [
    {
      id: "desert-rider",
      title: "Desert Rider",
      description: "Simulez une balade à dos de chameau dans le désert tunisien",
      image: "/game-1.jpg",
      experienceTag: "Désert du Sahara",
      tagColor: "bg-orange-500",
      scoreThreshold: 75,
      discount: 15
    },
    {
      id: "carthage-explorer",
      title: "Carthage Explorer",
      description: "Explorez virtuellement les ruines historiques de Carthage",
      image: "/game-2.jpg",
      experienceTag: "Ruines de Carthage",
      tagColor: "bg-green-500",
      scoreThreshold: 80,
      discount: 10
    },
    {
      id: "medina-treasure",
      title: "Medina Treasure",
      description: "Cherchez des trésors cachés dans la médina de Tunis",
      image: "/game-3.jpg",
      experienceTag: "Médina de Tunis",
      tagColor: "bg-indigo-500",
      scoreThreshold: 70,
      discount: 15
    },
    {
      id: "djerba-adventure",
      title: "Djerba Adventure",
      description: "Explorez l'île de Djerba dans cette aventure virtuelle",
      image: "/game-4.jpg",
      experienceTag: "Île de Djerba",
      tagColor: "bg-blue-500",
      scoreThreshold: 85,
      discount: 20
    }
  ];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        {/* Animated Blob Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800">
          {/* Blob 1 */}
          <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-30 blur-3xl animate-blob"></div>
          {/* Blob 2 */}
          <div className="absolute top-[20%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
          {/* Blob 3 */}
          <div className="absolute bottom-[10%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-30 blur-3xl animate-blob animation-delay-4000"></div>
          {/* Blob 4 */}
          <div className="absolute bottom-[20%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-30 blur-3xl animate-blob animation-delay-6000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 md:px-8 w-full">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            EXPLOREZ LA TUNISIE À TRAVERS NOS JEUX
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mb-10">
            Découvrez nos jeux interactifs, gagnez des coupons de réduction et préparez-vous pour vos aventures tunisiennes.
          </p>
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
            <Link href="#games-section">Découvrir les Jeux</Link>
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
              Jouez à nos jeux interactifs, gagnez des coupons et utilisez-les pour vos réservations d'expériences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Jouez à un Jeu</h3>
              <p className="text-gray-600">
                Choisissez un jeu lié à une expérience qui vous intéresse et jouez-y
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Battez le Score</h3>
              <p className="text-gray-600">
                Atteignez ou dépassez le score minimum requis pour gagner un coupon
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Gagnez un Coupon</h3>
              <p className="text-gray-600">
                Recevez automatiquement un coupon de réduction pour l'expérience associée
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-indigo-600 text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Réservez avec Réduction</h3>
              <p className="text-gray-600">
                Utilisez votre coupon lors de la réservation pour bénéficier d'une réduction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games-section" className="py-20 px-4 bg-gradient-to-b from-indigo-50 to-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Jeux Interactifs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorez virtuellement la Tunisie à travers nos jeux interactifs et gagnez des coupons de réduction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {games.map((game) => (
              <div key={game.id} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Image 
                  src={game.image} 
                  alt={game.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-6">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/games/${game.id}`}>
                      <div className="bg-indigo-600/80 rounded-full p-4 transform transition-transform duration-300 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polygon points="10 8 16 12 10 16 10 8"></polygon>
                        </svg>
                      </div>
                    </Link>
                  </div>
                  <span className={`${game.tagColor} text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-3 right-3`}>
                    {game.experienceTag}
                  </span>
                  <div className="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Score: {game.scoreThreshold}+ = {game.discount}% de réduction
                  </div>
                  <h4 className="text-white font-bold text-xl mb-2 z-10">{game.title}</h4>
                  <p className="text-gray-300 text-sm z-10 text-center">{game.description}</p>
                  <Link 
                    href={`/games/${game.id}`}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
                  >
                    Jouer Maintenant
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Coupons Section - Only visible for logged in users */}
      {session && (
        <section className="py-20 px-4 bg-white w-full">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Vos Coupons</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Voici les coupons que vous avez gagnés en jouant à nos jeux interactifs
              </p>
            </div>
            
            {/* This will be replaced with actual user coupons data in future implementation */}
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">
                Vous n'avez pas encore gagné de coupons. Jouez à nos jeux pour en gagner !
              </p>
              <Button asChild size="lg" className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="#games-section">Découvrir les Jeux</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white w-full overflow-hidden">
        {/* Blob decorations */}
        <div className="absolute top-[10%] left-[15%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Jouer à Nos Jeux</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Nos jeux interactifs sont directement liés à nos expériences touristiques réelles. Ils vous permettent de:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">Découvrir Virtuellement</h3>
                  <p className="text-gray-200">
                    Explorez les destinations tunisiennes avant même de réserver votre voyage
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">Économiser de l'Argent</h3>
                  <p className="text-gray-200">
                    Gagnez des coupons de réduction exclusifs pour vos réservations
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
                  <h3 className="text-xl font-bold mb-2">Apprendre sur la Culture</h3>
                  <p className="text-gray-200">
                    Découvrez l'histoire et la culture tunisiennes de manière interactive
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold mb-2">Préparer Votre Voyage</h3>
                  <p className="text-gray-200">
                    Obtenez des informations pratiques pour mieux planifier votre aventure
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white rounded-md px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
              <Link href="/experiences?game=true">Découvrir les Expériences avec Jeux</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à Explorer la Tunisie?</h2>
              <p className="text-xl max-w-2xl mx-auto mb-8">
                Commencez votre aventure virtuelle dès maintenant et gagnez des réductions pour vos futures expériences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                  <Link href="#games-section">Jouer Maintenant</Link>
                </Button>
                <Button asChild size="lg" className="bg-transparent border border-white text-white hover:bg-white hover:text-indigo-700 transition-all duration-300">
                  <Link href="/experiences">Explorer les Expériences</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
