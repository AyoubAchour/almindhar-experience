"use client";

import React from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useGameProgress } from "@/lib/hooks/useGameProgress";
import TutorialModal from "@/app/games/camel-ride/components/ui/TutorialModal";

// Dynamically import the games to avoid SSR issues
const CamelRideGame = dynamic(() => import("@/app/games/camel-ride/components/CamelRideGame"), { ssr: false });
const MedinaMemoryGame = dynamic(() => import("@/app/games/medina-memory/components/MedinaMemoryGame"), { ssr: false });
const TabarkaTreasuresGame = dynamic(() => import("@/app/games/tabarka-treasures/components/TabarkaTreasuresGame"), { ssr: false });

const GamePage: React.FC = () => {
  // Get the experience ID and game slug from the URL
  const params = useParams() as { id: string | string[]; game: string | string[] };
  const experienceId = Array.isArray(params.id) ? params.id[0] : params.id;
  const gameSlug = Array.isArray(params.game) ? params.game[0] : params.game;

  // Fetch tutorial state for this experience
  const { tutorialCompleted, loading, error, markTutorialComplete } = useGameProgress(experienceId);
  // Handler to mark tutorial as completed
  const handleClose = async () => { await markTutorialComplete(); };

  // Render the correct game based on the slug
  switch (gameSlug) {
    case "camel-ride":
      // Until progress is loading, show loader
      if (loading) {
        return <div className="p-12 text-center">Chargement...</div>;
      }
      // Always load the game; overlay tutorial if not yet completed
      return (
        <>
          <TutorialModal visible={!tutorialCompleted} onClose={handleClose} />
          <CamelRideGame experienceId={experienceId} />
        </>
      );
    case "medina-memory":
      // Until progress is loading, show loader
      if (loading) {
        return <div className="p-12 text-center">Chargement...</div>;
      }
      // Always load the game; no tutorial modal for memory game yet
      return (
        <>
          <MedinaMemoryGame experienceId={experienceId} />
        </>
      );
    case "tabarka-treasures":
      // Until progress is loading, show loader
      if (loading) {
        return <div className="p-12 text-center">Chargement...</div>;
      }
      // Load the Tabarka Treasures game
      return (
        <>
          <TabarkaTreasuresGame experienceId={experienceId} />
        </>
      );
    // Add more cases here for other games in the future
    default:
      return (
        <div className="p-12 text-center text-red-600">
          Jeu non trouvé.<br />Game not found.
        </div>
      );
  }
};

export default GamePage; 