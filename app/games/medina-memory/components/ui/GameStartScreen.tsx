'use client';

import React, { useEffect } from "react";
import { useMemoryGameContext } from "../../context/GameContext";
import { Play, Info } from "lucide-react";

const GameStartScreen: React.FC = () => {
  const { setStatus } = useMemoryGameContext();

  const handleStart = () => {
    setStatus("modeSelection");
  };

  // Add Enter key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      {/* Game Title */}
      <div className="mb-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-white/50">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 drop-shadow-sm">
          🏛️ Mémoire de la Médina
        </h1>
        <p className="text-lg text-gray-700 font-medium">
          Découvrez les trésors artisanaux de la médina de Tunis
        </p>
      </div>


      {/* Instructions */}
      <div className="mb-8 max-w-md bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border-2 border-white/40">
        <div className="flex items-center gap-3 mb-5">
          <Info className="w-6 h-6 text-blue-700" />
          <h3 className="text-xl font-bold text-gray-900">Comment jouer</h3>
        </div>
        <ul className="text-left text-gray-800 space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-blue-700 font-bold text-lg">1.</span>
            <span className="font-medium">Cliquez sur les cartes pour les retourner</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-700 font-bold text-lg">2.</span>
            <span className="font-medium">Trouvez les paires d'objets identiques</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-700 font-bold text-lg">3.</span>
            <span className="font-medium">Apprenez sur l'artisanat tunisien</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-700 font-bold text-lg">4.</span>
            <span className="font-medium">Gagnez des points et des récompenses !</span>
          </li>
        </ul>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-5 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-blue-500"
      >
        <Play className="w-7 h-7" />
        <span className="text-lg">Commencer le Jeu</span>
      </button>

      {/* Keyboard hint */}
      <div className="mt-6 bg-white/85 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border border-white/50">
        <p className="text-sm text-gray-800 font-medium">
          Ou appuyez sur <kbd className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-bold text-gray-700 shadow-sm">Entrée</kbd>
        </p>
      </div>
    </div>
  );
};

export default GameStartScreen;
