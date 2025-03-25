"use client";

import { useState, useEffect } from "react";
import { Experience, AvailableDate } from "@/types";
import { formatPrice } from "@/lib/utils";

interface BookingFormProps {
  experience: Experience;
  gameReward?: {
    hasReward: boolean;
    rewardDiscount?: number;
  };
  onSubmit: (formData: BookingFormData) => void;
  isSubmitting: boolean;
}

export interface BookingFormData {
  experienceId: string;
  bookingDate: string;
  numberOfPeople: number;
  applyDiscount: boolean;
  totalPrice: number;
}

export function BookingForm({
  experience,
  gameReward,
  onSubmit,
  isSubmitting
}: Readonly<BookingFormProps>) {
  // Form state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [applyDiscount, setApplyDiscount] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(experience.price);
  
  // Available dates (only those with spots left)
  const availableDates = experience.available_dates.filter(
    (date) => date.available && date.spots_left > 0
  );

  // Calculate total price whenever relevant inputs change
  useEffect(() => {
    let price = experience.price * numberOfPeople;
    
    // Apply discount if selected and available
    if (applyDiscount && gameReward?.hasReward && gameReward.rewardDiscount) {
      price = price * (1 - gameReward.rewardDiscount / 100);
    }
    
    setTotalPrice(price);
  }, [numberOfPeople, applyDiscount, experience.price, gameReward]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert("Veuillez sélectionner une date");
      return;
    }
    
    onSubmit({
      experienceId: experience.id,
      bookingDate: selectedDate,
      numberOfPeople,
      applyDiscount,
      totalPrice
    });
  };

  // Handle date selection with keyboard support
  const handleDateKeyDown = (e: React.KeyboardEvent, date: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedDate(date);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-1">
          Date de réservation
        </label>
        {availableDates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {availableDates.map((date: AvailableDate) => (
              <button
                key={date.date}
                onClick={() => setSelectedDate(date.date)}
                onKeyDown={(e) => handleDateKeyDown(e, date.date)}
                type="button"
                aria-pressed={selectedDate === date.date}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDate === date.date
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                    : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                }`}
              >
                <div className="font-medium">
                  {new Date(date.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </div>
                <div className="text-sm text-green-700">
                  {date.spots_left} places disponibles
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 mb-4">
            Aucune date disponible pour cette expérience. Veuillez vérifier ultérieurement.
          </div>
        )}
      </div>

      {/* Number of People */}
      <div>
        <label htmlFor="number-of-people" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de personnes
        </label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
            className="p-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
            disabled={numberOfPeople <= 1}
          >
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
                d="M20 12H4"
              ></path>
            </svg>
          </button>
          <div className="px-4 py-2 w-16 text-center border-t border-b border-gray-300">
            {numberOfPeople}
          </div>
          <button
            type="button"
            onClick={() => {
              // Find the selected date to get available spots
              const selectedDateObj = availableDates.find(d => d.date === selectedDate);
              const maxSpots = selectedDateObj?.spots_left ?? experience.capacity;
              
              setNumberOfPeople(Math.min(maxSpots, numberOfPeople + 1));
            }}
            className="p-2 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
            disabled={
              !selectedDate || 
              numberOfPeople >= (availableDates.find(d => d.date === selectedDate)?.spots_left ?? experience.capacity)
            }
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Capacité maximale: {experience.capacity} personnes
        </p>
      </div>

      {/* Game Reward Discount */}
      {gameReward?.hasReward && (
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                ></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">
                Félicitations! Vous avez gagné une réduction de {gameReward.rewardDiscount}%
              </h3>
              <div className="mt-2 flex items-center">
                <input
                  id="apply-discount"
                  name="apply-discount"
                  type="checkbox"
                  checked={applyDiscount}
                  onChange={(e) => setApplyDiscount(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="apply-discount" className="ml-2 block text-sm text-indigo-700">
                  Appliquer cette réduction à ma réservation
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="border-t border-b border-gray-200 py-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-700">Prix de base</div>
          <div className="font-medium">{formatPrice(experience.price)} × {numberOfPeople}</div>
        </div>
        
        {applyDiscount && gameReward?.hasReward && (
          <div className="flex justify-between items-center mb-2 text-indigo-700">
            <div>Réduction ({gameReward.rewardDiscount}%)</div>
            <div>-{formatPrice(experience.price * numberOfPeople * (gameReward.rewardDiscount! / 100))}</div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4 text-lg font-bold">
          <div>Total</div>
          <div>{formatPrice(totalPrice)}</div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!selectedDate || isSubmitting}
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg text-center hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Traitement en cours..." : "Confirmer la réservation"}
      </button>
    </form>
  );
}
