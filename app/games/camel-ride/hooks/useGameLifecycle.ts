import { useEffect } from "react";

interface UseGameLifecycleProps {
  status: string;
  distance: number;
  setDistance: (d: number) => void;
  setFrozenDistance: (d: number) => void;
  setScore: (s: number) => void;
  score: number;
  prevStatus: React.MutableRefObject<string>;
  distanceRef: React.MutableRefObject<number>;
  gameOverTriggered: React.MutableRefObject<boolean>;
}

export function useGameLifecycle({
  status,
  distance,
  setDistance,
  setFrozenDistance,
  setScore,
  score,
  prevStatus,
  distanceRef,
  gameOverTriggered,
}: UseGameLifecycleProps) {
  useEffect(() => {
    // Only reset distance when transitioning from gameOver/ready to playing
    if ((prevStatus.current === "gameOver" || prevStatus.current === "ready") && status === "playing") {
      distanceRef.current = 0;
      setDistance(0);
      setFrozenDistance(0);
      gameOverTriggered.current = false;
    }
    if (status === "gameOver") {
      // Ensure that on game over the distance and physics are completely frozen
      if (!gameOverTriggered.current) {
        setFrozenDistance(Math.round(distance));
        gameOverTriggered.current = true;
      }
    }
    prevStatus.current = status;
  }, [status, distance, setDistance, setFrozenDistance, gameOverTriggered, prevStatus]);

  // Update score every 10m of distance
  useEffect(() => {
    if (status !== "playing") return;
    const newScore = Math.floor(distance / 10);
    if (newScore !== score) {
      setScore(newScore);
    }
  }, [distance, status, score, setScore]);
} 