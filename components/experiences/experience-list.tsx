"use client";

import { useState, useEffect } from "react";
import { ExperienceCard } from "@/components/experience-card";
import { FilterState } from "./experience-filter";
import { Experience } from "@/types";

interface ExperienceListProps {
  experiences: Experience[];
  filters: FilterState;
  searchQuery: string;
}

export function ExperienceList({
  experiences,
  filters,
  searchQuery,
}: ExperienceListProps) {
  const ITEMS_PER_PAGE = 10;
  
  // State for filtered experiences based on search and filters
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>(experiences);
  
  // State for currently visible experiences (subset of filtered)
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate visible experiences based on current page
  const visibleExperiences = filteredExperiences.slice(0, currentPage * ITEMS_PER_PAGE);
  
  // Boolean to check if there are more experiences to load
  const hasMoreToLoad = visibleExperiences.length < filteredExperiences.length;

  // Apply filters and search query
  useEffect(() => {
    let result = [...experiences];

    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      result = result.filter((exp) =>
        filters.difficulty.includes(exp.difficulty)
      );
    }

    // Apply price range filter
    result = result.filter(
      (exp) =>
        exp.price >= filters.priceRange[0] &&
        exp.price <= filters.priceRange[1]
    );

    // Apply duration filter
    result = result.filter(
      (exp) =>
        exp.duration >= filters.duration[0] &&
        exp.duration <= filters.duration[1]
    );

    // Apply location filter
    if (filters.location) {
      result = result.filter((exp) => exp.location === filters.location);
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(query) ||
          exp.description.toLowerCase().includes(query) ||
          exp.location.toLowerCase().includes(query)
      );
    }

    // Update filtered experiences and reset to page 1
    setFilteredExperiences(result);
    setCurrentPage(1);
  }, [experiences, filters, searchQuery]);

  // Handle load more button click
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // If no experiences match the filters
  if (filteredExperiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Aucune expérience trouvée
        </h3>
        <p className="text-gray-500 max-w-md">
          Aucune expérience ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres ou de rechercher autre chose.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleExperiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
      
      {/* Load More Button - only shown if there are more experiences to load */}
      {hasMoreToLoad && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Voir plus d'expériences</span>
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
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
