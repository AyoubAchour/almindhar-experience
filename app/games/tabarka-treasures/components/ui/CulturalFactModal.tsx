'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface CulturalFactModalProps {
  isOpen: boolean;
  onClose: () => void;
  treasureType: string;
  fact: string;
}

const CulturalFactModal: React.FC<CulturalFactModalProps> = ({
  isOpen,
  onClose,
  treasureType,
  fact
}) => {
  const { factsEnabled } = useSettings();
  const modalRef = useRef<HTMLDivElement>(null);

  // Pause/resume game when modal opens/closes
  useEffect(() => {
    if (isOpen && factsEnabled) {
      // Pause the game when modal opens
      window.dispatchEvent(new CustomEvent('pauseGame'));
    } else {
      // Resume the game when modal closes
      window.dispatchEvent(new CustomEvent('resumeGame'));
    }
  }, [isOpen, factsEnabled]);

  // Memoize the escape key handler
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen && factsEnabled) {
      onClose();
    }
  }, [isOpen, onClose, factsEnabled]);

  // Handle escape key
  useEffect(() => {
    if (isOpen && factsEnabled) {
      document.addEventListener('keydown', handleEscape);
      // Focus the modal for accessibility
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape, factsEnabled]);

  // Get treasure title based on type
  const getTreasureTitle = (treasureType: string): string => {
    const titles = {
      star: 'Étoiles de Mer de Tabarka',
      pottery: 'Poterie Antique',
      coins: 'Monnaies Anciennes',
      tools: 'Outils Archéologiques',
      pearls: 'Perles de Méditerranée'
    };

    return titles[treasureType as keyof typeof titles] || 'Trésor de Tabarka';
  };

  // Get treasure emoji based on type
  const getTreasureEmoji = (treasureType: string): string => {
    const emojis = {
      star: '⭐',
      pottery: '🏺',
      coins: '🪙',
      tools: '🔧',
      pearls: '🦪'
    };

    return emojis[treasureType as keyof typeof emojis] || '💎';
  };

  // Don't render if facts are disabled or modal is not open
  if (!factsEnabled || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        ref={modalRef}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 animate-scaleIn border-2 border-blue-200/50"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="cultural-fact-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getTreasureEmoji(treasureType)}</span>
            <h2 
              id="cultural-fact-title"
              className="text-xl font-bold text-gray-800"
            >
              {getTreasureTitle(treasureType)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Fermer le fait culturel"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Cultural Fact Content */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <p className="text-gray-700 leading-relaxed text-base">
              {fact}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CulturalFactModal);
