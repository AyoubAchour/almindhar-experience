"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
  locations: string[];
  initialFilters?: FilterState;
}

export interface FilterState {
  difficulty: string[];
  priceRange: [number, number];
  duration: [number, number];
  location: string | null;
}

export function ExperienceFilter({ 
  onFilterChange, 
  minPrice = 0, 
  maxPrice = 500,
  locations = [],
  initialFilters
}: FilterProps) {
  // Add a ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  
  // Initialize filter state from initialFilters prop or defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    if (initialFilters) {
      return initialFilters;
    }
    
    // Default state if no initialFilters provided
    return {
      difficulty: [],
      priceRange: [minPrice, maxPrice],
      duration: [0, 480],
      location: null,
    };
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Synchronize filters with props when they change
  useEffect(() => {
    // Skip during initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Update internal state based on props without triggering onFilterChange
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  // Handle difficulty filter changes
  const handleDifficultyChange = (difficulty: string) => {
    setFilters((prev) => {
      const newDifficulty = prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter((d) => d !== difficulty)
        : [...prev.difficulty, difficulty];
      
      return {
        ...prev,
        difficulty: newDifficulty,
      };
    });
  };

  // Handle price range changes
  const handlePriceChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [values[0], values[1]] as [number, number],
    }));
  };

  // Handle duration changes
  const handleDurationChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      duration: [values[0], values[1]] as [number, number],
    }));
  };

  // Handle location changes
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = e.target.value === "" ? null : e.target.value;
    setFilters((prev) => ({
      ...prev,
      location,
    }));
  };

  // Notify parent component when filters change, but skip the initial render and URL-triggered updates
  useEffect(() => {
    // Skip if this is the initial mount (already handled)
    if (isInitialMount.current) {
      return;
    }
    
    // Only call onFilterChange for user-initiated changes
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Filtres</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          {isExpanded ? "Réduire" : "Voir tous les filtres"}
        </button>
      </div>

      {/* Difficulty filter - always visible */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Difficulté</h4>
        <div className="flex flex-wrap gap-2">
          {["easy", "moderate", "challenging"].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyChange(difficulty)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.difficulty.includes(difficulty)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {difficulty === "easy" && "Facile"}
              {difficulty === "moderate" && "Modéré"}
              {difficulty === "challenging" && "Difficile"}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded filters */}
      <div
        className={`space-y-6 overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Price range filter */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Prix ({filters.priceRange[0]} - {filters.priceRange[1]} DT)
          </h4>
          <Slider
            defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
            min={minPrice}
            max={maxPrice}
            step={10}
            onValueChange={handlePriceChange}
            className="my-4"
          />
        </div>

        {/* Duration filter */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Durée ({formatDuration(filters.duration[0])} - {formatDuration(filters.duration[1])})
          </h4>
          <Slider
            defaultValue={[filters.duration[0], filters.duration[1]]}
            min={0}
            max={480}
            step={30}
            onValueChange={handleDurationChange}
            className="my-4"
          />
        </div>

        {/* Location filter */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Lieu</h4>
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.location || ""}
            onChange={handleLocationChange}
          >
            <option value="">Tous les lieux</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset filters button */}
      <button
        onClick={() =>
          setFilters({
            difficulty: [],
            priceRange: [minPrice, maxPrice],
            duration: [0, 480],
            location: null,
          })
        }
        className="mt-6 w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
