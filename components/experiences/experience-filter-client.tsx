"use client";

import { ExperienceFilter, FilterState } from "./experience-filter";
import { useRouter, useSearchParams } from "next/navigation";

interface ClientFilterProps {
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly locations: string[];
  readonly initialFilters?: FilterState;
  readonly onFilterChange: (filters: FilterState) => void;
}

export function ClientExperienceFilter({ 
  minPrice, 
  maxPrice, 
  locations,
  initialFilters,
  onFilterChange
}: ClientFilterProps) {
  return (
    <ExperienceFilter
      onFilterChange={onFilterChange}
      minPrice={minPrice}
      maxPrice={maxPrice}
      locations={locations}
      initialFilters={initialFilters}
    />
  );
}
