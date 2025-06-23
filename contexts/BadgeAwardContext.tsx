'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type BadgeAwardData = {
  id: string;
  name: string;
  label: string;
  description: string;
  earned_at: string;
};

interface BadgeAwardContextType {
  showBadgeAward: (badge: BadgeAwardData) => void;
  hideBadgeAward: () => void;
  currentBadge: BadgeAwardData | null;
  isVisible: boolean;
}

const BadgeAwardContext = createContext<BadgeAwardContextType | undefined>(undefined);

export function BadgeAwardProvider({ children }: { children: React.ReactNode }) {
  const [currentBadge, setCurrentBadge] = useState<BadgeAwardData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showBadgeAward = (badge: BadgeAwardData) => {
    console.log('🎖️ BadgeAwardContext: showBadgeAward called with:', badge);
    setCurrentBadge(badge);
    setIsVisible(true);
    console.log('🎖️ BadgeAwardContext: Badge state updated, isVisible set to true');
  };

  const hideBadgeAward = () => {
    setIsVisible(false);
    // Clear the badge data after animation completes
    setTimeout(() => setCurrentBadge(null), 300);
  };

  useEffect(() => {
    // Check for pending badge award in localStorage
    const pendingBadge = window.localStorage.getItem('pendingBadgeAward');
    if (pendingBadge) {
      try {
        const badgeData = JSON.parse(pendingBadge);
        showBadgeAward(badgeData);
        // Clear the pending badge
        window.localStorage.removeItem('pendingBadgeAward');
      } catch (error) {
        console.error('Error parsing pending badge:', error);
      }
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (currentBadge) {
      setIsVisible(true);
    }
  }, [currentBadge]);

  return (
    <BadgeAwardContext.Provider value={{ showBadgeAward, hideBadgeAward, currentBadge, isVisible }}>
      {children}
    </BadgeAwardContext.Provider>
  );
}

export function useBadgeAward() {
  const context = useContext(BadgeAwardContext);
  if (context === undefined) {
    throw new Error('useBadgeAward must be used within a BadgeAwardProvider');
  }
  return context;
}
