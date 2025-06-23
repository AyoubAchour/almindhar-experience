import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price in Tunisian Dinars
 * @param price - The price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format duration from minutes to hours and minutes
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // Format hours with plural if needed
  const hoursText = `${hours} heure${hours > 1 ? "s" : ""}`;
  
  // If there are remaining minutes, add them to the output
  if (remainingMinutes > 0) {
    const minutesText = `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    return `${hoursText} ${minutesText}`;
  }
  
  return hoursText;
}
