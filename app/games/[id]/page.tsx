import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";

// This will be expanded to generate dynamic metadata based on the game
export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  // Get game data based on ID
  const gameData = getGameData(params.id);
  
  if (!gameData) {
    return {
      title: "Jeu non trouvé | Almindhar Experience",
      description: "Ce jeu n'existe pas ou a été supprimé.",
    };
  }
  
  return {
    title: `${gameData.title} | Jeux Interactifs | Almindhar Experience`,
    description: gameData.description,
  };
};

// Helper function to get game data - will be replaced with actual database queries
function getGameData(id: string) {
  // Static data for now - will be replaced with database queries
  const games = [
    {
      id: "desert-rider",
      title: "Desert Rider",
      description: "Simulez une balade à dos de chameau dans le désert tunisien",
      longDescription: "Desert Rider vous permet de vivre l'expérience unique d'une balade à dos de chameau à travers les magnifiques dunes du désert tunisien. Naviguez à travers le paysage, évitez les obstacles, et découvrez des points d'intérêt culturels tout en apprenant sur l'histoire et les traditions du désert du Sahara.",
      image: "/game-1.jpg",
      experienceTag: "Désert du Sahara",
      experienceId: "desert-sahara",
      tagColor: "bg-orange-500",
      scoreThreshold: 75,
      discount: 15,
      howToPlay: [
        "Utilisez les flèches du clavier pour diriger votre chameau",
        "Évitez les obstacles et collectez des points d'eau",
        "Découvrez des points d'intérêt culturels pour gagner des points bonus",
        "Atteignez la fin du parcours dans le temps imparti"
      ]
    },
    {
      id: "carthage-explorer",
      title: "Carthage Explorer",
      description: "Explorez virtuellement les ruines historiques de Carthage",
      longDescription: "Carthage Explorer vous invite à découvrir les ruines historiques de l'ancienne cité de Carthage. Explorez les différents sites archéologiques, résolvez des énigmes basées sur l'histoire carthaginoise, et apprenez sur cette civilisation fascinante qui a marqué l'histoire de la Tunisie et de la Méditerranée.",
      image: "/game-2.jpg",
      experienceTag: "Ruines de Carthage",
      experienceId: "ruines-carthage",
      tagColor: "bg-green-500",
      scoreThreshold: 80,
      discount: 10,
      howToPlay: [
        "Cliquez sur les différents sites pour les explorer",
        "Résolvez les énigmes historiques pour débloquer de nouveaux sites",
        "Collectez des artefacts pour gagner des points",
        "Complétez la visite virtuelle pour terminer le jeu"
      ]
    },
    {
      id: "medina-treasure",
      title: "Medina Treasure",
      description: "Cherchez des trésors cachés dans la médina de Tunis",
      longDescription: "Medina Treasure vous emmène dans une chasse au trésor passionnante à travers les ruelles labyrinthiques de la médina de Tunis. Découvrez l'artisanat local, les monuments historiques et les spécialités culinaires tout en cherchant des indices qui vous mèneront au trésor caché. Une façon ludique de découvrir le cœur historique de la capitale tunisienne.",
      image: "/game-3.jpg",
      experienceTag: "Médina de Tunis",
      experienceId: "medina-tunis",
      tagColor: "bg-indigo-500",
      scoreThreshold: 70,
      discount: 15,
      howToPlay: [
        "Naviguez dans la médina en utilisant la carte interactive",
        "Interagissez avec les commerçants et habitants virtuels pour obtenir des indices",
        "Résolvez les énigmes culturelles pour avancer dans votre quête",
        "Trouvez le trésor caché avant la fin du temps imparti"
      ]
    },
    {
      id: "djerba-adventure",
      title: "Djerba Adventure",
      description: "Explorez l'île de Djerba dans cette aventure virtuelle",
      longDescription: "Djerba Adventure vous propose une exploration virtuelle de la magnifique île de Djerba. Découvrez ses plages paradisiaques, ses villages traditionnels, ses monuments historiques et sa riche culture. Participez à des mini-jeux représentant les activités typiques de l'île et collectez des souvenirs virtuels pour compléter votre album de voyage.",
      image: "/game-4.jpg",
      experienceTag: "Île de Djerba",
      experienceId: "ile-djerba",
      tagColor: "bg-blue-500",
      scoreThreshold: 85,
      discount: 20,
      howToPlay: [
        "Explorez la carte de l'île en cliquant sur les différents points d'intérêt",
        "Participez aux mini-jeux dans chaque location",
        "Collectez des souvenirs virtuels pour compléter votre album",
        "Découvrez tous les sites pour terminer l'aventure"
      ]
    }
  ];
  
  return games.find(game => game.id === id);
}

