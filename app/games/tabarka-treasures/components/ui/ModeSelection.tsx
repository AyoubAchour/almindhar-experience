'use client';

import React from 'react';
import { useGameContext } from '../../context/GameContext';

interface ModeSelectionProps {
  onModeSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect }) => {
  const { setDifficulty } = useGameContext();

  const handleModeSelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    // Play button click sound
    const audio = new Audio('/sounds/tbarka-treasures/button-click.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));

    setDifficulty(difficulty);
    onModeSelect(difficulty);
  };

  const modes = [
    {
      id: 'easy',
      title: 'Facile',
      description: 'Parfait pour débuter votre aventure sous-marine',
      reward: '5% de réduction',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      features: [
        'Poissons moins fréquents',
        'Trésors plus nombreux',
        'Rythme détendu'
      ]
    },
    {
      id: 'medium',
      title: 'Moyen',
      description: 'Un défi équilibré pour les plongeurs expérimentés',
      reward: '10% de réduction',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      features: [
        'Équilibre poissons/trésors',
        'Vitesse modérée',
        'Défi standard'
      ]
    },
    {
      id: 'hard',
      title: 'Difficile',
      description: 'Pour les maîtres plongeurs de Tabarka',
      reward: '15% de réduction',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      features: [
        'Poissons très fréquents',
        'Trésors plus rares',
        'Défi intense'
      ]
    }
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 p-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Choisissez votre niveau de difficulté
        </h1>
        <p className="text-xl text-blue-100">
          Plongez dans les eaux de Tabarka selon votre expérience
        </p>
      </div>

      {/* Mode Cards - Horizontal Layout */}
      <div className="flex flex-row gap-6 max-w-6xl w-full justify-center">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className={`${mode.color} ${mode.hoverColor} rounded-xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex-1 max-w-sm`}
            onClick={() => handleModeSelect(mode.id as 'easy' | 'medium' | 'hard')}
          >
            {/* Mode Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-2">{mode.title}</h2>
              <p className="text-sm opacity-90">{mode.description}</p>
            </div>

            {/* Features */}
            <div className="mb-4">
              <ul className="space-y-2">
                {mode.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reward */}
            <div className="text-center mt-6 pt-4 border-t border-white/20">
              <div className="text-lg font-bold text-yellow-200">
                🎁 {mode.reward}
              </div>
              <div className="text-xs opacity-75 mt-1">
                Récompense pour score élevé
              </div>
            </div>

            {/* Play Button */}
            <div className="text-center mt-4">
              <div className="bg-white/20 hover:bg-white/30 rounded-lg py-2 px-4 text-sm font-medium transition-colors">
                Jouer maintenant
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => window.history.back()}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
};

export default ModeSelection;
