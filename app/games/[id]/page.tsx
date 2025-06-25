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
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  // Get game data based on ID
  const resolvedParams = await params;
  const gameData = getGameData(resolvedParams.id);

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


//My games Data : 
const games = [
  {
    id: "desert-rider",
    title: "Desert Rider",
    description: "Simulez une balade à dos de chameau dans le désert tunisien",
    longDescription: "Desert Rider vous permet de vivre l'expérience unique d'une balade à dos de chameau à travers les magnifiques dunes du désert tunisien. Naviguez à travers le paysage, évitez les obstacles, et découvrez des points d'intérêt culturels tout en apprenant sur l'histoire et les traditions du désert du Sahara.",
    image: "https://jogxouotwtbjhoioyofa.supabase.co/storage/v1/object/public/experiences//sahara-desert.jpg",
    experienceTag: "Désert du Sahara",
    gameTag: "camel-ride",
    tagColor: "bg-orange-500",
    scoreThreshold: 100,
    discount: 5,
    howToPlay: [
      "Utilisez les flèches du clavier pour diriger votre chameau",
      "Évitez les obstacles et collectez des points d'eau",
      "Découvrez des points d'intérêt culturels pour gagner des points bonus",
      "Atteignez la fin du parcours dans le temps imparti"
    ],
    isImplemented: true,
  },
  {
    id: "carthage-explorer",
    title: "Carthage Explorer",
    description: "Explorez virtuellement les ruines historiques de Carthage",
    longDescription: "Carthage Explorer vous invite à découvrir les ruines historiques de l'ancienne cité de Carthage. Explorez les différents sites archéologiques, résolvez des énigmes basées sur l'histoire carthaginoise, et apprenez sur cette civilisation fascinante qui a marqué l'histoire de la Tunisie et de la Méditerranée.",
    image: "",
    experienceTag: "Ruines de Carthage",
    tagColor: "bg-green-500",
    scoreThreshold: 80,
    discount: 10,
    howToPlay: [
      "Cliquez sur les différents sites pour les explorer",
      "Résolvez les énigmes historiques pour débloquer de nouveaux sites",
      "Collectez des artefacts pour gagner des points",
      "Complétez la visite virtuelle pour terminer le jeu"
    ],
    isImplemented: false,
  },
  {
    id: "medina-treasure",
    title: "Medina Treasure",
    description: "Cherchez des trésors cachés dans la médina de Tunis",
    longDescription: "Medina Treasure vous emmène dans une chasse au trésor passionnante à travers les ruelles labyrinthiques de la médina de Tunis. Découvrez l'artisanat local, les monuments historiques et les spécialités culinaires tout en cherchant des indices qui vous mèneront au trésor caché. Une façon ludique de découvrir le cœur historique de la capitale tunisienne.",
    image: "https://jogxouotwtbjhoioyofa.supabase.co/storage/v1/object/public/experiences//tunis-medina.jpg",
    experienceTag: "Médina de Tunis",
    gameTag: "medina-memory",
    tagColor: "bg-indigo-500",
    scoreThreshold: 70,
    discount: 15,
    isImplemented: true,
    howToPlay: [
      "Naviguez dans la médina en utilisant la carte interactive",
      "Interagissez avec les commerçants et habitants virtuels pour obtenir des indices",
      "Résolvez les énigmes culturelles pour avancer dans votre quête",
      "Trouvez le trésor caché avant la fin du temps imparti"
    ],
  },

  {
    id: "tabarka-treasures",
    title: "Tabarka Treasures",
    description: "Plongez dans les eaux de Tabarka et collectez des trésors marins",
    longDescription: "Tabarka Treasures vous emmène dans une aventure sous-marine captivante au large des côtes de Tabarka. Contrôlez votre panier de plongée pour collecter des trésors marins tout en évitant les obstacles. Découvrez la richesse des fonds marins tunisiens et apprenez sur la tradition de plongée corallienne de Tabarka.",
    image: "https://jogxouotwtbjhoioyofa.supabase.co/storage/v1/object/public/experiences/tabarka-diving.jpg",
    experienceTag: "Plongée à Tabarka",
    gameTag: "tabarka-treasures",
    tagColor: "bg-blue-500",
    scoreThreshold: 150,
    discount: 15,
    howToPlay: [
      "Utilisez les flèches ou WASD pour déplacer votre panier",
      "Collectez les trésors qui tombent du haut",
      "Évitez les poissons qui peuvent faire tomber vos trésors",
      "Atteignez le score requis avant la fin du temps"
    ],
    isImplemented: true,
  }
];

