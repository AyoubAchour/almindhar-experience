import { useEffect, useState } from "react";

// Interface for movement controls
interface Controls {
  forward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

// Custom hook to track keyboard input for movement
export function useControls(): Controls {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          setControls((c) => ({ ...c, forward: true }));
          break;
        case "ArrowLeft":
        case "KeyA":
          setControls((c) => ({ ...c, left: true }));
          break;
        case "ArrowRight":
        case "KeyD":
          setControls((c) => ({ ...c, right: true }));
          break;
        case "Space":
          e.preventDefault(); // Prevent page scroll
          setControls((c) => ({ ...c, jump: true }));
          break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          setControls((c) => ({ ...c, forward: false }));
          break;
        case "ArrowLeft":
        case "KeyA":
          setControls((c) => ({ ...c, left: false }));
          break;
        case "ArrowRight":
        case "KeyD":
          setControls((c) => ({ ...c, right: false }));
          break;
        case "Space":
          setControls((c) => ({ ...c, jump: false }));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return controls;
} 