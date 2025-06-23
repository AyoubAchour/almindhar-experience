import { useFrame } from "@react-three/fiber";
import React from "react";
import { useGameContext } from "../../context/GameContext";

interface DistanceTrackerProps {
  status: string;
  camelRef: React.RefObject<any>;
  distanceRef: React.MutableRefObject<number>;
  setDistance: (d: number) => void;
}

const BASE_SPEED = 10;
const SPEED_INCREMENT = 1.5;
const MAX_SPEED = 26;

const DistanceTracker: React.FC<DistanceTrackerProps> = ({ status, camelRef, distanceRef, setDistance }) => {
  const { setSpeed } = useGameContext();
  
  useFrame((state, delta) => {
    if (status !== "playing") return;
    const speed = Math.min(BASE_SPEED + SPEED_INCREMENT * Math.floor(distanceRef.current / 10), MAX_SPEED);
    setSpeed(speed);
    distanceRef.current += speed * delta;
    setDistance(distanceRef.current);
    if (camelRef.current) {
      camelRef.current.keepZAtZero();
    }
  });
  return null;
};

export default DistanceTracker; 