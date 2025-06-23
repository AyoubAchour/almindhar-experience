"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { RigidBody, CuboidCollider, type RapierRigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGameContext } from "../../context/GameContext";
import { useGLTF } from "@react-three/drei";
import * as THREE from 'three'; // Import THREE for Group and Vector3
import { Text, Billboard } from '@react-three/drei';

interface ObstaclesProps {
  status: string;
  camelX: number;
  showColliders?: boolean;
}

const LANES = [-4, 0, 4]; // 3 lanes (centered)
const OFFSETS = [-2, 2]; // Between lanes
const OBSTACLE_POOL_SIZE = 5;
const OBSTACLE_SPAWN_AHEAD_Z = -80; // How far ahead obstacles should start spawning (negative Z)
const OBSTACLE_RECYCLE_Z_THRESHOLD = 15; // Z position past player to recycle
const MIN_PATTERN_GAP = 18; // Increased minimum gap between patterns
const MAX_ADDITIONAL_GAP = 15; // Adjusted max random gap
const LANE_WIDTH = 5;

// Model filenames
const OBSTACLE_MODELS = [
  '/models/Cactus_long.glb',
  '/models/Cactus_medium.glb',
  '/models/Cactus_short.glb',
  '/models/Rock_01.glb',
  '/models/Rock_02.glb'
];

// Model-specific properties
const MODEL_PROPERTIES = [
  // Cacti (Indices 0, 1, 2) - Corrected yOffset
  { scale: 0.7, colliderArgs: [0.4, 1.0, 0.4] as [number, number, number], yOffset: 1.0 / 2, modelZOffset: 0 }, // Long 
  { scale: 0.7, colliderArgs: [0.4, 0.8, 0.4] as [number, number, number], yOffset: 0.8 / 2, modelZOffset: 0 }, // Medium
  { scale: 0.7, colliderArgs: [0.4, 0.6, 0.4] as [number, number, number], yOffset: 0.6 / 2, modelZOffset: 0 }, // Short 
  // Rocks (Indices 3, 4) - Corrected yOffset 
  { scale: 0.1, colliderArgs: [0.5, 0.4, 0.5] as [number, number, number], yOffset: 0.4 / 2, modelZOffset: 0 }, // Rock_01 
  { scale: 0.1, colliderArgs: [0.4, 0.4, 0.4] as [number, number, number], yOffset: 0.4 / 2, modelZOffset: 0 }  // Rock_02
];

// Preload models at module level
useGLTF.preload('/models/Cactus_long.glb');
useGLTF.preload('/models/Cactus_medium.glb');
useGLTF.preload('/models/Cactus_short.glb');
useGLTF.preload('/models/Rock_01.glb');
useGLTF.preload('/models/Rock_02.glb');

type Obstacle = {
  active: boolean;
  lane: number;
  z: number;
  patternId: number | null;
  modelIndex: number; // Index for the model to use
};

// Pattern helpers
type Pattern = { type: 'lanes' | 'offset' | 'wide', lanes?: boolean[], offsetX?: number, wideX?: number };
function targetedPattern(camelX: number): Pattern {
  // Map camelX to nearest lane or offset
  // If camelX is close to a lane, block that lane. If between, block the gap.
  const laneThreshold = 1.5; // How close to a lane counts as "in lane"
  let closestLaneIdx = 0;
  let minLaneDist = Math.abs(camelX - LANES[0]);
  for (let i = 1; i < LANES.length; i++) {
    const d = Math.abs(camelX - LANES[i]);
    if (d < minLaneDist) {
      minLaneDist = d;
      closestLaneIdx = i;
    }
  }
  // Check if camel is in a lane or between lanes
  if (minLaneDist < laneThreshold) {
    // In a lane: block that lane, much higher chance to block more
    const r = Math.random();
    // Wide obstacles and block-all-but-one are much more likely
    if (r < 0.40) {
      // Wide obstacle covering camel's lane and neighbor
      if (closestLaneIdx === 0) return { type: 'wide', wideX: -2 };
      if (closestLaneIdx === 2) return { type: 'wide', wideX: 2 };
      // Center lane: randomly pick left or right
      return { type: 'wide', wideX: r < 0.15 ? -2 : 2 };
    }
    // Block all but one lane (force dodge) is also more likely
    const lanes = [false, false, false];
    lanes[closestLaneIdx] = true;
    if (Math.random() < 0.7) {
      // Block all but one lane (force dodge)
      const open = Math.floor(Math.random() * 3);
      for (let i = 0; i < 3; i++) lanes[i] = i !== open;
    }
    return { type: 'lanes', lanes };
  } else {
    // Between lanes: spawn offset obstacle at nearest offset
    let closestOffset = OFFSETS[0];
    let minOffsetDist = Math.abs(camelX - OFFSETS[0]);
    for (let i = 1; i < OFFSETS.length; i++) {
      const d = Math.abs(camelX - OFFSETS[i]);
      if (d < minOffsetDist) {
        minOffsetDist = d;
        closestOffset = OFFSETS[i];
      }
    }
    // Wide obstacles more likely between lanes
    if (Math.random() < 0.40) {
      return { type: 'wide', wideX: closestOffset };
    }
    return { type: 'offset', offsetX: closestOffset };
  }
}



