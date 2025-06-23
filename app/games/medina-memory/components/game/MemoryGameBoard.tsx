'use client';

import React, { useEffect, useRef } from "react";
import { useMemoryGameContext } from "../../context/GameContext";
import { GAME_CONFIG, getGameConfig } from "../../assets/cardData";
import MemoryCard from "./MemoryCard";
import GameHUD from "../ui/GameHUD";
import GameStartScreen from "../ui/GameStartScreen";

const MemoryGameBoard: React.FC = () => {
  const {
    status,
    cards,
    timeElapsed,
    setTimeElapsed,
    matchedPairs,
    totalPairs,
    isTimerPaused,
    currentMode,
    setStatus
  } = useMemoryGameContext();

  // Use ref to track current time to avoid dependency issues
  const timeRef = useRef(timeElapsed);
  timeRef.current = timeElapsed;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === "playing" && !isTimerPaused) {
      interval = setInterval(() => {
        const newTime = timeRef.current + 1;
        setTimeElapsed(newTime);

        // Check time limit
        if (currentMode?.difficulty.timeLimit && newTime >= currentMode.difficulty.timeLimit) {
          setStatus("gameLost");
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, isTimerPaused, setTimeElapsed, currentMode, setStatus]);

  // Show start screen when game is ready
  if (status === "ready") {
    return <GameStartScreen />;
  }

  // Get dynamic configuration based on current mode
  const gameConfig = currentMode ? getGameConfig(currentMode) : GAME_CONFIG;

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Game HUD */}
      <GameHUD />

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${gameConfig.GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${gameConfig.GRID_ROWS}, 1fr)`,
            width: `${gameConfig.GRID_COLS * (gameConfig.CARD_WIDTH + gameConfig.CARD_SPACING)}px`,
            height: `${gameConfig.GRID_ROWS * (gameConfig.CARD_HEIGHT + gameConfig.CARD_SPACING)}px`,
          }}
        >
          {cards.map((card, index) => (
            <MemoryCard
              key={`card-${index}`}
              card={card}
              cardIndex={index}
              width={gameConfig.CARD_WIDTH}
              height={gameConfig.CARD_HEIGHT}
            />
          ))}
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="text-center text-sm text-gray-600 mt-4">
        Paires trouvées: {matchedPairs} / {totalPairs}
      </div>
    </div>
  );
};

export default MemoryGameBoard;
