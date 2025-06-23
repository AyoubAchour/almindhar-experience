'use client';

import React from "react";
import { useMemoryGameContext } from "../../context/GameContext";
import { Clock, Target, Trophy } from "lucide-react";

const GameHUD: React.FC = () => {
  const { score, attempts, timeElapsed, matchedPairs, totalPairs } = useMemoryGameContext();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-lg p-4 mb-4 shadow-lg border-2 border-white/50">
      <div className="flex justify-between items-center">
        {/* Left side - Game title */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">Mémoire de la Médina</h2>
          <p className="text-sm text-gray-700 font-medium">Trouvez les paires d'objets traditionnels</p>
        </div>

        {/* Right side - Game stats */}
        <div className="flex gap-4">
          {/* Score */}
          <div className="flex items-center gap-2 bg-yellow-100/90 backdrop-blur-sm px-3 py-2 rounded-lg border-2 border-yellow-300 shadow-md">
            <Trophy className="w-5 h-5 text-yellow-700" />
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-900">{score}</div>
              <div className="text-xs text-yellow-700 font-semibold">Points</div>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 bg-blue-100/90 backdrop-blur-sm px-3 py-2 rounded-lg border-2 border-blue-300 shadow-md">
            <Clock className="w-5 h-5 text-blue-700" />
            <div className="text-center">
              <div className="text-lg font-bold text-blue-900">{formatTime(timeElapsed)}</div>
              <div className="text-xs text-blue-700 font-semibold">Temps</div>
            </div>
          </div>

          {/* Attempts */}
          <div className="flex items-center gap-2 bg-purple-100/90 backdrop-blur-sm px-3 py-2 rounded-lg border-2 border-purple-300 shadow-md">
            <Target className="w-5 h-5 text-purple-700" />
            <div className="text-center">
              <div className="text-lg font-bold text-purple-900">{attempts}</div>
              <div className="text-xs text-purple-700 font-semibold">Essais</div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 bg-green-100/90 backdrop-blur-sm px-3 py-2 rounded-lg border-2 border-green-300 shadow-md">
            <div className="text-center">
              <div className="text-lg font-bold text-green-900">{matchedPairs}/{totalPairs}</div>
              <div className="text-xs text-green-700 font-semibold">Paires</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-300 rounded-full h-3 border border-gray-400 shadow-inner">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
