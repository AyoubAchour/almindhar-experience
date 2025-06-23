'use client';

import React from "react";
import { useMemoryGameContext } from "../../context/GameContext";
import { CardItem, CARD_BACK_STYLE } from "../../assets/cardData";

interface MemoryCardProps {
  card: CardItem;
  cardIndex: number;
  width: number;
  height: number;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, cardIndex, width, height }) => {
  const {
    selectCard,
    revealedCards,
    matchedCards,
    selectedCards,
    status
  } = useMemoryGameContext();

  const isRevealed = revealedCards.has(cardIndex);
  const isMatched = matchedCards.has(cardIndex);
  const isSelected = selectedCards.includes(cardIndex);
  const canClick = status === "playing" && !isMatched && selectedCards.length < 2;



  const handleClick = () => {
    if (canClick && !isSelected) {
      selectCard(cardIndex);
    }
  };

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 transform
        ${canClick ? 'hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed'}
        ${isSelected ? 'scale-105' : ''}
        ${isMatched ? 'opacity-75' : ''}
      `}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={handleClick}
    >
      {/* Card Container - Simple opacity-based flip */}
      <div className="w-full h-full relative rounded-lg overflow-hidden shadow-lg border-2 border-white/30">
        {/* Card Back - Shows when NOT revealed */}
        {!isRevealed && (
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-bold transition-opacity duration-300"
            style={{
              ...CARD_BACK_STYLE,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            <div className="text-center drop-shadow-lg">
              <div className="text-2xl mb-1">🏛️</div>
              <div className="text-xs font-semibold">Médina</div>
            </div>
          </div>
        )}

        {/* Card Front - Shows when revealed */}
        {isRevealed && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold rounded-lg transition-opacity duration-300"
            style={{
              backgroundColor: card.color,
              border: isMatched ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.5)',
              boxShadow: isMatched
                ? '0 0 20px rgba(16, 185, 129, 0.5), inset 0 2px 4px rgba(0,0,0,0.1)'
                : 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            {/* Emoji */}
            <div className="text-3xl mb-2 drop-shadow-lg">{card.emoji}</div>

            {/* French Label */}
            <div className="text-sm font-bold text-center px-2 drop-shadow-md">{card.label}</div>

            {/* Arabic Label */}
            {card.labelArabic && (
              <div className="text-xs opacity-90 mt-1 font-medium drop-shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
                {card.labelArabic}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Match Effect */}
      {isMatched && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl animate-bounce">✨</div>
        </div>
      )}
    </div>
  );
};

export default MemoryCard;
