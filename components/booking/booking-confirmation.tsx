"use client";

import Link from "next/link";
import Image from "next/image";
import { Booking } from "@/types";
import { formatPrice } from "@/lib/utils";

interface BookingConfirmationProps {
  booking: Booking;
  experienceTitle: string;
  experienceImage: string;
  experienceLocation: string;
}

export function BookingConfirmation({
  booking,
  experienceTitle,
  experienceImage,
  experienceLocation
}: Readonly<BookingConfirmationProps>) {
  // Function to get status display text
  const getStatusDisplay = (status: string): string => {
    switch (status) {
      case "pending": return "En attente";
      case "confirmed": return "Confirmé";
      case "completed": return "Terminé";
      case "cancelled": return "Annulé";
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <svg
              className="w-6 h-6"
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
          </div>
          <h2 className="text-2xl font-bold">Réservation confirmée!</h2>
        </div>
        <p className="mt-2 opacity-90">
          Votre réservation a été enregistrée avec succès. Un email de confirmation a été envoyé.
        </p>
      </div>

      {/* Booking Details */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Experience Image */}
          <div className="w-full md:w-1/3 relative h-48 md:h-auto rounded-lg overflow-hidden">
            <Image
              src={experienceImage}
              alt={experienceTitle}
              fill
              className="object-cover"
            />
          </div>

          {/* Booking Information */}
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {experienceTitle}
            </h3>
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
              {experienceLocation}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <div className="text-gray-600">Numéro de réservation</div>
                <div className="font-medium text-gray-900">{booking.id.substring(0, 8).toUpperCase()}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <div className="text-gray-600">Date</div>
                <div className="font-medium text-gray-900">
                  {new Date(booking.booking_date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <div className="text-gray-600">Nombre de personnes</div>
                <div className="font-medium text-gray-900">{booking.number_of_people}</div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <div className="text-gray-600">Statut</div>
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {getStatusDisplay(booking.status)}
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <div className="text-gray-600">Total payé</div>
                <div className="font-bold text-gray-900">{formatPrice(booking.total_price)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/profile/bookings"
            className="flex-1 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg text-center transition-colors"
          >
            Voir mes réservations
          </Link>
          <Link
            href="/experiences"
            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center transition-colors"
          >
            Explorer d'autres expériences
          </Link>
        </div>
      </div>
    </div>
  );
}
