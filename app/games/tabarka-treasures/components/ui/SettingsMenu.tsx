'use client';

import React, { useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Eye, EyeOff, Bug } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose }) => {
  const {
    volume,
    factsEnabled,
    developerMode,
    setVolume,
    setFactsEnabled,
    setDeveloperMode,
    resetSettings
  } = useSettings();
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Pause/resume game when modal opens/closes (keep music playing for volume adjustment)
  useEffect(() => {
    if (isOpen) {
      // Pause the game but keep music playing for volume adjustment
      window.dispatchEvent(new CustomEvent('pauseGameForSettings'));
    } else {
      // Resume the game
      window.dispatchEvent(new CustomEvent('resumeGameFromSettings'));
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div
        ref={modalRef}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-scaleIn border-2 border-white/50"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="settings-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            id="settings-title"
            className="text-2xl font-bold text-gray-800"
          >
            Paramètres
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Fermer les paramètres"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="volume-slider" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              Volume
            </label>
            <span className="text-sm text-gray-600 font-medium">{volume}%</span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{ '--value': `${volume}%` } as React.CSSProperties}
            aria-label={`Volume: ${volume}%`}
          />
        </div>

        {/* Cultural Facts Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label htmlFor="facts-toggle" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              {factsEnabled ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              Faits culturels
            </label>
            <button
              id="facts-toggle"
              onClick={() => setFactsEnabled(!factsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                factsEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={factsEnabled}
              aria-label={`${factsEnabled ? 'Désactiver' : 'Activer'} les faits culturels`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  factsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Afficher des informations culturelles lors de la collecte de trésors
          </p>
        </div>

        {/* Developer Mode Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label htmlFor="developer-toggle" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Mode développeur
            </label>
            <button
              id="developer-toggle"
              onClick={() => setDeveloperMode(!developerMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                developerMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={developerMode}
              aria-label={`${developerMode ? 'Désactiver' : 'Activer'} le mode développeur`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  developerMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Activer les fonctionnalités de développement
          </p>
        </div>

        {/* Reset Button */}
        <div className="mb-4">
          <button
            onClick={resetSettings}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Réinitialiser les paramètres
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default React.memo(SettingsMenu);

// Add custom styles for the volume slider
const styles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    background: #1d4ed8;
    transform: scale(1.1);
  }

  .slider::-webkit-slider-track {
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, #2563eb 0%, #2563eb var(--value), #e5e7eb var(--value), #e5e7eb 100%);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-track {
    height: 8px;
    border-radius: 4px;
    background: #e5e7eb;
  }

  .animate-scaleIn {
    animation: scaleIn 0.2s ease-out;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
