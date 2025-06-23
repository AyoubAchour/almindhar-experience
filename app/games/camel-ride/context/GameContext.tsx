"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Game state interface
export interface GameState {
  status: "ready" | "playing" | "paused" | "gameOver";
  score: number;
  distance: number;
  collisions: number;
  speed: number;
}

// Default state
const defaultState: GameState = {
  status: "ready",
  score: 0,
  distance: 0,
  collisions: 0,
  speed: 0,
};

// Context type
interface GameContextType extends GameState {
  setStatus: (status: GameState["status"]) => void;
  setScore: (score: number) => void;
  setDistance: (distance: number) => void;
  setCollisions: (collisions: number) => void;
  setSpeed: (speed: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<GameState["status"]>(defaultState.status);
  const [score, setScore] = useState(defaultState.score);
  const [distance, setDistance] = useState(defaultState.distance);
  const [collisions, setCollisions] = useState(defaultState.collisions);
  const [speed, setSpeed] = useState(defaultState.speed);

  const resetGame = () => {
    setStatus("ready");
    setScore(0);
    setDistance(0);
    setCollisions(0);
    setSpeed(0);
  };

  return (
    <GameContext.Provider
      value={{
        status,
        score,
        distance,
        collisions,
        speed,
        setStatus,
        setScore,
        setDistance,
        setCollisions,
        setSpeed,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook to use the game context
export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within a GameProvider");
  return ctx;
} 