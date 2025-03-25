"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Experience } from "@/types";

interface ExperienceCardProps {
  experience: Experience;
}

/**
 * ExperienceCard component for displaying experience information in a card format
 * Features:
 * - Responsive design with hover effects
 * - Expandable description for longer text
 * - Difficulty badge with color coding
 * - Price and duration formatting
 */
export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Helper function to determine badge color and text based on difficulty
   */
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return {
          color: "bg-green-500",
          text: "Facile"
        };
      case "moderate":
        return {
          color: "bg-orange-500",
          text: "Modéré"
        };
      case "challenging":
        return {
          color: "bg-red-500",
          text: "Difficile"
        };
      default:
        return {
          color: "bg-indigo-600",
          text: "Standard"
        };
    }
  };

  const difficultyBadge = getDifficultyBadge(experience.difficulty);

  /**
   * Format price to show with 2 decimal places if needed
   */
  const formattedPrice =
    experience.price % 1 === 0 ? experience.price : experience.price.toFixed(2);

  /**
   * Format duration from minutes to hours and minutes
   */
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative h-64 overflow-hidden">
        {/* Image overlay gradient for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>

        {/* Experience image with zoom effect on hover */}
        <Image
          src={experience.image_url}
          alt={experience.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Difficulty badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`${difficultyBadge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
          >
            {difficultyBadge.text}
          </span>
        </div>

        {/* Game badge if applicable */}
        {experience.has_game && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Jeu Interactif
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Location */}
        <div className="flex items-center mb-2 text-gray-500 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {experience.location}
        </div>

        {/* Experience title */}
        <h3 className="font-bold text-xl mb-2 group-hover:text-indigo-600 transition-colors">
          {experience.title}
        </h3>

        {/* Expandable description */}
        <div className="relative mb-4">
          {/* Use max-height instead of height for smoother transitions */}
          <div 
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: isExpanded ? '1000px' : '3rem' }}
          >
            <p className="text-gray-600 text-sm">{experience.description}</p>
          </div>
          
          {experience.description.length > 100 && (
            <div className="text-right mt-1">
              <button
                className="text-indigo-600 text-xs font-medium hover:text-indigo-800 bg-white px-2 py-0.5 rounded-md border border-indigo-200 shadow-sm hover:bg-indigo-50 transition-all inline-block"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Voir moins" : "Voir plus..."}
              </button>
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="flex items-center mb-3 text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatDuration(experience.duration)}
        </div>

        {/* Price and details button */}
        <div className="flex justify-between items-center">
          <span className="text-indigo-600 font-bold text-lg">
            {formattedPrice} DT{" "}
            <span className="text-gray-500 text-sm font-normal">
              / personne
            </span>
          </span>
          <Link
            href={`/experiences/${experience.id}`}
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 px-4 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Voir Détails
          </Link>
        </div>
      </div>
    </div>
  );
}
