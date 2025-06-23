"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Game state interface for Tabarka Treasures
export interface GameState {
  status: "ready" | "playing" | "paused" | "gameOver";
  score: number;
  timeRemaining: number;
  collectedItems: string[];
  basketPosition: { x: number; y: number };
  difficulty: "easy" | "medium" | "hard" | null;
}

// Default state
const defaultState: GameState = {
  status: "ready",
  score: 0,
  timeRemaining: 40, //40 seconds game duration
  collectedItems: [],
  basketPosition: { x: 400, y: 600 }, // Center bottom of screen
  difficulty: null,
};

// Context type
interface GameContextType extends GameState {
  setStatus: (status: GameState["status"]) => void;
  setScore: (score: number) => void;
  setTimeRemaining: (time: number) => void;
  setCollectedItems: (items: string[]) => void;
  addCollectedItem: (item: string) => void;
  removeCollectedItem: () => void; // Remove random item when hit by fish
  setBasketPosition: (position: { x: number; y: number }) => void;
  setDifficulty: (difficulty: GameState["difficulty"]) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<GameState["status"]>(defaultState.status);
  const [score, setScore] = useState(defaultState.score);
  const [timeRemaining, setTimeRemaining] = useState(defaultState.timeRemaining);
  const [collectedItems, setCollectedItems] = useState<string[]>(defaultState.collectedItems);
  const [basketPosition, setBasketPosition] = useState(defaultState.basketPosition);
  const [difficulty, setDifficulty] = useState<GameState["difficulty"]>(defaultState.difficulty);

  const addCollectedItem = (item: string) => {
    setCollectedItems(prev => [...prev, item]);
    setScore(prev => prev + 10); // 10 points per item
  };

  const removeCollectedItem = () => {
    setCollectedItems(prev => {
      if (prev.length === 0) return prev;
      // Remove random item
      const randomIndex = Math.floor(Math.random() * prev.length);
      const newItems = [...prev];
      newItems.splice(randomIndex, 1);
      setScore(prev => Math.max(0, prev - 10)); // Lose 10 points
      return newItems;
    });
  };

  const resetGame = () => {
    setStatus("ready");
    setScore(0);
    setTimeRemaining(40);
    setCollectedItems([]);
    setBasketPosition(defaultState.basketPosition);
    // Keep difficulty setting
  };

  return (
    <GameContext.Provider
      value={{
        status,
        score,
        timeRemaining,
        collectedItems,
        basketPosition,
        difficulty,
        setStatus,
        setScore,
        setTimeRemaining,
        setCollectedItems,
        addCollectedItem,
        removeCollectedItem,
        setBasketPosition,
        setDifficulty,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
