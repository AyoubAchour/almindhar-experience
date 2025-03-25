"use client";

import { useState, useEffect, useRef } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function ExperienceSearch({ onSearch, initialQuery = "" }: SearchProps) {
  // Simple state for the input value
  const [inputValue, setInputValue] = useState(initialQuery);
  
  // Ref to track if we should skip the effect
  const skipEffect = useRef(true);
  
  // Update input when initialQuery changes (from URL)
  useEffect(() => {
    // Don't update the input if the user is currently typing
    if (document.activeElement?.id === "experience-search-input") {
      return;
    }
    
    setInputValue(initialQuery);
  }, [initialQuery]);
  
  // Handle input changes directly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // We'll let the parent component handle debouncing
    onSearch(newValue);
  };
  
  // Handle clear button
  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        id="experience-search-input"
        type="text"
        className="w-full p-4 pl-12 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Rechercher une expérience..."
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-4"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <svg
            className="w-4 h-4 text-gray-500 hover:text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
