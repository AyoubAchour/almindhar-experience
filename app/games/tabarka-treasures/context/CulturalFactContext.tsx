"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

// Cultural fact modal state interface
export interface CulturalFactState {
  isOpen: boolean;
  treasureType: string;
  fact: string;
}

// Default state
const defaultState: CulturalFactState = {
  isOpen: false,
  treasureType: "",
  fact: "",
};

// Context type
interface CulturalFactContextType extends CulturalFactState {
  showCulturalFact: (treasureType: string, fact: string) => void;
  hideCulturalFact: () => void;
}

const CulturalFactContext = createContext<CulturalFactContextType | undefined>(undefined);

export const CulturalFactProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(defaultState.isOpen);
  const [treasureType, setTreasureType] = useState(defaultState.treasureType);
  const [fact, setFact] = useState(defaultState.fact);

  const showCulturalFact = useCallback((treasureType: string, fact: string) => {
    setTreasureType(treasureType);
    setFact(fact);
    setIsOpen(true);
  }, []);

  const hideCulturalFact = useCallback(() => {
    setIsOpen(false);
    // Clear data after a short delay to allow for exit animations
    setTimeout(() => {
      setTreasureType("");
      setFact("");
    }, 300);
  }, []);

  // Listen for window events from Phaser game
  useEffect(() => {
    const handleShowCulturalFact = (event: CustomEvent) => {
      try {
        const { treasureType, fact } = event.detail;
        if (treasureType && fact) {
          showCulturalFact(treasureType, fact);
        }
      } catch (error) {
        console.error('Error handling showReactCulturalFact event:', error);
      }
    };

    const handleHideCulturalFact = () => {
      try {
        hideCulturalFact();
      } catch (error) {
        console.error('Error handling hideReactCulturalFact event:', error);
      }
    };

    window.addEventListener('showReactCulturalFact', handleShowCulturalFact as EventListener);
    window.addEventListener('hideReactCulturalFact', handleHideCulturalFact);

    return () => {
      window.removeEventListener('showReactCulturalFact', handleShowCulturalFact as EventListener);
      window.removeEventListener('hideReactCulturalFact', handleHideCulturalFact);
    };
  }, [showCulturalFact, hideCulturalFact]);

  return (
    <CulturalFactContext.Provider
      value={{
        isOpen,
        treasureType,
        fact,
        showCulturalFact,
        hideCulturalFact,
      }}
    >
      {children}
    </CulturalFactContext.Provider>
  );
};

export const useCulturalFact = () => {
  const context = useContext(CulturalFactContext);
  if (context === undefined) {
    throw new Error("useCulturalFact must be used within a CulturalFactProvider");
  }
  return context;
};
