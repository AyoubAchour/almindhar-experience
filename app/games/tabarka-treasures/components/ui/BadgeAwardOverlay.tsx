'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BadgeAwardModal } from '@/components/badges/BadgeAwardModal';

interface BadgeAwardOverlayProps {
  gameContainerSelector?: string;
}

const BadgeAwardOverlay: React.FC<BadgeAwardOverlayProps> = ({ 
  gameContainerSelector = '[data-game-container]' 
}) => {
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

  if (!mounted || !gameContainer) {
    return null;
  }

  return createPortal(
    <BadgeAwardModal />,
    gameContainer
  );
};

export default React.memo(BadgeAwardOverlay);
