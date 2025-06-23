'use client';

import React, { useEffect, useState } from "react";
import { MemoryGameProvider, useMemoryGameContext } from "../context/GameContext";
import { useGameScore } from "@/lib/hooks/useGameScore";
import { useGameBadges } from "@/lib/hooks/useGameBadges";
import { generateCardDeck } from "../assets/cardData";
import GameEndModal from "./ui/GameEndModal";
import CulturalInfoModal from "./ui/CulturalInfoModal";
import ModeSelectionScreen from "./ui/ModeSelectionScreen";
import GamePreviewPhase from "./game/GamePreviewPhase";
import MemoryGameBoard from "./game/MemoryGameBoard";
import GameStartScreen from "./ui/GameStartScreen";

interface MedinaMemoryGameProps {
  experienceId: string;
}

function useGameEnd(experienceId: string) {
  const { status, score, timeElapsed, attempts, totalPairs, restartCurrentMode, setStatus } = useMemoryGameContext();
  const { submitScore, awardedReward } = useGameScore(experienceId);
  const { checkAndAwardBadges } = useGameBadges();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (status === "gameOver" || status === "gameLost") {
      // First submit the score
      submitScore(score).then(() => {
        // Then check and award badges with memory game data
        return checkAndAwardBadges({
          experienceId,
          score,
          timeElapsed,
          attempts,
          totalPairs,
          completed: status === "gameOver" // Only completed if gameOver (not gameLost)
        });
      }).then(() => {
        // Finally show the modal
        setModalVisible(true);
      }).catch((error) => {
        console.error('Error in memory game end flow:', error);
        // Still show modal even if badge checking fails
        setModalVisible(true);
      });
    } else {
      setModalVisible(false);
    }
  }, [status, score, timeElapsed, attempts, totalPairs, submitScore, checkAndAwardBadges, experienceId]);

  const handleRestart = () => {
    setModalVisible(false);
    restartCurrentMode(); // This will restart the same mode directly
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleModeSelection = () => {
    setModalVisible(false);
    setStatus("modeSelection");
  };

  return { modalVisible, handleRestart, handleBack, handleModeSelection, awardedReward };
}

// Helper component to use context hooks inside provider
function GameEndModalWrapper({ experienceId }: { experienceId: string }) {
  const { modalVisible, handleRestart, handleBack, handleModeSelection, awardedReward } = useGameEnd(experienceId);
  return (
    <GameEndModal
      visible={modalVisible}
      onRestart={handleRestart}
      onBack={handleBack}
      onModeSelection={handleModeSelection}
      awardedReward={awardedReward || undefined}
    />
  );
}

// Cultural Info Modal Wrapper
function CulturalInfoModalWrapper() {
  const { showCulturalInfo, currentCulturalCard, closeCulturalInfo } = useMemoryGameContext();
  return (
    <CulturalInfoModal
      isVisible={showCulturalInfo}
      cardItem={currentCulturalCard}
      onClose={closeCulturalInfo}
    />
  );
}

// Mode Selection Wrapper
function ModeSelectionWrapper() {
  const { selectMode, completedModes } = useMemoryGameContext();

  const handleModeSelect = (mode: any) => {
    selectMode(mode);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <ModeSelectionScreen
      onModeSelect={handleModeSelect}
      onBack={handleBack}
      completedModes={completedModes}
    />
  );
}

// Game Preview Wrapper
function GamePreviewWrapper() {
  const { cards, currentMode, startGame } = useMemoryGameContext();

  if (!currentMode) return null;

  return (
    <GamePreviewPhase
      cards={cards}
      mode={currentMode}
      onPreviewComplete={startGame}
    />
  );
}

// Game initialization component
function GameInitializer() {
  const { setCards, currentMode } = useMemoryGameContext();

  useEffect(() => {
    // Initialize the card deck when mode is selected
    if (currentMode) {
      const deck = generateCardDeck(currentMode);
      setCards(deck);
    }
  }, [currentMode, setCards]);

  return null; // This component doesn't render anything
}

// Game State Renderer - handles different game phases
function GameStateRenderer() {
  const { status } = useMemoryGameContext();

  switch (status) {
    case 'ready':
      return <GameStartScreen />;
    case 'modeSelection':
      return <ModeSelectionWrapper />;
    case 'preview':
      return <GamePreviewWrapper />;
    case 'playing':
    case 'paused':
    case 'gameOver':
    case 'gameLost':
      return <MemoryGameBoard />;
    default:
      return <GameStartScreen />;
  }
}

const MedinaMemoryGame: React.FC<MedinaMemoryGameProps> = ({ experienceId }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (document.readyState === "complete") {
      timeout = setTimeout(() => setReady(true), 1000);
    } else {
      const onLoad = () => {
        timeout = setTimeout(() => setReady(true), 1000);
      };
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        if (timeout) clearTimeout(timeout);
      };
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <main className="w-full min-h-screen flex justify-center bg-gradient-to-br from-blue-50 to-indigo-100 items-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "min(95vw, 1400px)",
          height: "min(90vh, 800px)",
          borderRadius: "1.4rem",
          border: "2px solid #e5e7eb",
          backgroundImage: "url('/images/medina/game-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
        }}
      >
        {!ready ? (
          <div className="relative z-10 bg-white/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border-2 border-white/50">
            <div className="text-lg font-semibold text-gray-800 drop-shadow-sm">Chargement du jeu de mémoire...</div>
          </div>
        ) : (
          <div className="relative z-10 w-full h-full">
            <MemoryGameProvider>
              <GameInitializer />
              <GameStateRenderer />
              <CulturalInfoModalWrapper />
              <GameEndModalWrapper experienceId={experienceId} />
            </MemoryGameProvider>
          </div>
        )}
      </div>
    </main>
  );
};

export default MedinaMemoryGame;
