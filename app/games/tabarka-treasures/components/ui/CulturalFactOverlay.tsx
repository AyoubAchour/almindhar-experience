'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CulturalFactModal from './CulturalFactModal';
import { useCulturalFact } from '../../context/CulturalFactContext';

interface CulturalFactOverlayProps {
  gameContainerSelector?: string;
}

const CulturalFactOverlay: React.FC<CulturalFactOverlayProps> = ({ 
  gameContainerSelector = '[data-game-container]' 
}) => {
  const { isOpen, treasureType, fact, hideCulturalFact } = useCulturalFact();
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
    <CulturalFactModal
      isOpen={isOpen}
      onClose={hideCulturalFact}
      treasureType={treasureType}
      fact={fact}
    />,
    gameContainer
  );
};

export default React.memo(CulturalFactOverlay);
