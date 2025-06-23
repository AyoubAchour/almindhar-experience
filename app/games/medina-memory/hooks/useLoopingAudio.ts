import { useEffect, useRef } from 'react';

/**
 * Plays a looping audio file when 'play' is true, pauses when false.
 * Usage: useLoopingAudio('/sounds/medina/cultural-bg.mp3', isPlaying, 0.2)
 */
export function useLoopingAudio(src: string, play: boolean, volume: number = 1.0) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
    }
    const audio = audioRef.current;
    audio.volume = volume;
    if (play) {
      audio.play().catch(() => {}); // Ignore play errors (e.g., autoplay restrictions)
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
    // Only re-run if src, play, or volume changes
  }, [src, play, volume]);
}
