"use client";
import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo, PropsWithChildren, ReactElement } from "react";
import * as THREE from 'three'; // Import THREE
import { RigidBody, RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useControls } from "../../hooks/useControls";
import { useGameContext } from "../../context/GameContext";
import { useGLTF, useAnimations } from '@react-three/drei'; // Add useAnimations
import CamelDust from './CamelDust'; // Import CamelDust for type guard
import { useLoopingAudio } from '../../hooks/useLoopingAudio'; // Import the audio hook
import { useOneShotAudio } from '../../hooks/useOneShotAudio'; // Import the one-shot audio hook


const TURN_SPEED = 6; // Kept for reference, but not used for setLinvel anymore
const JUMP_FORCE = 120; 
const MOVE_FORCE = 450; // Increased force applied for sideways movement
const MAX_SIDE_VEL = 5; // Maximum sideways velocity

// Add showColliders to props
interface CamelProps {
  showColliders?: boolean;
}

export interface CamelHandle {
  getPosition: () => { x: number; y: number; z: number } | null;
  resetPosition: () => void;
  keepZAtZero: () => void;
  isGrounded: () => boolean;
}

interface CamelWithChildrenProps extends CamelProps {
  children?: ReactElement<any> | null;
}

const Camel = forwardRef<CamelHandle, CamelWithChildrenProps>(({ showColliders, children }, ref) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const controls = useControls();
  const isJumping = useRef(false);
  const lastX = useRef(0); // Track last X position for interpolation
  const lastCollisionTime = useRef(0); // Prevent multiple collisions with same obstacle
  const lastJumpTime = useRef(0);
  const { setDistance, collisions, setCollisions, setStatus, status } = useGameContext();
  const groupRef = useRef<THREE.Group>(null); // Ref for the group containing the model

  // Load the camel model and animations
  // Model: https://sketchfab.com/3d-models/camel-99af7daa5baf450ea7b809937937e6d5 (by eb78, CC-BY)
  const { scene, animations } = useGLTF('/models/camel.glb'); // Extract animations
  // Compute bounding box to align mesh bottom to body origin
  const modelOffsetY = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return -box.min.y;
  }, [scene]);

  // Get animation actions
  const { actions } = useAnimations(animations, groupRef);

  // Reset the camel's position, velocity, and internal state
  const doResetPosition = () => {
    if (rigidBody.current) {
      // Place body origin at ground level
      rigidBody.current.setTranslation({ x: 0, y: 0, z: 0 }, true);
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      lastX.current = 0;
      lastCollisionTime.current = 0;
    }
  };

  useImperativeHandle(ref, () => ({
    getPosition: () => {
      if (!rigidBody.current) return null;
      const pos = rigidBody.current.translation();
      return { x: pos.x, y: pos.y, z: pos.z };
    },
    resetPosition: () => {
      doResetPosition();
    },
    keepZAtZero: () => {
      if (rigidBody.current && status === "playing") {
        const pos = rigidBody.current.translation();
        // If the camel falls too far below the ground, reset its Y position
        if (pos.y < -5) {
          rigidBody.current.setTranslation({ x: pos.x, y: 1, z: 0 }, true);
          const vel = rigidBody.current.linvel();
          rigidBody.current.setLinvel({ x: vel.x, y: 0, z: vel.z }, true);
          return;
        }
        // Normal Z maintenance
        rigidBody.current.setTranslation({ x: pos.x, y: pos.y, z: 0 }, true);
        const vel = rigidBody.current.linvel();
        rigidBody.current.setLinvel({ x: vel.x, y: vel.y, z: 0 }, true);
        const ang = rigidBody.current.angvel();
        rigidBody.current.setAngvel({ x: ang.x, y: ang.y, z: 0 }, true);
      }
    },
    isGrounded: () => {
      if (!rigidBody.current) return false;
      const pos = rigidBody.current.translation();
      const vel = rigidBody.current.linvel();
      // Consider camel grounded if near ground and not moving vertically
      return pos.y < 0.6 && Math.abs(vel.y) < 0.05;
    },
  }));

  // Effect to handle game state changes and animations
  useEffect(() => {
    if (status === "gameOver") {
      // When game over, stop all camel movement immediately
      if (rigidBody.current) {
        rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
      // Stop animation
      actions['Armature|WalkCycle']?.fadeOut(0.2).stop();
    } else if (status === "playing") {
      // Start animation if playing
      const walkAction = actions['Armature|WalkCycle'];
      if (walkAction) {
        walkAction.timeScale = 5; // Speed up walk to simulate run
        walkAction.reset().fadeIn(0.2).play();
      }
    } else {
        // Stop animation if not playing or game over (e.g., ready state)
        actions['Armature|WalkCycle']?.fadeOut(0.2).stop();
    }
  }, [status, actions]); // Depend on status and actions

  // Collision handler with debounce
  const handleCollision = (event: any) => {
    // Ignore collisions if game is not in playing state
    if (status !== "playing") return;

    // Get the other collider
    const other = event.other;
    const userData = other?.rigidBodyObject?.userData;

    // Only handle obstacle collisions
    if (userData && userData.type === 'obstacle') {
      // Debounce collisions - only register once every 500ms
      const now = Date.now();
      if (now - lastCollisionTime.current < 500) return;

      console.log('[Camel] Collision detected:', userData);
      lastCollisionTime.current = now;

      // Update collision count
      const newCollisions = collisions + 1;
      setCollisions(newCollisions);

      // Check if game should end
      if (newCollisions >= 3) {
        console.log('[Camel] Game over triggered by collision');
        // Immediately stop all camel movement on third collision
        if (rigidBody.current) {
          rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
          // Prevent any further physics updates
          rigidBody.current.sleep();
        }
        // Slight delay to allow the collision to register visually
        setTimeout(() => {
          setStatus("gameOver");
        }, 100);
      }
    }
  };

  useFrame((state, delta) => {
    const body = rigidBody.current;
    if (!body) return;

    if (status !== "playing") return;

    const velocity = body.linvel();
    let impulseX = 0;

    // Apply impulse based on controls, respecting max velocity
    if (controls.left && velocity.x > -MAX_SIDE_VEL) {
      impulseX -= MOVE_FORCE * delta;
    }
    if (controls.right && velocity.x < MAX_SIDE_VEL) {
      impulseX += MOVE_FORCE * delta;
    }

    if (impulseX !== 0) {
        body.applyImpulse({ x: impulseX, y: 0, z: 0 }, true);
    }

    // --- Keep Y velocity handling (jump/fall prevention) --- 
    const position = body.translation();
    if (position.y < 0.5 && velocity.y < 0) {
      // Set Y velocity directly ONLY for fall prevention near ground
      body.setLinvel({ x: velocity.x, y: 0.1, z: 0 }, true);
    } 
    // --- We are NOT setting X velocity directly anymore --- 

    // --- Jump logic remains the same --- 
    const now = Date.now();
    if (
      controls.jump &&
      !isJumping.current &&
      Math.abs(velocity.y) < 0.05 &&
      now - lastJumpTime.current > 1000
    ) {
      body.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
      isJumping.current = true;
      lastJumpTime.current = now;
    }
    if (!controls.jump && Math.abs(velocity.y) < 0.05) {
      isJumping.current = false;
    }
  });

  // Track grounded state for children
  const [isGrounded, setIsGrounded] = React.useState(true);
  // Track running state (same as dust logic)
  const isRunning = status === 'playing';

  // Play running sound when running and grounded
  useLoopingAudio('/sounds/camel_run_sand.mp3', isRunning && isGrounded, 0.1);

  useFrame(() => {
    if (rigidBody.current) {
      const pos = rigidBody.current.translation();
      const vel = rigidBody.current.linvel();
      setIsGrounded(pos.y < 0.6 && Math.abs(vel.y) < 0.05);
    }
  });

  return (
    // Physics-enabled camel (now with imported model)
    <RigidBody
      ref={rigidBody}
      position={[0, 0, 0]}
      mass={1}
      restitution={0.2}
      friction={1}
      onCollisionEnter={handleCollision}
      lockRotations={true}
      linearDamping={1.0} // Decreased damping
    >
      {/* Custom collider for camel */}
      <CuboidCollider args={[0.6, 1, 2.7]} position={[0, 1, 0]} />
      
      {/* Conditionally render the debug mesh */}
      {showColliders && (
      <mesh position={[0, 1, 0.2]}>
        <boxGeometry args={[0.7, 2.2, 2]} />
        <meshBasicMaterial color="red" wireframe transparent opacity={0.5} />
      </mesh>
      )}
     
      <group ref={groupRef} position={[0, modelOffsetY, 0]}> {/* Align mesh bottom to body origin */}
        <primitive object={scene} scale={1} />
      </group>
      {/* Clone and inject isGrounded prop into children */}
      {React.Children.map(children, child =>
        React.isValidElement(child) && child.type === CamelDust
          ? React.cloneElement(child as React.ReactElement<any>, { isGrounded })
          : child
      )}
    </RigidBody>
  );
});

// Preload the camel model for performance
useGLTF.preload('/models/camel.glb');

export default Camel; 