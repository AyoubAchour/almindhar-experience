"use client";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Camel, { CamelHandle } from "./Camel";
import Ground from "./Ground";
import Obstacles from "./Obstacles";
import HUD from "../ui/HUD";
import Menu from "./Menu";
import { useGameContext } from "../../context/GameContext";
import * as THREE from "three";
import { Sky } from '@react-three/drei';
import Clouds from './Clouds';
import CameraFollow from "./CameraFollow";
import DistanceTracker from "./DistanceTracker";
import FpsTracker from "./FpsTracker";
import { useGameLifecycle } from "../../hooks/useGameLifecycle";
import { OrbitControls } from '@react-three/drei';
import { FogExp2 } from "three";
import Scenery from './Scenery';
import CamelDust from './CamelDust';
import { useLoopingAudio } from '../../hooks/useLoopingAudio';

// Helper component to set up scene-level effects like fog
const WorldSetup = () => {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new FogExp2(0xf0e5c9, 0.015); // Increased fog density
  }, [scene]);
  return null; // This component doesn't render anything itself
};

const Scene: React.FC = () => {
  const { status, setStatus, resetGame, distance, setDistance, score, setScore } = useGameContext();
  const camelRef = useRef<CamelHandle>(null);
  const distanceRef = useRef(0);
  const lastValidCameraPosition = useRef<THREE.Vector3 | null>(null);
  const lastValidLookAt = useRef<THREE.Vector3 | null>(null);
  // Frozen states for game over
  const [frozenDistance, setFrozenDistance] = useState(0);
  const gameOverTriggered = useRef(false);
  // Track previous status to detect transitions
  const prevStatus = useRef(status);
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  // FPS state for HUD
  const [fps, setFps] = useState(0);
  // Track camel X position
  const [camelX, setCamelX] = useState(0);

  // Add state for free roam mode
  const [isFreeRoam, setIsFreeRoam] = useState(false);
  const toggleFreeRoam = () => setIsFreeRoam(prev => !prev);

  // Add state for collider visibility
  const [showColliders, setShowColliders] = useState(false);
  const toggleShowColliders = () => setShowColliders(prev => !prev);

  // Use modular game lifecycle hook
  useGameLifecycle({
    status,
    distance,
    setDistance,
    setFrozenDistance,
    setScore,
    score,
    prevStatus,
    distanceRef,
    gameOverTriggered,
  });

  // Play background music while the game is running
  useLoopingAudio('/sounds/Background.mp3', status === 'playing', 0.2);
  // Play wind sound as a subtle background layer
  useLoopingAudio('/sounds/Wind_sound.mp3', status === 'playing', 0.05);

  // Restart handler: reset context and camel position
  const handleRestart = () => {
    resetGame();
    // Reset distance tracking
    distanceRef.current = 0;
    setDistance(0);
    setFrozenDistance(0);
    gameOverTriggered.current = false;
    
    // Fully reset camel position and physics
    camelRef.current?.resetPosition();
    // Do NOT set status to 'playing' here; user must press Enter to start
  };

  // Add Enter key handler for starting/restarting the game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        if (status === "ready") {
          // Reset camel to consistent start height
          camelRef.current?.resetPosition();
          setStatus("playing");
          distanceRef.current = 0;
        } else if (status === "gameOver") {
          resetGame();
          distanceRef.current = 0;
          camelRef.current?.resetPosition();
          setStatus("playing");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status, setStatus, resetGame]);

  // Update camelX every frame
  useEffect(() => {
    let frame: number;
    const update = () => {
      const x = camelRef.current?.getPosition?.()?.x ?? 0;
      setCamelX(x);
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <HUD 
        distance={status === "gameOver" ? frozenDistance : Math.round(distance)} 
        containerRef={containerRef} 
        fps={fps} 
        status={status}
        isFreeRoam={isFreeRoam} 
        onToggleFreeRoam={toggleFreeRoam} 
        showColliders={showColliders}
        onToggleShowColliders={toggleShowColliders}
      />
      <Menu visible={status === "gameOver"} onRestart={handleRestart} />
      <Canvas 
        camera={{ position: [0, 3, 10], fov: 60, near: 0.1, far: 500 }} 
        shadows 
        style={{ width: "100%", height: "100%" }}
        gl={{ 
          precision: "mediump",  // Use high precision rendering
          antialias: true,     // Enable antialiasing
          powerPreference: "high-performance" // Request high performance GPU
        }}
      >
        <WorldSetup />
        
        {/* Conditionally render camera controls */}
        {isFreeRoam ? (
        <OrbitControls />
        ) : (
          <CameraFollow 
            camelRef={camelRef} 
            lastValidCameraPosition={lastValidCameraPosition} 
            lastValidLookAt={lastValidLookAt} 
            status={status} 
          />
        )}

        <Sky sunPosition={[100, 60, 100]} turbidity={4} rayleigh={2.5} mieCoefficient={0.005} mieDirectionalG={0.7} inclination={0.47} azimuth={0.25} />
        <Clouds status={status} />
        {/* Only track distance when playing and not in free roam? Or always track? Let's track always for now */}
        {status === "playing" && (
          <DistanceTracker status={status} camelRef={camelRef} distanceRef={distanceRef} setDistance={setDistance} key={`tracker-${prevStatus.current}`} />
        )}
        {/* Ambient Light: Soft global illumination */}
        <ambientLight intensity={0.5} />
        {/* Directional Light: Simulates sunlight, casts shadows */}
        <directionalLight
          position={[5, 10, 7.5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Physics World - PAUSE if game over OR in free roam */}
        <Physics 
          debug={showColliders}
          gravity={[0, -9.81, 0]} 
          timeStep={status === 'gameOver' || isFreeRoam ? 0 : 'vary'} // Freeze physics if game over or free roam
          interpolate={true} 
          paused={status === "gameOver" || isFreeRoam} // Pause if game over or free roam
        >
          <Ground />
          <Scenery />
          <Obstacles status={status} camelX={camelX} showColliders={showColliders} />
          <Camel ref={camelRef} showColliders={showColliders}>
            <CamelDust isRunning={status === 'playing'} isGrounded={true} />
          </Camel>
        </Physics>
        <FpsTracker setFps={setFps} />
      </Canvas>
    </div>
  );
};

export default Scene; 