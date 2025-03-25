"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { Experience } from "@/types";
import { ClientExperienceFilter } from "@/components/experiences/experience-filter-client";
import { ClientExperienceSearch } from "@/components/experiences/experience-search-client";
import { ClientExperienceList } from "@/components/experiences/experience-list-client";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterState } from "@/components/experiences/experience-filter";

interface ClientComponentsWrapperProps {
  readonly experiences: Experience[];
  readonly locations: string[];
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
  };
}

export default function ClientComponentsWrapper({
  experiences,
  locations,
  priceRange,
}: ClientComponentsWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for sorting (client-side only)
  const [sortOption, setSortOption] = useState<string>("newest");
  
  // Local state for search query to prevent re-renders
  const [searchQueryState, setSearchQueryState] = useState("");
  
  // Parse search parameters once
  const searchQuery = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  
  // Update local search state when URL changes
  useEffect(() => {
    setSearchQueryState(searchQuery);
  }, [searchQuery]);
  
  // Parse filter parameters once
  const filters: FilterState = useMemo(() => {
    // Check if this is the initial page load with predefined filters
    const hasDefaultFilters = searchParams.has("minPrice") && searchParams.has("maxPrice") && 
                              !searchParams.has("q") && !searchParams.has("difficulty") && 
                              !searchParams.has("location") && !searchParams.has("game");
    
    // If we detect default filters without user interaction, redirect to clean URL
    if (hasDefaultFilters) {
      // Use setTimeout to avoid React hydration issues
      setTimeout(() => {
        router.replace("/experiences", { scroll: false });
      }, 0);
      
      // Return full range while redirect happens
      return {
        difficulty: [],
        priceRange: [priceRange.min, priceRange.max] as [number, number],
        duration: [0, 480] as [number, number],
        location: null,
      };
    }
    
    // Parse difficulty filter
    const difficultyParam = searchParams.get("difficulty");
    const difficulty = difficultyParam ? difficultyParam.split(",") : [];
    
    // Parse price range filter
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minPrice = minPriceParam ? Number(minPriceParam) : priceRange.min;
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : priceRange.max;
    
    // Parse duration filter
    const minDurationParam = searchParams.get("minDuration");
    const maxDurationParam = searchParams.get("maxDuration");
    const minDuration = minDurationParam ? Number(minDurationParam) : 0;
    const maxDuration = maxDurationParam ? Number(maxDurationParam) : 90000000;
    
    // Parse location filter
    const location = searchParams.get("location");
    
    return {
      difficulty,
      priceRange: [minPrice, maxPrice] as [number, number],
      duration: [minDuration, maxDuration] as [number, number],
      location,
    };
  }, [searchParams, priceRange.min, priceRange.max, router]);
  
  // Filter experiences client-side
  const filteredExperiences = useMemo(() => {
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

    // Apply search query - use local state for more responsive filtering
    if (searchQueryState.trim() !== "") {
      const query = searchQueryState.toLowerCase();
      
      // Helper function to normalize text for search (remove accents)
      const normalize = (text: string) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      };
      
      // Normalize the search query
      const normalizedQuery = normalize(query);
      
      result = result.filter(
        (exp) => {
          // Normalize the experience data
          const normalizedTitle = normalize(exp.title);
          const normalizedLocation = normalize(exp.location);
          
          // Split title into words to check if any word starts with the query
          const titleWords = normalizedTitle.split(/\s+/);
          
          // Check if the title starts with the query
          const titleStartsWith = normalizedTitle.startsWith(normalizedQuery);
          
          // Check if any word in the title starts with the query
          const anyTitleWordStartsWith = titleWords.some(word => 
            word.startsWith(normalizedQuery)
          );
          
          // Also check location for places like "Médina de Tunis", "Sidi Bou Said", etc.
          const locationWords = normalizedLocation.split(/\s+/);
          const anyLocationWordStartsWith = locationWords.some(word => 
            word.startsWith(normalizedQuery)
          );
          
          // For specific known experiences in the database
          const knownExperiences = [
            { search: "med", matches: ["médina"] },
            { search: "sid", matches: ["sidi"] },
            { search: "des", matches: ["désert"] },
            { search: "car", matches: ["carthage"] },
            { search: "djer", matches: ["djerba"] },
            { search: "plon", matches: ["plongée"] },
            { search: "tab", matches: ["tabarka"] },
            { search: "tun", matches: ["tunis"] },
            { search: "sah", matches: ["sahara"] },
            { search: "fes", matches: ["festival"] }
          ];
          
          // Check if query matches any known experience keywords
          const matchesKnownExperience = knownExperiences.some(item => {
            if (normalizedQuery.startsWith(item.search)) {
              return item.matches.some(match => 
                normalizedTitle.includes(match) || normalizedLocation.includes(match)
              );
            }
            return false;
          });
          
          return titleStartsWith || 
                 anyTitleWordStartsWith || 
                 anyLocationWordStartsWith || 
                 matchesKnownExperience;
        }
      );
    }

    return result;
  }, [experiences, filters, searchQueryState]);
  
  // Sort filtered experiences
  const sortedAndFilteredExperiences = useMemo(() => {
    return [...filteredExperiences].sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "duration-low":
          return a.duration - b.duration;
        case "duration-high":
          return b.duration - a.duration;
        case "newest":
        default:
          // Assuming newer experiences have higher IDs
          return b.id.localeCompare(a.id);
      }
    });
  }, [filteredExperiences, sortOption]);

  // Handle filter changes with debounce
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());
    
    // Check if the current URL parameters already match the filter state
    let hasChanges = false;
    
    // Update difficulty parameter
    const currentDifficulty = params.get("difficulty");
    const newDifficulty = newFilters.difficulty.length > 0 ? newFilters.difficulty.join(",") : null;
    
    if (currentDifficulty !== newDifficulty) {
      hasChanges = true;
      if (newDifficulty) {
        params.set("difficulty", newDifficulty);
      } else {
        params.delete("difficulty");
      }
    }
    
    // Update price range parameter
    const currentMinPrice = params.get("minPrice");
    const currentMaxPrice = params.get("maxPrice");
    
    if (currentMinPrice !== newFilters.priceRange[0].toString() || 
        currentMaxPrice !== newFilters.priceRange[1].toString()) {
      hasChanges = true;
      params.set("minPrice", newFilters.priceRange[0].toString());
      params.set("maxPrice", newFilters.priceRange[1].toString());
    }
    
    // Update duration parameter
    const currentMinDuration = params.get("minDuration");
    const currentMaxDuration = params.get("maxDuration");
    
    if (currentMinDuration !== newFilters.duration[0].toString() || 
        currentMaxDuration !== newFilters.duration[1].toString()) {
      hasChanges = true;
      params.set("minDuration", newFilters.duration[0].toString());
      params.set("maxDuration", newFilters.duration[1].toString());
    }
    
    // Update location parameter
    const currentLocation = params.get("location");
    const newLocation = newFilters.location;
    
    if (currentLocation !== newLocation) {
      hasChanges = true;
      if (newLocation) {
        params.set("location", newLocation);
      } else {
        params.delete("location");
      }
    }
    
    // Only update the URL if there are actual changes
    if (hasChanges) {
      // Use shallow routing to prevent a full page reload
      router.push(`/experiences?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);
  
  // Handle search query changes directly
  const handleSearchChange = useCallback((query: string) => {
    // Update local state immediately for responsive UI
    setSearchQueryState(query);
  }, []);
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar with filters */}
      <div className="w-full lg:w-1/4">
        <Suspense fallback={<div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>}>
          <ClientExperienceFilter 
            minPrice={priceRange.min} 
            maxPrice={priceRange.max} 
            locations={locations}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </Suspense>
      </div>

      {/* Main content */}
      <div className="w-full lg:w-3/4">
        <Suspense fallback={<div className="h-16 bg-gray-100 rounded-lg animate-pulse mb-6"></div>}>
          <ClientExperienceSearch 
            initialQuery={searchQuery} 
            onSearch={handleSearchChange}
          />
        </Suspense>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">{filteredExperiences.length}</span> expériences trouvées
          </p>
          
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Trier par:
            </label>
            <select
              id="sort"
              className="text-sm border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="newest">Plus récent</option>
              <option value="price-low">Prix (croissant)</option>
              <option value="price-high">Prix (décroissant)</option>
              <option value="duration-low">Durée (courte à longue)</option>
              <option value="duration-high">Durée (longue à courte)</option>
            </select>
          </div>
        </div>

        <Suspense 
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["skel1", "skel2", "skel3", "skel4", "skel5", "skel6"].map((id) => (
                <div key={id} className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          }
        >
          {/* Pass the already filtered and sorted experiences directly */}
          <ClientExperienceList 
            experiences={sortedAndFilteredExperiences} 
            filters={filters}
            searchQuery={searchQueryState}
          />
        </Suspense>
      </div>
    </div>
  );
}
