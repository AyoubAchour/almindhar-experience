'use client';

import { useState } from 'react';
import { BookingFilter } from './BookingFilter';
import { BookingCard, BookingWithExperience } from './BookingCard';

interface BookingsListProps {
  bookings: BookingWithExperience[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeSort, setActiveSort] = useState<'asc' | 'desc'>('desc');

  // Calculate booking counts for filter badges
  const bookingCounts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  // Filter bookings based on active status
  const filteredBookings = bookings.filter(booking => {
    if (activeStatus === 'all') return true;
    return booking.status === activeStatus;
  });

  // Sort bookings by date
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.booking_date).getTime();
    const dateB = new Date(b.booking_date).getTime();
    return activeSort === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div>
      {/* Filters Section */}
      <BookingFilter
        activeStatus={activeStatus}
        activeSort={activeSort}
        onStatusChange={setActiveStatus}
        onSortChange={setActiveSort}
        bookingCounts={bookingCounts}
      />

      {/* Bookings Grid */}
      {sortedBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune réservation trouvée
          </h3>
          <p className="text-gray-600">
            {activeStatus === 'all'
              ? "Vous n'avez pas encore de réservations."
              : `Aucune réservation avec le statut "${
                  activeStatus === 'confirmed' ? 'confirmé' :
                  activeStatus === 'pending' ? 'en attente' :
                  'annulé'
                }".`
            }
          </p>
        </div>
      )}
    </div>
  );
}
