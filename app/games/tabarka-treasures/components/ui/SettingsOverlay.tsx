'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SettingsButton from './SettingsButton';
import SettingsMenu from './SettingsMenu';

interface SettingsOverlayProps {
  gameContainerSelector?: string;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ 
  gameContainerSelector = '[data-game-container]' 
}) => {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [gameContainer, setGameContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Find the game container
    const container = document.querySelector(gameContainerSelector) as HTMLElement;
    if (container) {
      setGameContainer(container);
    }
  }, [gameContainerSelector]);

  const handleOpenSettings = () => {
    setSettingsMenuOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsMenuOpen(false);
  };

  if (!mounted || !gameContainer) {
    return null;
  }

  return createPortal(
    <>
      {/* Settings Button */}
      <SettingsButton onClick={handleOpenSettings} />

      {/* Settings Menu */}
      <SettingsMenu
        isOpen={settingsMenuOpen}
        onClose={handleCloseSettings}
      />
    </>,
    gameContainer
  );
};

export default SettingsOverlay;