// Async component to handle data fetching
async function GameDetailContent({ id }: { id: string }) {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get game data based on ID
  const game = getGameData(id);
  
  // If game not found, return 404
  if (!game) {
    notFound();
  }
  
  // In a future implementation, we would fetch the user's game progress here
  const userGameData = {
    hasPlayed: false,
    highScore: 0,
    hasEarnedCoupon: false
  };
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        {/* Game Image with Overlay */}
        <div className="absolute inset-0">
          <Image 
            src={game.image} 
            alt={game.title} 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-end h-full text-white px-4 md:px-8 w-full pb-12">
          <span className={`${game.tagColor} text-white text-sm font-bold px-3 py-1 rounded-full mb-4`}>
            {game.experienceTag}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {game.title}
          </h1>
          <p className="text-xl text-center max-w-3xl mb-6">
            {game.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
              Jouer Maintenant
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              <Link href={`/experiences/${game.experienceId}`}>Voir l'Expérience</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Game Details Section */}
      <section className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Game Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">À Propos du Jeu</h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {game.longDescription}
              </p>
              
              <h3 className="text-xl font-bold mb-4">Comment Jouer</h3>
              <ul className="space-y-2 mb-8">
                {game.howToPlay.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-xl font-bold mb-4 text-indigo-800">Récompense à Gagner</h3>
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Atteignez un score de <span className="font-bold text-indigo-700">{game.scoreThreshold}+</span> pour gagner un coupon de <span className="font-bold text-indigo-700">{game.discount}% de réduction</span> sur l'expérience {game.experienceTag}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Game Stats & CTA */}
            <div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
                <h3 className="text-xl font-bold mb-4">Détails du Jeu</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expérience Associée:</span>
                    <span className="font-medium">{game.experienceTag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score Minimum:</span>
                    <span className="font-medium">{game.scoreThreshold} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Réduction:</span>
                    <span className="font-medium">{game.discount}%</span>
                  </div>
                  {session && (
                    <>
                      <div className="border-t border-gray-200 my-2 pt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Votre Meilleur Score:</span>
                          <span className="font-medium">{userGameData.highScore} points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coupon Gagné:</span>
                          <span className="font-medium">{userGameData.hasEarnedCoupon ? 'Oui' : 'Non'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg mb-4">
                Jouer Maintenant
              </Button>
              
              <Button asChild variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 text-lg">
                <Link href={`/experiences/${game.experienceId}`}>
                  Voir l'Expérience Associée
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Game Placeholder - Will be replaced with actual game */}
      <section className="py-16 px-4 bg-gray-50 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Jeu en Développement</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ce jeu est actuellement en cours de développement. Revenez bientôt pour jouer à {game.title} !
            </p>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 aspect-video max-w-4xl mx-auto flex items-center justify-center">
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Jeu {game.title}</h3>
              <p className="text-gray-500">
                Le jeu sera bientôt disponible à cet emplacement. En attendant, vous pouvez explorer les autres jeux ou découvrir l'expérience associée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Games Section */}
      <section className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Autres Jeux à Découvrir</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorez nos autres jeux interactifs et gagnez plus de coupons de réduction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filter out current game and display others */}
            {getGameData("desert-rider")?.id !== game.id && (
              <Link href="/games/desert-rider" className="group">
                <div className="relative h-48 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image 
                    src="/game-1.jpg" 
                    alt="Desert Rider" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-2 right-2">
                      Désert du Sahara
                    </span>
                    <h4 className="text-white font-bold text-lg mb-1 z-10">Desert Rider</h4>
                    <p className="text-gray-300 text-sm z-10 text-center">Simulez une balade à dos de chameau dans le désert tunisien</p>
                  </div>
                </div>
              </Link>
            )}
            
            {getGameData("carthage-explorer")?.id !== game.id && (
              <Link href="/games/carthage-explorer" className="group">
                <div className="relative h-48 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image 
                    src="/game-2.jpg" 
                    alt="Carthage Explorer" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-2 right-2">
                      Ruines de Carthage
                    </span>
                    <h4 className="text-white font-bold text-lg mb-1 z-10">Carthage Explorer</h4>
                    <p className="text-gray-300 text-sm z-10 text-center">Explorez virtuellement les ruines historiques de Carthage</p>
                  </div>
                </div>
              </Link>
            )}
            
            {getGameData("medina-treasure")?.id !== game.id && (
              <Link href="/games/medina-treasure" className="group">
                <div className="relative h-48 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image 
                    src="/game-3.jpg" 
                    alt="Medina Treasure" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                    <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-2 right-2">
                      Médina de Tunis
                    </span>
                    <h4 className="text-white font-bold text-lg mb-1 z-10">Medina Treasure</h4>
                    <p className="text-gray-300 text-sm z-10 text-center">Cherchez des trésors cachés dans la médina de Tunis</p>
                  </div>
                </div>
              </Link>
            )}
            
            {getGameData("djerba-adventure")?.id !== game.id && (
              <Link href="/games/djerba-adventure" className="group">
                <div className="relative h-48 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image 
                    src="/game-4.jpg" 
                    alt="Djerba Adventure" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-2 right-2">
                      Île de Djerba
                    </span>
                    <h4 className="text-white font-bold text-lg mb-1 z-10">Djerba Adventure</h4>
                    <p className="text-gray-300 text-sm z-10 text-center">Explorez l'île de Djerba dans cette aventure virtuelle</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              <Link href="/games">Voir Tous les Jeux</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Main page component that receives params
export default function GamePage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <Suspense fallback={<div className="p-12 text-center">Chargement du jeu...</div>}>
      <GameDetailContent id={params.id} />
    </Suspense>
  );
}
