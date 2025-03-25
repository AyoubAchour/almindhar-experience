import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ScrollButton from '@/components/scroll-button';  
import { ExperienceCard } from "@/components/experience-card";
import { getFeaturedExperiences } from "@/lib/api";

export default async function Home() {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  // Fetch featured experiences from the database
  const experiences = await getFeaturedExperiences(4);
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {/* Animated Blob Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800">
          {/* Blob 1 */}
          <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-40 blur-3xl animate-blob"></div>
          {/* Blob 2 */}
          <div className="absolute top-[20%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 blur-3xl animate-blob animation-delay-2000"></div>
          {/* Blob 3 */}
          <div className="absolute bottom-[10%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-40 blur-3xl animate-blob animation-delay-4000"></div>
          {/* Blob 4 */}
          <div className="absolute bottom-[20%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-40 blur-3xl animate-blob animation-delay-6000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 md:px-8 w-full">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            IL EST TEMPS D'EXPLORER LA TUNISIE
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mb-10">
            Découvrez les joyaux cachés de la Tunisie à travers des expériences immersives, des jeux interactifs et des aventures inoubliables conçues spécialement pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
              <Link href="/experiences">Explorer les Expériences</Link>
            </Button>
            {!session ? (
              <Button asChild size="lg" className="animated-border-button px-8 py-6 text-lg">
                <Link href="/sign-up">
                  <span className="animated-text font-medium">Rejoindre Maintenant</span>
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                <Link href="/games">Jouer aux Jeux</Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <ScrollButton targetId="features-section" />
      </section>

      {/* Feature Icons Section */}
      <section id="features-section" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Choisir Almindhar Experience</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez ce qui rend notre plateforme unique et comment nous améliorons votre voyage à travers la Tunisie</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Curated Experiences Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Expériences Sélectionnées</h3>
              <p className="text-gray-600 leading-relaxed">
                Des expériences touristiques soigneusement sélectionnées qui mettent en valeur la riche culture, la beauté naturelle et le patrimoine de la Tunisie
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href="/experiences" className="text-indigo-600 font-medium flex items-center group-hover:text-indigo-700 transition-colors">
                  Explorer les expériences
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Interactive Games Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <path d="M17 5H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M5 12h.01"></path>
                  <path d="M19 12h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Jeux Interactifs</h3>
              <p className="text-gray-600 leading-relaxed">
                Participez à des mini-jeux amusants qui améliorent votre expérience touristique et vous permettent de gagner des récompenses exclusives
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href="/games" className="text-purple-600 font-medium flex items-center group-hover:text-purple-700 transition-colors">
                  Découvrir les jeux
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Rewards System Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] border border-gray-100 group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                  <circle cx="12" cy="8" r="6"></circle>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Système de Récompenses</h3>
              <p className="text-gray-600 leading-relaxed">
                Gagnez des points et débloquez des récompenses exclusives en explorant la Tunisie et en participant à des activités
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link href="/rewards" className="text-pink-600 font-medium flex items-center group-hover:text-pink-700 transition-colors">
                  Voir les récompenses
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Experiences Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16 relative">
            <span className="text-sm font-medium tracking-wider text-indigo-600 uppercase mb-2 block">Découvrir la Tunisie</span>
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              Expériences Populaires
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Explorez nos expériences les plus appréciées et découvrez la beauté et la richesse culturelle de la Tunisie
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiences.length > 0 ? (
              experiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500">Aucune expérience disponible pour le moment.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
              <Link href="/experiences">Voir Toutes les Expériences</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Virtual Experience Preview Section - Replacing the old "Divertissement Jeux Interactifs" section */}
      <section className="py-20 px-4 bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 w-full relative overflow-hidden">
        {/* Animated Blob Decorations */}
        <div className="absolute top-[10%] left-[15%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-30 blur-3xl animate-blob"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16 relative">
            <span className="text-sm font-medium tracking-wider text-indigo-300 uppercase mb-2 block">Essayez Avant de Réserver</span>
            <h2 className="text-4xl font-bold mb-4 relative inline-block text-white">
              APERÇU VIRTUEL DE L'EXPÉRIENCE
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mt-6">Découvrez nos expériences touristiques à travers des jeux interactifs, gagnez des récompenses et obtenez des réductions sur vos réservations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-6 text-white">Expérience Virtuelle</h3>
              <p className="mb-8 text-gray-300 text-lg leading-relaxed">
                Nos jeux interactifs sont directement liés à nos expériences touristiques réelles. Ils vous permettent de:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Découvrir virtuellement les expériences avant de réserver</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Gagner des points et débloquer des réductions exclusives</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Apprendre sur la culture et l'histoire tunisiennes</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">Préparer votre voyage avec des informations pratiques</span>
                </li>
              </ul>
              <Button asChild size="lg" className="w-fit mt-8 bg-white/20 hover:bg-white/30 text-white rounded-md px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                <Link href="/experiences?game=true">Découvrir les Expériences avec Jeux</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Desert Rider Game Card */}
              <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Image 
                  src="/game-1.jpg" 
                  alt="Desert Rider" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-indigo-600/80 rounded-full p-3 transform transition-transform duration-300 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                    </div>
                  </div>
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-3 right-3">Désert du Sahara</span>
                  <h4 className="text-white font-bold text-lg mb-1 z-10">Desert Rider</h4>
                  <p className="text-gray-300 text-sm z-10">Simulez une balade à dos de chameau dans le désert tunisien</p>
                </div>
              </div>
              
              {/* Carthage Explorer Game Card */}
              <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Image 
                  src="/game-2.jpg" 
                  alt="Carthage Explorer" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-indigo-600/80 rounded-full p-3 transform transition-transform duration-300 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                    </div>
                  </div>
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-3 right-3">Ruines de Carthage</span>
                  <h4 className="text-white font-bold text-lg mb-1 z-10">Carthage Explorer</h4>
                  <p className="text-gray-300 text-sm z-10">Explorez virtuellement les ruines historiques de Carthage</p>
                </div>
              </div>
              
              {/* Medina Treasure Game Card */}
              <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Image 
                  src="/game-3.jpg" 
                  alt="Medina Treasure" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-indigo-600/80 rounded-full p-3 transform transition-transform duration-300 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                    </div>
                  </div>
                  <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-3 right-3">Médina de Tunis</span>
                  <h4 className="text-white font-bold text-lg mb-1 z-10">Medina Treasure</h4>
                  <p className="text-gray-300 text-sm z-10">Cherchez des trésors cachés dans la médina de Tunis</p>
                </div>
              </div>
              
              {/* Djerba Adventure Game Card */}
              <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Image 
                  src="/game-4.jpg" 
                  alt="Djerba Adventure" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-4">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-indigo-600/80 rounded-full p-3 transform transition-transform duration-300 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                    </div>
                  </div>
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full absolute top-3 right-3">Île de Djerba</span>
                  <h4 className="text-white font-bold text-lg mb-1 z-10">Djerba Adventure</h4>
                  <p className="text-gray-300 text-sm z-10">Explorez l'île de Djerba dans cette aventure virtuelle</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* How It Works Section */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white text-center mb-10">Comment Ça Marche</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2 text-center">Jouez</h4>
                <p className="text-gray-300 text-center">Essayez nos jeux interactifs liés à des expériences touristiques réelles</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2 text-center">Gagnez</h4>
                <p className="text-gray-300 text-center">Accumulez des points et débloquez des récompenses exclusives</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2 text-center">Réservez</h4>
                <p className="text-gray-300 text-center">Utilisez vos récompenses pour obtenir des réductions sur vos réservations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16 relative">
            <span className="text-sm font-medium tracking-wider text-indigo-600 uppercase mb-2 block">Réductions Exclusives</span>
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              SYSTÈME DE RÉCOMPENSES
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">Jouez à nos jeux interactifs, battez les scores maximum et obtenez des codes de réduction pour vos réservations</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full -mt-8 -mr-8 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Comment Obtenir des Réductions</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <span className="text-indigo-600 font-bold text-xl">1</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-gray-800">Explorez les Expériences</h4>
                        <p className="text-gray-600">Parcourez nos expériences touristiques et trouvez celle qui vous intéresse</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <span className="text-indigo-600 font-bold text-xl">2</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-gray-800">Jouez au Jeu Associé</h4>
                        <p className="text-gray-600">Chaque expérience propose un jeu interactif qui vous donne un aperçu virtuel</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <span className="text-indigo-600 font-bold text-xl">3</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-gray-800">Battez le Score Maximum</h4>
                        <p className="text-gray-600">Relevez le défi et dépassez le score requis pour débloquer votre récompense</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <span className="text-indigo-600 font-bold text-xl">4</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-gray-800">Obtenez Votre Code de Réduction</h4>
                        <p className="text-gray-600">Recevez immédiatement un code coupon à utiliser lors de votre réservation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Link href="/experiences">Découvrir les Expériences</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20"></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-600">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800">Coupon de Réduction</h3>
                    <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">EXEMPLE</div>
                  </div>
                  
                  <div className="mb-8 p-4 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Code de Réduction</div>
                      <div className="text-2xl font-mono font-bold text-indigo-700 tracking-wider mb-2">DESERT25</div>
                      <div className="text-xs text-gray-500">Valable pour l'expérience "Désert du Sahara"</div>
                      <div className="mt-3 text-sm font-medium text-green-600">Économisez 25% sur votre réservation!</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Réductions allant de 10% à 30%</span>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Codes uniques pour chaque expérience</span>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Validité de 30 jours après obtention</span>
                    </div>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Cumulable avec certaines offres saisonnières</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 relative w-full overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/cta-bg.jpg" 
            alt="Paysage Tunisien" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            {/* Left column - Text content */}
            <div className="md:w-1/2">
              <span className="text-sm font-medium tracking-wider text-indigo-300 uppercase mb-3 block">Votre Aventure Tunisienne</span>
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Prêt à <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Découvrir la Tunisie</span> ?
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Rejoignez notre plateforme pour découvrir des expériences uniques, jouer à des jeux interactifs et gagner des récompenses en explorant la beauté et la culture de la Tunisie
              </p>
              
              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Expériences Personnalisées</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Jeux Interactifs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Système de Récompenses</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/90">Conseils Locaux</span>
                </div>
              </div>
              
              {!session ? (
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-7 text-lg rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105">
                  <Link href="/sign-up" className="flex items-center gap-2">
                    Commencer Votre Voyage
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-7 text-lg rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105">
                  <Link href="/experiences" className="flex items-center gap-2">
                    Parcourir les Expériences
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </Button>
              )}
            </div>
            
            {/* Right column - Decorative elements */}
            <div className="md:w-1/2 hidden md:block">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full opacity-20"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-white/80 text-xs">almindhar-experience.com</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-8 bg-white/20 rounded-md w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded-md w-full"></div>
                    <div className="h-4 bg-white/20 rounded-md w-5/6"></div>
                    <div className="h-4 bg-white/20 rounded-md w-4/6"></div>
                    <div className="h-12 bg-indigo-600/70 rounded-md w-1/2 mt-6"></div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/20 rounded-md"></div>
                    <div className="h-20 bg-white/20 rounded-md"></div>
                    <div className="h-20 bg-white/20 rounded-md"></div>
                    <div className="h-20 bg-white/20 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          const descContainers = document.querySelectorAll('.h-12.mb-4.overflow-hidden');
          
          descContainers.forEach(container => {
            const paragraph = container.querySelector('p');
            const expandBtn = container.querySelector('.expandBtn');
            
            // Check if content overflows and show expand button if needed
            if (paragraph.scrollHeight > container.clientHeight) {
              expandBtn.classList.remove('hidden');
              
              // Add click event to expand button
              expandBtn.addEventListener('click', function() {
                if (container.classList.contains('h-12')) {
                  // Expand
                  container.classList.remove('h-12');
                  container.classList.add('h-auto');
                  expandBtn.textContent = 'Voir moins';
                  expandBtn.classList.add('bottom-auto');
                  expandBtn.classList.add('mt-1');
                } else {
                  // Collapse
                  container.classList.remove('h-auto');
                  container.classList.add('h-12');
                  expandBtn.textContent = 'Voir plus...';
                  expandBtn.classList.remove('bottom-auto');
                  expandBtn.classList.remove('mt-1');
                }
              });
            }
          });
        });
      `}} />
    </div>
  );
}
