"use client";

import { ExperienceList } from "./experience-list";
import { Experience } from "@/types";
import { FilterState } from "./experience-filter";

interface ClientExperienceListProps {
  readonly experiences: Experience[];
  readonly filters?: FilterState;
  readonly searchQuery?: string;
}

export function ClientExperienceList({ 
  experiences,
  filters,
  searchQuery = ""
}: ClientExperienceListProps) {
  // Use provided filters or create default filters
  const effectiveFilters: FilterState = filters || {
    difficulty: [],
    priceRange: [0, 1000],
    duration: [0, 480],
    location: null,
  };
  
  return (
    <ExperienceList
      experiences={experiences}
      filters={effectiveFilters}
      searchQuery={searchQuery}
    />
  );
}
