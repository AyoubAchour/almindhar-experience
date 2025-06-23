import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface FpsTrackerProps {
  setFps: (fps: number) => void;
}

const FpsTracker: React.FC<FpsTrackerProps> = ({ setFps }) => {
  const lastTime = useRef(performance.now());
  const frames = useRef(0);
  useFrame(() => {
    frames.current++;
    const now = performance.now();
    if (now - lastTime.current > 500) {
      setFps(Math.round((frames.current * 1000) / (now - lastTime.current)));
      frames.current = 0;
      lastTime.current = now;
    }
  });
  return null;
};

export default FpsTracker; 