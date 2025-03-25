"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getExperienceById } from "@/lib/api/client-experiences";
import { getGameScores } from "@/lib/api/client-games";
import { createBooking } from "@/lib/api/client-bookings";
import { BookingForm, BookingFormData } from "@/components/booking/booking-form";
import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { Experience, Booking } from "@/types";
import { formatPrice, formatDuration } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

// For client components, we can use a wrapper component pattern
export default function BookingPageWrapper({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  
  useEffect(() => {
    async function resolveParams() {
      try {
        const resolvedParams = await params;
        setResolvedId(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    }
    
    resolveParams();
  }, [params]);
  
  if (!resolvedId) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return <BookingPageContent id={resolvedId} />;
}

// The actual component with all the logic
function BookingPageContent({ id }: Readonly<{ id: string }>) {
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [gameReward, setGameReward] = useState<{ hasReward: boolean; rewardDiscount?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push(`/sign-in?redirect=/experiences/${id}/booking`);
        return;
      }
      
      setUser(user);
      
      try {
        const experienceData = await getExperienceById(id);
        if (!experienceData) {
          setError("L'expérience demandée n'a pas été trouvée.");
          setIsLoading(false);
          return;
        }
        
        setExperience(experienceData);
        
        if (experienceData.has_game) {
          const gameScores = await getGameScores(id);
          setGameReward({
            hasReward: gameScores.hasReward,
            rewardDiscount: gameScores.rewardDiscount
          });
        }
      } catch (err) {
        console.error("Error fetching experience data:", err);
        setError("Une erreur s'est produite lors du chargement des données. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    }
    
    initialize();
  }, [router, id]);

  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!user || !experience) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const bookingData = {
        user_id: user.id,
        experience_id: experience.id,
        booking_date: new Date(formData.bookingDate).toISOString(),
        number_of_people: formData.numberOfPeople,
        status: 'confirmed' as Booking['status'],
        total_price: formData.totalPrice,
      };
      
      const result = await createBooking(bookingData);
      
      if (!result.success) {
        throw new Error(result.error || "Échec de la création de la réservation");
      }
      
      setBooking(result.booking!);
      setStep('confirmation');
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Une erreur s'est produite lors de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Erreur</h3>
              <p className="mt-1 text-sm text-gray-500">{error || "L'expérience n'a pas été trouvée."}</p>
              <div className="mt-6">
                <Link
                  href="/experiences"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retour aux expériences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/experiences/${experience.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
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
            Retour aux détails
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {booking ? "Réservation confirmée" : "Réserver votre expérience"}
          </h1>
          <p className="mt-2 text-gray-600">
            {booking
              ? "Votre réservation a été enregistrée avec succès."
              : "Choisissez une date et le nombre de personnes pour finaliser votre réservation."}
          </p>
        </div>

        {step === 'confirmation' && booking ? (
          <BookingConfirmation
            booking={booking}
            experienceTitle={experience.title}
            experienceImage={experience.image_url}
            experienceLocation={experience.location}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
                <div className="relative h-48">
                  <Image
                    src={experience.image_url}
                    alt={experience.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {experience.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-4">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    {experience.location}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-medium">{formatPrice(experience.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium">{formatDuration(experience.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulté</span>
                      <span className="font-medium capitalize">{experience.difficulty}</span>
                    </div>
                  </div>

                  {experience.has_game && !gameReward?.hasReward && (
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                      <div className="flex items-center gap-2 text-indigo-700 text-sm">
                        <svg
                          className="w-5 h-5"
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
                        <span>
                          Jouez à notre mini-jeu et gagnez des réductions sur cette expérience!
                        </span>
                      </div>
                      <Link
                        href={`/experiences/${experience.id}/game`}
                        className="mt-2 block w-full py-2 px-3 bg-white text-indigo-600 font-medium rounded-lg text-center border border-indigo-200 hover:bg-indigo-50 transition-colors duration-300 text-sm"
                      >
                        Jouer maintenant
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <BookingForm
                  experience={experience}
                  gameReward={gameReward || undefined}
                  onSubmit={handleBookingSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
