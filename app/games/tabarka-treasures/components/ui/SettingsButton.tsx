'use client';

import React, { useCallback } from 'react';
import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className="absolute top-16 right-4 z-50 bg-white/30 hover:bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl opacity-40 hover:opacity-100"
      aria-label="Ouvrir les paramètres"
      title="Paramètres"
    >
      <Settings
        className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors duration-300"
      />
    </button>
  );
};

export default React.memo(SettingsButton);
