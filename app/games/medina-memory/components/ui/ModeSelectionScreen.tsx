'use client';

import React from 'react';
import { GAME_MODES, GameMode } from '../../assets/cardData';

interface ModeSelectionScreenProps {
  onModeSelect: (mode: GameMode) => void;
  onBack: () => void;
  completedModes: string[]; // Array of completed mode IDs
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  onModeSelect,
  onBack,
  completedModes
}) => {
  
  const getModeIcon = (modeId: string): string => {
    switch (modeId) {
      case 'discovery': return '🟢';
      case 'artisan': return '🟡';
      case 'master': return '🔴';
      default: return '⚪';
    }
  };

  const getModeStatusIcon = (mode: GameMode): string => {
    if (completedModes.includes(mode.id)) return '✅';
    return '';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      {/* Back Button - Top Left */}
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center"
        >
          ← Retour aux Expériences
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Mémoire de la Médina
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Choisissez votre niveau de défi
        </p>
      </div>

      {/* Mode Cards - Horizontal Layout */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-5xl justify-center items-stretch">
        {GAME_MODES.map((mode) => {
          const isUnlocked = true; // All modes are now unlocked
          const isCompleted = completedModes.includes(mode.id);
          
          return (
            <div
              key={mode.id}
              className={`
                relative p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex-1 min-w-0
                ${isUnlocked
                  ? 'border-blue-300 bg-white hover:border-blue-500 hover:shadow-lg transform hover:scale-105'
                  : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                }
                ${isCompleted ? 'border-green-400 bg-green-50' : ''}
              `}
              onClick={() => isUnlocked && onModeSelect(mode)}
            >
              {/* Mode Status Icon */}
              <div className="absolute top-4 right-4 text-xl">
                {getModeStatusIcon(mode)}
              </div>

              {/* Mode Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{getModeIcon(mode.id)}</div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {mode.name}
                </h3>
              </div>

              {/* Reward Info */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                  <span className="text-xl mr-2">🎁</span>
                  <span className="text-lg font-bold text-blue-600">
                    {mode.rewards.discountPercentage}% de réduction
                  </span>
                </div>
              </div>

              {/* Game Settings */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📋</div>
                    <div className="text-sm font-semibold text-gray-700">{mode.difficulty.totalPairs}</div>
                    <div className="text-xs text-gray-500">paires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">👁️</div>
                    <div className="text-sm font-semibold text-gray-700">{mode.difficulty.previewTime}s</div>
                    <div className="text-xs text-gray-500">aperçu</div>
                  </div>
                </div>

                {(mode.difficulty.timeLimit || mode.difficulty.maxAttempts) && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                    {mode.difficulty.timeLimit && (
                      <div className="text-center">
                        <div className="text-2xl mb-1">⏰</div>
                        <div className="text-sm font-semibold text-gray-700">{Math.floor(mode.difficulty.timeLimit / 60)}min</div>
                        <div className="text-xs text-gray-500">limite</div>
                      </div>
                    )}
                    {mode.difficulty.maxAttempts && (
                      <div className="text-center">
                        <div className="text-2xl mb-1">❌</div>
                        <div className="text-sm font-semibold text-gray-700">{mode.difficulty.maxAttempts}</div>
                        <div className="text-xs text-gray-500">erreurs max</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default ModeSelectionScreen;
