import { useEffect, useRef } from 'react';

/**
 * Plays a one-shot audio file when 'trigger' transitions from false to true.
 * Usage: useOneShotAudio('/sounds/medina/card-flip.mp3', playFlipSound, 0.3)
 */
export function useOneShotAudio(src: string, trigger: boolean, volume: number = 1.0) {
  const prevTrigger = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.preload = 'auto';
      audioRef.current.volume = volume;
    }
    
    // Update volume if it changes
    audioRef.current.volume = volume;
    
    // Play sound only on rising edge (false -> true)
    if (trigger && !prevTrigger.current) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(() => {}); // Ignore play errors
    }
    prevTrigger.current = trigger;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [src, trigger, volume]);
}