// --- ObstacleInstance Component --- 
interface ObstacleInstanceProps {
  model: any; 
  scale: number;
  colliderArgs: [number, number, number];
  yOffset: number;
  modelZOffset: number;
  positionX: number;
  positionZ: number;
  obstacleId: string | number; 
  modelName: string;
  showColliders?: boolean;
}

const ObstacleInstance: React.FC<ObstacleInstanceProps> = ({ 
  model, scale, colliderArgs, yOffset, modelZOffset, positionX, positionZ, obstacleId, modelName, showColliders
}) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);
  const logTimer = useRef(0);
  const tempVector = useMemo(() => new THREE.Vector3(), []); // Reusable vector

  // Diagnostic: log model and scene info
  useEffect(() => {
    if (model) {
      console.log(`[ObstacleInstance] Rendering obstacleId=${obstacleId}, modelName=${modelName}`);
      console.log('  model:', model);
      console.log('  model.scene:', model.scene);
      if (model.scene && model.scene.children) {
        console.log('  model.scene.children:', model.scene.children);
      }
    }
  }, [model, obstacleId, modelName]);

  useFrame((state, delta) => {
    // Log positions periodically (e.g., every 2 seconds) to avoid spamming console
    logTimer.current += delta;
    if (logTimer.current > 2.0) {
      logTimer.current = 0;
      if (rigidBodyRef.current && groupRef.current) {
        const bodyPos = rigidBodyRef.current.translation();
        const modelWorldPos = groupRef.current.getWorldPosition(tempVector);
        // Include modelName in the log
        // console.log(`Obstacle [${obstacleId}] ${modelName}: BodyPos: (${bodyPos.x.toFixed(2)}, ${bodyPos.y.toFixed(2)}, ${bodyPos.z.toFixed(2)}), ModelPos: (${modelWorldPos.x.toFixed(2)}, ${modelWorldPos.y.toFixed(2)}, ${modelWorldPos.z.toFixed(2)})`);
      }
    }
  });

  // Add check for valid model scene data before rendering primitive
  if (!model?.scene) {
    console.error(`ObstacleInstance [${obstacleId}] ${modelName}: Cannot render primitive, model.scene is invalid!`, model);
    // Do NOT render collider if model is missing (prevents ghost colliders)
    return null;
  }

  // If the model's scene has no children, render a placeholder red box
  const hasChildren = model.scene && model.scene.children && model.scene.children.length > 0;

  return (
    <RigidBody 
      ref={rigidBodyRef}
      type="fixed" 
      userData={{ type: 'obstacle' }} 
      position={[positionX, yOffset, positionZ]} // Set initial position
    >
      {/* Group to hold the model and allow getting world position */}
      <group ref={groupRef} position={[0, 0, modelZOffset]}>  
        {hasChildren ? (
          <primitive 
            object={model.scene.clone()} 
            scale={scale} 
            position={[0,0,0]} 
          />
        ) : (
          <mesh position={[0, 0, 0]} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="red" wireframe={false} opacity={0.8} transparent />
          </mesh>
        )}
        {/* Collider and debug visuals inside model group */}
        <CuboidCollider args={colliderArgs} />
        {/* Debug visualization */}
        {showColliders && (
          <>  
            <mesh position={[0, 0, 0]}> 
              <boxGeometry args={colliderArgs} />
              <meshBasicMaterial color="blue" wireframe transparent opacity={0.5} /> 
            </mesh>
            <Billboard position={[0, colliderArgs[1] + 0.2, 0]}>  
              <Text
                fontSize={0.5}
                color="yellow"
                anchorX="center"
                anchorY="bottom"
              >
                {modelName.split('/').pop()}
              </Text>
            </Billboard>
          </>
        )}
      </group>
    </RigidBody>
  );
};
// --- End ObstacleInstance Component ---

