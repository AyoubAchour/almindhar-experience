import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook that debounces a value.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  // Use a ref to track the latest value and timeout
  const latestValue = useRef<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update the ref with the latest value
    latestValue.current = value;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a timeout to update the debounced value after the specified delay
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(latestValue.current);
    }, delay);

    // Clean up the timeout when the component unmounts or when the value/delay changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  // If the component is unmounting, immediately update to the latest value
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setDebouncedValue(latestValue.current);
      }
    };
  }, []);

  return debouncedValue;
}
