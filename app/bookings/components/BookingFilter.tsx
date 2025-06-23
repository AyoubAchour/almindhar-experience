'use client';

import { Button } from "@/components/ui/button";

interface FilterProps {
  activeStatus: string;
  activeSort: 'asc' | 'desc';
  onStatusChange: (status: string) => void;
  onSortChange: (sort: 'asc' | 'desc') => void;
  bookingCounts: {
    all: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

export function BookingFilter({
  activeStatus,
  activeSort,
  onStatusChange,
  onSortChange,
  bookingCounts
}: FilterProps) {
  const statusFilters = [
    { id: 'all', label: 'Tous', count: bookingCounts.all },
    { id: 'confirmed', label: 'Confirmés', count: bookingCounts.confirmed },
    { id: 'pending', label: 'En attente', count: bookingCounts.pending },
    { id: 'cancelled', label: 'Annulés', count: bookingCounts.cancelled }
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        {statusFilters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeStatus === filter.id ? "default" : "outline"}
            onClick={() => onStatusChange(filter.id)}
            className={`
              relative
              ${activeStatus === filter.id
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'}
            `}
          >
            {filter.label}
            <span className={`
              ml-2 px-2 py-0.5 text-xs rounded-full
              ${activeStatus === filter.id
                ? 'bg-indigo-700 text-white'
                : 'bg-gray-100 text-gray-600'}
            `}>
              {filter.count}
            </span>
          </Button>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-600">Trier par date:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSortChange(activeSort === 'desc' ? 'asc' : 'desc')}
          className="text-gray-700"
        >
          {activeSort === 'desc' ? (
            <span className="flex items-center">
              Plus récent
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          ) : (
            <span className="flex items-center">
              Plus ancien
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
