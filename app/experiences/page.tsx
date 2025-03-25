import { getAllExperiences, getUniqueLocations, getPriceRange } from "@/lib/api";
import ClientComponentsWrapper from "@/app/experiences/client-components-wrapper";


export default async function ExperiencesPage() {
  // Fetch data
  const experiences = await getAllExperiences();
  const locations = await getUniqueLocations();
  const priceRange = await getPriceRange();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Blob Decorations */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 -right-[10vw] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-indigo-300 to-blue-300 opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nos Expériences</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl">
            Découvrez nos expériences touristiques authentiques en Tunisie. Des aventures inoubliables vous attendent, des plages paradisiaques aux déserts majestueux.
          </p>
        </div>

        {/* Pass all the data to the client components wrapper */}
        <ClientComponentsWrapper 
          experiences={experiences}
          locations={locations}
          priceRange={priceRange}
        />
      </div>
    </div>
  );
}
