'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Experience {
  id: string;
  title: string;
  image_url?: string;
  location: string;
}

export interface BookingWithExperience {
  id: string;
  booking_date: string;
  number_of_people: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  payment_status: string;
  total_price: number;
  experiences: Experience[];
}

export function BookingCard({ booking }: { booking: BookingWithExperience }) {
  const experience = booking.experiences[0];
  const bookingDate = new Date(booking.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Status styles configuration
  const statusConfig = {
    confirmed: {
      class: "bg-green-100 text-green-800",
      text: "Confirmé"
    },
    pending: {
      class: "bg-yellow-100 text-yellow-800",
      text: "En attente"
    },
    cancelled: {
      class: "bg-red-100 text-red-800",
      text: "Annulé"
    }
  };

  const status = statusConfig[booking.status] || {
    class: "bg-gray-100 text-gray-800",
    text: booking.status
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Experience Image */}
      <div className="relative h-48">
        {experience?.image_url ? (
          <img
            src={experience.image_url}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Image non disponible</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.class}`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {experience?.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            {formattedDate}
          </div>
          <div className="flex items-center">
            <span className="mr-2">👥</span>
            {booking.number_of_people} personne{booking.number_of_people > 1 ? 's' : ''}
          </div>
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            {experience?.location}
          </div>
          {booking.total_price && (
            <div className="flex items-center font-medium text-gray-900">
              <span className="mr-2">💰</span>
              {booking.total_price} DT
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Link href={`/experiences/${experience?.id}`}>
            <Button variant="outline" size="sm">
              Voir l'expérience
            </Button>
          </Link>
          {booking.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Annuler
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
