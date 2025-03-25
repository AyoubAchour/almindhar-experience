import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceById } from "@/lib/api/experiences";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function ExperienceDetail({ id }: { id: string }) {
  const experience = await getExperienceById(id);

  if (!experience) {
    notFound();
  }

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} heure${hours > 1 ? "s" : ""} ${remainingMinutes} minute${
          remainingMinutes > 1 ? "s" : ""
        }`
      : `${hours} heure${hours > 1 ? "s" : ""}`;
  };

  // Get difficulty label in French
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Facile";
      case "moderate":
        return "Modéré";
      case "challenging":
        return "Difficile";
      default:
        return difficulty;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "challenging":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={experience.image_url}
          alt={experience.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <Link
            href="/experiences"
            className="inline-flex items-center backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-full shadow-sm transition-all duration-300 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Retour aux expériences
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            {experience.title}
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span className="text-white/90">{experience.location}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                experience.difficulty
              )}`}
            >
              {getDifficultyLabel(experience.difficulty)}
            </span>
            <span className="flex items-center text-white/90">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {formatDuration(experience.duration)}
            </span>
            <span className="flex items-center text-white/90">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              {experience.capacity} personnes max.
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Details */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                À propos de cette expérience
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{experience.description}</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ce qui est inclus
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Inclus</h3>
                  <ul className="space-y-2">
                    {experience.features
                      .filter((feature) => feature.type === "included")
                      .map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-700"
                        >
                          <svg
                            className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          {feature.name}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Non inclus</h3>
                  <ul className="space-y-2">
                    {experience.features
                      .filter((feature) => feature.type === "not_included")
                      .map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-700"
                        >
                          <svg
                            className="w-5 h-5 text-red-500 mr-2 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                          {feature.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Available Dates */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dates disponibles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {experience.available_dates.map((date, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      date.available
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="font-medium">
                      {new Date(date.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                    {date.available ? (
                      <div className="text-sm text-green-700">
                        {date.spots_left} places disponibles
                      </div>
                    ) : (
                      <div className="text-sm text-red-700">Complet</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(experience.price)}
                </div>
                <div className="text-sm text-gray-500">par personne</div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-700">Durée</div>
                  <div className="font-medium">
                    {formatDuration(experience.duration)}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-700">Capacité</div>
                  <div className="font-medium">{experience.capacity} personnes</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-700">Difficulté</div>
                  <div
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                      experience.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(experience.difficulty)}
                  </div>
                </div>
              </div>

              <Link
                href={`/experiences/${experience.id}/booking`}
                className="block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg text-center hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300 animated-border-button"
              >
                Réserver maintenant
              </Link>

              {experience.has_game && (
                <div className="mt-6">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <h3 className="font-medium text-indigo-900">
                        Mini-jeu interactif disponible!
                      </h3>
                    </div>
                    <p className="text-sm text-indigo-700 mb-3">
                      Jouez à notre mini-jeu et gagnez des réductions sur cette expérience!
                    </p>
                    <Link
                      href={`/experiences/${experience.id}/game`}
                      className="block w-full py-2 px-3 bg-white text-indigo-600 font-medium rounded-lg text-center border border-indigo-200 hover:bg-indigo-50 transition-colors duration-300 text-sm"
                    >
                      Jouer maintenant
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceDetailPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  return (
    <Suspense fallback={<div className="p-12 text-center">Chargement de l'expérience...</div>}>
      <ExperienceDetail id={params.id} />
    </Suspense>
  );
}
