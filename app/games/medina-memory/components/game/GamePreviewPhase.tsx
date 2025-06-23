'use client';

import React, { useEffect, useState } from 'react';
import { CardItem, GameMode, getGameConfig } from '../../assets/cardData';

interface GamePreviewPhaseProps {
  cards: CardItem[];
  mode: GameMode;
  onPreviewComplete: () => void;
}

const GamePreviewPhase: React.FC<GamePreviewPhaseProps> = ({
  cards,
  mode,
  onPreviewComplete
}) => {
  const [timeLeft, setTimeLeft] = useState(mode.difficulty.previewTime);
  const gameConfig = getGameConfig(mode);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onPreviewComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onPreviewComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Mémorisez les positions
        </h2>
        <p className="text-lg text-gray-600">
          Mode: {mode.name} • {mode.difficulty.totalPairs} paires
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="mb-6">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{
            background: timeLeft <= 1 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}
        >
          {timeLeft}
        </div>
      </div>

      {/* Cards Grid */}
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
            <div
              key={`preview-card-${index}`}
              className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300"
              style={{
                width: `${gameConfig.CARD_WIDTH}px`,
                height: `${gameConfig.CARD_HEIGHT}px`,
                backgroundColor: card.color,
                border: '2px solid rgba(255,255,255,0.3)',
                transform: timeLeft <= 1 ? 'scale(0.95)' : 'scale(1)',
                opacity: timeLeft <= 1 ? 0.7 : 1
              }}
            >
              {/* Card Content */}
              <div className="w-full h-full flex flex-col items-center justify-center text-white font-bold">
                {/* Emoji */}
                <div className="text-3xl mb-2">{card.emoji}</div>
                
                {/* French Label */}
                <div className="text-sm font-semibold text-center px-2">{card.label}</div>
                
                {/* Arabic Label */}
                {card.labelArabic && (
                  <div className="text-xs opacity-80 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {card.labelArabic}
                  </div>
                )}
              </div>

              {/* Pulse Animation for Last Second */}
              {timeLeft <= 1 && (
                <div 
                  className="absolute inset-0 bg-white opacity-30 animate-pulse"
                  style={{ animationDuration: '0.5s' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-2">
          {timeLeft > 1 
            ? "Observez attentivement les positions des cartes"
            : "Préparez-vous... Le jeu commence!"
          }
        </p>
        
        {/* Mode-specific tips */}
        <div className="text-sm text-gray-500">
          {mode.id === 'discovery' && (
            <p>💡 Prenez votre temps, il n'y a pas de limite!</p>
          )}
          {mode.id === 'artisan' && (
            <p>⚡ Vous avez 5 minutes et 20 tentatives maximum</p>
          )}
          {mode.id === 'master' && (
            <p>🔥 Défi ultime: 4 minutes, 12 tentatives, attention aux erreurs consécutives!</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full max-w-md">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((mode.difficulty.previewTime - timeLeft) / mode.difficulty.previewTime) * 100}%`,
              background: timeLeft <= 1 
                ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePreviewPhase;
