'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
import { GameProvider, useGameContext } from "../context/GameContext";
import { CulturalFactProvider } from "../context/CulturalFactContext";
import { SettingsProvider } from "../context/SettingsContext";
import { BadgeAwardProvider, useBadgeAward } from "@/contexts/BadgeAwardContext";
import { useGameScore } from "@/lib/hooks/useGameScore";
import { useGameBadges } from "@/lib/hooks/useGameBadges";
import PhaserGame from "./game/PhaserGame";
import ModeSelection from "./ui/ModeSelection";
import GameEndModal from "./ui/GameEndModal";
import CulturalFactOverlay from "./ui/CulturalFactOverlay";
import SettingsOverlay from "./ui/SettingsOverlay";
import BadgeAwardOverlay from "./ui/BadgeAwardOverlay";
import { useRouter } from 'next/navigation';

interface TabarkaTreasuresGameProps {
  experienceId: string;
}

// Game wrapper component that handles mode selection and game flow
const GameWrapper: React.FC<{ experienceId: string }> = React.memo(({ experienceId }) => {
  const router = useRouter();
  const { difficulty } = useGameContext();
  const { showBadgeAward } = useBadgeAward();
  const { submitScore, awardedReward } = useGameScore(experienceId);
  const { checkAndAwardBadges } = useGameBadges();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEndModalOpen, setGameEndModalOpen] = useState(false);
  const [restartKey, setRestartKey] = useState(0); // Add restart key for forcing remount
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameStats, setGameStats] = useState<{
    finalScore: number;
    timeRemaining: number;
    difficulty: 'easy' | 'medium' | 'hard';
    gameCompleted: boolean;
  } | null>(null);

  const handleModeSelect = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    console.log(`Selected difficulty: ${selectedDifficulty}`);
    console.log('Clearing modal state and starting new game');
    setGameEndModalOpen(false); // Ensure modal is closed
    setGameStats(null); // Clear any previous game stats
    setGameStarted(true);
  };

  const handleBackToModeSelection = useCallback(() => {
    console.log('Going back to mode selection - clearing all game state');
    setGameStarted(false);
    setGameEndModalOpen(false); // Clear modal state
    setGameStats(null); // Clear game stats
    setRestartKey(prev => prev + 1); // Force remount when going back to mode selection
  }, []);

  const handleGameEnd = useCallback(async (finalScore: number, timeRemaining: number = 0, gameCompleted: boolean = true) => {
    try {
      console.log('🎮 Game ended with score:', finalScore);
      
      // Store game stats
      setGameStats({
        finalScore,
        timeRemaining,
        difficulty: difficulty || 'easy',
        gameCompleted
      });
      
      // First submit the score
      await submitScore(finalScore);
      
      // Then check and award badges with Tabarka game data
      await checkAndAwardBadges({
        experienceId,
        score: finalScore,
        completed: gameCompleted,
        difficulty: difficulty || 'easy'
      });
      
      // Show the game end modal
      setGameEndModalOpen(true);
    } catch (error) {
      console.error('❌ Error in handleGameEnd:', error);
    }
  }, [difficulty, experienceId, submitScore, checkAndAwardBadges]);

  const handleRestartGame = () => {
    setGameEndModalOpen(false);
    setGameStats(null);
    setRestartKey(prev => prev + 1); // Force complete remount of PhaserGame
    setGameStarted(true); // Restart the current game
  };

  const handleBackToExperience = () => {
    console.log('Navigating back to experience page');
    // Close modal and clean up state first
    setGameEndModalOpen(false);
    setGameStats(null);
    // Navigate back to the experience page
    router.push(`/experiences/${experienceId}`);
  };

  // Setup badge event listener
  useEffect(() => {
    const handleBadgeEarned = (event: CustomEvent) => {
      const badge = event.detail;
      console.log('🎖️ Badge earned event received in React:', badge);
      console.log('🎖️ showBadgeAward function:', showBadgeAward);

      try {
        showBadgeAward(badge);
        console.log('🎖️ Badge award triggered successfully');
      } catch (error) {
        console.error('🎖️ Error showing badge award:', error);
      }
    };

    console.log('🎖️ Setting up badge event listener');
    window.addEventListener('badgeEarned', handleBadgeEarned as EventListener);

    return () => {
      console.log('🎖️ Cleaning up badge event listener');
      window.removeEventListener('badgeEarned', handleBadgeEarned as EventListener);
    };
  }, [showBadgeAward]);

  // The awardedReward will be passed to GameEndModal when it opens

  if (!gameStarted || !difficulty) {
    return <ModeSelection onModeSelect={handleModeSelect} />;
  }

  return (
    <>
      <div ref={gameContainerRef} className="w-full h-full relative" data-game-container>
        <PhaserGame
          key={restartKey} // Add key prop to force remount on restart
          experienceId={experienceId}
          difficulty={difficulty}
          onBackToModeSelection={handleBackToModeSelection}
          onGameEnd={handleGameEnd}
        />

        {/* Settings Overlay - rendered via portal to prevent re-renders */}
        <SettingsOverlay />

        {/* Cultural Fact Overlay - rendered via portal to prevent re-renders */}
        <CulturalFactOverlay />

        {/* Badge Award Overlay - rendered via portal to prevent re-renders */}
        <BadgeAwardOverlay />
      </div>

      {/* Game End Modal with integrated reward display */}
      {gameStats && gameEndModalOpen && (
        <GameEndModal
          visible={gameEndModalOpen}
          onRestart={handleRestartGame}
          onBack={handleBackToExperience}
          onModeSelection={handleBackToModeSelection}
          awardedReward={awardedReward || undefined}
          gameStats={gameStats}
        />
      )}
    </>
  );
});

GameWrapper.displayName = 'GameWrapper';

const TabarkaTreasuresGame: React.FC<TabarkaTreasuresGameProps> = ({ experienceId }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate loading time for game initialization
    const timer = setTimeout(() => {
      setReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="w-full min-h-screen flex justify-center bg-white items-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "min(95vw, 1200px)",
          height: "min(80vh, 800px)",
          borderRadius: "1.4rem",
          border: "2px solid #e5e7eb",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}
      >
        {!ready ? (
          <div className="text-lg text-gray-500">Chargement du jeu Tabarka Treasures...</div>
        ) : (
          <BadgeAwardProvider>
            <SettingsProvider>
              <GameProvider>
                <CulturalFactProvider>
                  <GameWrapper experienceId={experienceId} />
                </CulturalFactProvider>
              </GameProvider>
            </SettingsProvider>
          </BadgeAwardProvider>
        )}
      </div>
    </main>
  );
};

export default TabarkaTreasuresGame;
