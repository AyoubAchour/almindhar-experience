"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ExperienceSearch } from "./experience-search";
import { useCallback, useEffect, useRef, useState } from "react";

interface ClientExperienceSearchProps {
  readonly initialQuery?: string;
  readonly onSearch?: (query: string) => void;
}

export function ClientExperienceSearch({ 
  initialQuery = "", 
  onSearch 
}: ClientExperienceSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for the current search query
  const [currentQuery, setCurrentQuery] = useState(() => {
    // Initialize from URL on mount
    return searchParams.get("q") ?? initialQuery;
  });
  
  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle URL updates (separate from input changes)
  const updateURL = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const urlQuery = params.get("q") ?? "";
    
    // Only update if different
    if (urlQuery === query) return;
    
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    
    // Use shallow routing to prevent full page reload
    router.push(`/experiences?${params.toString()}`, { scroll: false });
    
    // Call the optional onSearch prop if provided
    if (onSearch) {
      onSearch(query);
    }
  }, [router, searchParams, onSearch]);
  
  // Handle immediate search input changes
  const handleSearchInput = useCallback((query: string) => {
    // Update local state immediately for responsive UI
    setCurrentQuery(query);
    
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the URL update and search
    debounceTimerRef.current = setTimeout(() => {
      updateURL(query);
    }, 500); // Longer debounce time for better performance
  }, [updateURL]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Update from URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";
    if (urlQuery !== currentQuery) {
      setCurrentQuery(urlQuery);
    }
  }, [searchParams, currentQuery]);
  
  return (
    <ExperienceSearch 
      onSearch={handleSearchInput} 
      initialQuery={currentQuery} 
    />
  );
}