// Helper function to get game data - will be replaced with actual database queries
function getGameData(id: string) {
  return games.find(game => game.id === id);
}

// Async component to handle data fetching
async function GameDetailContent({ id }: Readonly<{ id: string }>) {
  const supabase = await createClient();

  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();

  // Get game data based on ID
  const game = getGameData(id);

  // If game not found, return 404
  if (!game) {
    notFound();
  }


  // 1. Fetch the experience UUID from the experiences table
  let experienceId: string | null = null;

  if (game && game.experienceTag) {
    const { data: experienceData } = await supabase
      .from('experiences')
      .select('id')
      .eq('title', game.experienceTag)
      .single();

    if (experienceData && experienceData.id) experienceId = experienceData.id;
  }

  // 2. Fetch the user's high score for this experience
  let highScore: number | null = null;

  if (session && session.user && experienceId) {
    const { data } = await supabase
      .from('game_scores')
      .select('score')
      .eq('user_id', session.user.id)
      .eq('experience_id', experienceId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (data && data.score) highScore = data.score;
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
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
            {game.experienceTag}
          </h1>
          <p className="text-xl text-center max-w-3xl mb-6">
            {game.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {game.isImplemented && experienceId && (
              <Link href={experienceId ? `/experiences/${experienceId}/game/${game.gameTag}?` : '#'}>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
                  Jouer Maintenant
                </Button>
              </Link>
            )}
            <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent px-8 py-6 text-lg">
              <Link href={experienceId ? `/experiences/${experienceId}` : '#'}>Voir l'Expérience</Link>
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
                          {highScore === null ? (
                            <span className="font-medium text-gray-400 italic">Vous n'avez pas encore joué à ce jeu</span>
                          ) : (
                            <span className="font-medium">{highScore} points</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <Link href={experienceId ? `/experiences/${experienceId}/game/${game.gameTag}?` : '#'}>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg mb-4">
                  Jouer Maintenant
                </Button>
              </Link>

              <Button asChild variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 text-lg">
                <Link href={experienceId ? `/experiences/${experienceId}` : '#'}>
                  Voir l'Expérience Associée
                </Link>
              </Button>
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
            {games
              .filter((g) => g.id !== game.id)
              .map((g) => (
                <Link
                  key={g.id}
                  href={`/games/${g.id}`}
                  className="group"
                  tabIndex={g.isImplemented ? 0 : -1}
                  aria-disabled={!g.isImplemented}
                >
                  <div className={`relative h-48 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 ${!g.isImplemented ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {g.image && (
                      <Image
                        src={g.image}
                        alt={g.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    {/* Overlay for non-implemented games */}
                    {!g.isImplemented && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
                        <span className="text-white text-2xl font-bold text-center">Bientôt Disponible</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                      <span className={`${g.tagColor} text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-2 right-2`}>
                        {g.experienceTag}
                      </span>
                      <h4 className="text-white font-bold text-lg mb-1 z-10">{g.title}</h4>
                      <p className="text-gray-300 text-sm z-10 text-center">{g.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
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
export default async function GamePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="p-12 text-center">Chargement du jeu...</div>}>
      <GameDetailContent id={resolvedParams.id} />
    </Suspense>
  );
}
