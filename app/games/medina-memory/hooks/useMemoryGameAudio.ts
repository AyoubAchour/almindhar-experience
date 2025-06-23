import { useState, useEffect, useRef } from 'react';
import { useLoopingAudio } from './useLoopingAudio';
import { useOneShotAudio } from './useOneShotAudio';

/**
 * Comprehensive audio system for the Medina Memory Game
 * Handles background music and all sound effects
 */
export const useMemoryGameAudio = (
  isPlaying: boolean,
  gameStatus: string,
  masterVolume: number = 0.7
) => {
  // Sound trigger states for one-shot audio
  const [cardFlipTrigger, setCardFlipTrigger] = useState(false);
  const [cardSelectTrigger, setCardSelectTrigger] = useState(false);
  const [matchSuccessTrigger, setMatchSuccessTrigger] = useState(false);
  const [matchFailTrigger, setMatchFailTrigger] = useState(false);
  const [victoryTrigger, setVictoryTrigger] = useState(false);
  const [gameOverTrigger, setGameOverTrigger] = useState(false);

  // Previous game status to detect transitions
  const prevGameStatus = useRef(gameStatus);

  // Background music - plays during gameplay with subtle volume
  useLoopingAudio(
    '/sounds/medina/cultural-bg.mp3',
    isPlaying,
    0.025 * masterVolume
  );

  // Sound effects with volume control
  useOneShotAudio('/sounds/medina/card-flip.mp3', cardFlipTrigger, 0.3 * masterVolume);
  useOneShotAudio('/sounds/medina/card-select.mp3', cardSelectTrigger, 0.2 * masterVolume);
  useOneShotAudio('/sounds/medina/match-success.mp3', matchSuccessTrigger, 0.4 * masterVolume);
  useOneShotAudio('/sounds/medina/match-fail.mp3', matchFailTrigger, 0.3 * masterVolume);
  useOneShotAudio('/sounds/medina/victory.mp3', victoryTrigger, 0.6 * masterVolume);
  useOneShotAudio('/sounds/medina/game-over.mp3', gameOverTrigger, 0.4 * masterVolume);

  // Auto-trigger sounds based on game status changes
  useEffect(() => {
    if (gameStatus !== prevGameStatus.current) {
      if (gameStatus === 'gameOver') {
        setVictoryTrigger(prev => !prev);
      } else if (gameStatus === 'gameLost') {
        setGameOverTrigger(prev => !prev);
      }
      prevGameStatus.current = gameStatus;
    }
  }, [gameStatus]);

  // Return trigger functions for manual sound activation
  return {
    triggerCardFlip: () => setCardFlipTrigger(prev => !prev),
    triggerCardSelect: () => setCardSelectTrigger(prev => !prev),
    triggerMatchSuccess: () => setMatchSuccessTrigger(prev => !prev),
    triggerMatchFail: () => setMatchFailTrigger(prev => !prev),
    triggerVictory: () => setVictoryTrigger(prev => !prev),
    triggerGameOver: () => setGameOverTrigger(prev => !prev),
  };
};
