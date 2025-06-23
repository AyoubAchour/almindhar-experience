'use client';

import React, { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { GameScene } from './GameScene';

interface PhaserGameProps {
  experienceId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onRewardEarned?: (reward: any) => void;
  onBackToModeSelection: () => void;
  onGameEnd?: (finalScore: number, timeRemaining?: number, gameCompleted?: boolean) => Promise<void>;
}

const PhaserGame: React.FC<PhaserGameProps> = ({
  experienceId,
  difficulty,
  onRewardEarned,
  onBackToModeSelection,
  onGameEnd
}) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    // Add a small delay to ensure container dimensions are properly calculated
    const initializeGame = () => {
      if (!gameRef.current) return;

      // Get container dimensions
      const containerWidth = gameRef.current.offsetWidth;
      const containerHeight = gameRef.current.offsetHeight;

      console.log('Container dimensions:', containerWidth, 'x', containerHeight);

      // Create Phaser game configuration
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: containerWidth, // Use actual container dimensions
        height: containerHeight,
        parent: gameRef.current,
        backgroundColor: '#87CEEB',
        scene: new GameScene(experienceId, difficulty, onRewardEarned || (() => {}), onBackToModeSelection, onGameEnd),
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        scale: {
          mode: Phaser.Scale.RESIZE, // Use RESIZE to fill container completely
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      // Create the Phaser game instance
      phaserGameRef.current = new Phaser.Game(config);
    };

    // Initialize game with a small delay to ensure proper container sizing
    const timeoutId = setTimeout(initializeGame, 100);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [experienceId, difficulty, onRewardEarned, onBackToModeSelection, onGameEnd]);

  return (
    <div
      ref={gameRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    />
  );
};

export default React.memo(PhaserGame);