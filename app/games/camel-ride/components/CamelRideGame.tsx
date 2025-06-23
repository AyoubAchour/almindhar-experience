'use client';

import React, { useEffect, useState } from "react";
import Scene from "./game/Scene";
import { GameProvider, useGameContext } from "../context/GameContext";
import { useGameScore } from "@/lib/hooks/useGameScore";
import { useGameBadges } from "@/lib/hooks/useGameBadges";
import GameEndModal from "./ui/GameEndModal";

interface CamelRideGameProps {
  experienceId: string;
}

function useGameEnd(experienceId: string) {
  const { status, score, distance, resetGame } = useGameContext();
  const { submitScore, awardedReward } = useGameScore(experienceId);
  const { checkAndAwardBadges } = useGameBadges();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (status === "gameOver") {
      // First submit the score
      submitScore(score).then(() => {
        // Then check and award badges with distance data
        return checkAndAwardBadges({
          experienceId,
          score,
          distance,
          completed: true
        });
      }).then(() => {
        // Finally show the modal
        setModalVisible(true);
      }).catch((error) => {
        console.error('Error in game end flow:', error);
        // Still show modal even if badge checking fails
        setModalVisible(true);
      });
    } else {
      setModalVisible(false);
    }
  }, [status, score, distance, submitScore, checkAndAwardBadges, experienceId]);

  const handleRestart = () => {
    setModalVisible(false);
    resetGame();
  };
  const handleBack = () => {
    window.history.back();
  };
  return { modalVisible, handleRestart, handleBack, awardedReward };
}

// Helper component to use context hooks inside provider
function GameEndModalWrapper({ experienceId }: { experienceId: string }) {
  const { modalVisible, handleRestart, handleBack, awardedReward } = useGameEnd(experienceId);
  return (
    <GameEndModal
      visible={modalVisible}
      onRestart={handleRestart}
      onBack={handleBack}
      awardedReward={awardedReward || undefined}
    />
  );
}

const CamelRideGame: React.FC<CamelRideGameProps> = ({ experienceId }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (document.readyState === "complete") {
      timeout = setTimeout(() => setReady(true), 2000);
    } else {
      const onLoad = () => {
        timeout = setTimeout(() => setReady(true), 2000);
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
    <main className="w-full min-h-screen flex justify-center bg-white items-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "min(95vw, 1900px)",
          height: "min(80vh, 800px)",
          borderRadius: "1.4rem",
          border: "2px solid #e5e7eb",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}
      >
        {!ready ? (
          <div className="text-lg text-gray-500">Chargement du jeu...</div>
        ) : (
          <GameProvider>
            <Scene />
            <GameEndModalWrapper experienceId={experienceId} />
          </GameProvider>
        )}
      </div>
    </main>
  );
};

export default CamelRideGame; 