const Obstacles: React.FC<ObstaclesProps> = ({ status, camelX, showColliders }) => {
  const { speed } = useGameContext();
  
  // Load models
  const modelData = OBSTACLE_MODELS.map(path => useGLTF(path));
  const models = useMemo(() => modelData, [modelData]);

  const [obstacles, setObstacles] = useState<Obstacle[]>(() =>
    Array.from({ length: OBSTACLE_POOL_SIZE }, () => ({ 
      active: false, 
      lane: 0, 
      z: 0, 
      patternId: null, 
      modelIndex: 0 // Default index
    }))
  );
  const obstaclesRef = useRef(obstacles);
  obstaclesRef.current = obstacles;
  const lastPatternZ = useRef(-40);
  const nextPatternId = useRef(1);

  // Reset all obstacles on game reset and pre-populate
  useEffect(() => {
    if (status === "ready") {
      // console.log("[Obstacles] Resetting and pre-populating for ready state...");
      const initialObstacles = Array.from({ length: OBSTACLE_POOL_SIZE }, (_, i) => ({ 
        active: false, 
        lane: 0, 
        z: 0, 
        patternId: -(i+1), // Use negative patternId for initial to avoid key conflicts
        modelIndex: 0 
      }));
      
      const initialZ = -40; // Where the pre-population starts spawning FROM
      const numToPrepopulate = Math.min(8, OBSTACLE_POOL_SIZE); // Pre-populate up to 8 obstacles
      const averageGap = MIN_PATTERN_GAP + MAX_ADDITIONAL_GAP / 2;
      let finalZ = initialZ;

      for(let i = 0; i < numToPrepopulate; i++) {
          const patternZ = initialZ - i * averageGap; // Space them out
          // Use camelX = 0 for initial pattern targeting - simple placement
          const pattern = targetedPattern(0); 
          const modelIndex = Math.floor(Math.random() * models.length);
          let lane = 0;
          // Basic placement based on pattern type for variety
          if (pattern.type === 'lanes' && pattern.lanes) {
              const possibleLanes = LANES.filter((_, idx) => pattern.lanes![idx]);
              lane = possibleLanes.length > 0 ? possibleLanes[Math.floor(Math.random() * possibleLanes.length)] : 0;
          } else if (pattern.type === 'offset' && typeof pattern.offsetX === 'number') {
              lane = pattern.offsetX;
          } else if (pattern.type === 'wide' && typeof pattern.wideX === 'number') {
              lane = pattern.wideX; // Place the 'center' of the wide pattern
          } else {
              lane = LANES[Math.floor(Math.random() * LANES.length)]; // Fallback random lane
          }

          initialObstacles[i] = {
              active: true,
              lane: lane,
              z: patternZ,
              patternId: -(i + 1), // Keep unique negative IDs
              modelIndex: modelIndex
          };
          finalZ = patternZ; // Track the Z of the last placed obstacle
      }

      // console.log(`[Obstacles] Pre-populated ${numToPrepopulate} obstacles up to Z: ${finalZ.toFixed(2)}`);
      setObstacles(initialObstacles);
      lastPatternZ.current = finalZ; // Ensure useFrame continues spawning after this point
      nextPatternId.current = numToPrepopulate + 1; // Start subsequent IDs correctly
    }
  }, [status, models.length]); // Add models.length dependency

  useFrame((state, delta) => {
    if (status === "gameOver" || status === "ready" || speed === 0) return;

    const deltaZ = speed * delta;

    setObstacles((prev) => {
      let updated = prev.map((obs) => {
        if (!obs.active) return obs;

        // 1. Move obstacle forward
        const newZ = obs.z + deltaZ;

        // 2. Check for recycling
        if (newZ > OBSTACLE_RECYCLE_Z_THRESHOLD) {
          // When recycling, set active: false and modelIndex: -1
          return { ...obs, active: false, modelIndex: -1, patternId: null };
        }

        // Keep updated position if not recycled
        return { ...obs, z: newZ };
      });

      // --- Spawning Logic --- 
      // Find the Z position of the obstacle farthest away (most negative Z)
      let farthestAwayZ = updated.reduce((min, obs) => (obs.active && obs.z < min ? obs.z : min), 0);
      if (farthestAwayZ === 0) farthestAwayZ = lastPatternZ.current; // Initial spawn or if all inactive

      // Always keep obstacles up to OBSTACLE_SPAWN_AHEAD_Z units ahead
      let spawned = 0;
      while (farthestAwayZ > OBSTACLE_SPAWN_AHEAD_Z && spawned < 5) {
        const gauntlet = Math.random() < 0.18;
        const gap = gauntlet ? (4 + Math.random() * 3) : (MIN_PATTERN_GAP + Math.random() * MAX_ADDITIONAL_GAP);
        const patternZ = farthestAwayZ - gap; // Spawn further into negative Z

        // Pattern selection should not depend on absolute distance
        const pattern = targetedPattern(camelX);
        const patternId = nextPatternId.current++;

        // --- Spawn obstacles for pattern --- 
        const spawnObstacle = (lane: number, zPos: number) => {
            const idx = updated.findIndex((o) => !o.active);
            if (idx === -1) return false; // Pool full
            // Only assign a valid modelIndex
            let validIndices = models.map((_, i) => i).filter(i => i >= 0 && i < models.length && i < MODEL_PROPERTIES.length);
            if (validIndices.length === 0) return false;
            const modelIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
            updated[idx] = { active: true, lane, z: zPos, patternId, modelIndex };
            return true;
        }

        if (pattern.type === 'lanes' && pattern.lanes) {
          let spawnedInPattern = 0;
          for (let laneIdx = 0; laneIdx < 3; laneIdx++) {
            if (!pattern.lanes[laneIdx]) continue;
            if (!spawnObstacle(LANES[laneIdx], patternZ)) break; // Stop if pool full
            spawnedInPattern++;
          }
          if (spawnedInPattern === 0) break; // Break outer loop if pool was full
        } else if (pattern.type === 'offset' && typeof pattern.offsetX === 'number') {
            if (!spawnObstacle(pattern.offsetX, patternZ)) break; // Stop if pool full
        } else if (pattern.type === 'wide' && typeof pattern.wideX === 'number') {
            let spawnedInPattern = 0;
            for (let dx of [-1, 0, 1]) { // Assuming wide means 3 adjacent?
              if (!spawnObstacle(pattern.wideX + dx * (LANE_WIDTH/2.5), patternZ)) break; // Adjust spacing for wide?
              spawnedInPattern++;
              if (spawnedInPattern >= 3) break; // Limit wide spawn if needed
            }
             if (spawnedInPattern === 0) break; // Break outer loop if pool was full
        }
        lastPatternZ.current = patternZ; // Update the last spawned Z
        farthestAwayZ = patternZ; // Continue spawning relative to the new farthest
        spawned++;
      }
      return updated;
    });
  });

  return (
    <>
      {obstacles.map((obs, i) => {
        const isValidModelIndex = obs.modelIndex >= 0 && obs.modelIndex < models.length && obs.modelIndex < MODEL_PROPERTIES.length;
        const selectedModel = isValidModelIndex ? models[obs.modelIndex] : null;
        const modelProps = isValidModelIndex ? MODEL_PROPERTIES[obs.modelIndex] : null;
        const modelName = isValidModelIndex ? OBSTACLE_MODELS[obs.modelIndex] : null;
        const shouldRender = obs.active && isValidModelIndex && selectedModel && modelProps && modelName;
        if (!shouldRender) {
          console.warn('[Obstacles] Skipping obstacle:', {
            i,
            obs,
            isValidModelIndex,
            hasModel: !!selectedModel,
            hasProps: !!modelProps,
            hasName: !!modelName
          });
          return null;
        }
        const key = `${obs.patternId}-${i}`;
        return (
          <ObstacleInstance 
            key={key} 
            obstacleId={key} 
            model={selectedModel}
            scale={modelProps.scale}
            colliderArgs={modelProps.colliderArgs}
            yOffset={modelProps.yOffset}
            modelZOffset={modelProps.modelZOffset}
            positionX={obs.lane} 
            positionZ={obs.z}    
            modelName={modelName}
            showColliders={showColliders}
          />
        );
      })}
    </>
  );
};

export default Obstacles; 