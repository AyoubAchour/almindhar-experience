import { useEffect, useRef } from 'react';

/**
 * Plays a one-shot audio file when 'trigger' transitions from false to true.
 * Usage: useOneShotAudio('/sounds/camel_jump_sound.mp3', playJumpSound)
 */
export function useOneShotAudio(src: string, trigger: boolean) {
  const prevTrigger = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.preload = 'auto';
      audioRef.current.volume = 1.0;
    }
    // Play sound only on rising edge
    if (trigger && !prevTrigger.current) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    prevTrigger.current = trigger;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [src, trigger]);
} 