"use client";
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRapier } from '@react-three/rapier';
import { Ray } from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { useGameContext } from "../../context/GameContext"; // Import game context for speed

// Constants
const SPAWN_FORWARD_DISTANCE = 150;
const SCENERY_SPACING = 7.0; // Average spacing
const RECYCLE_BEHIND_DISTANCE = 50;
const PATH_WIDTH = 10;
const GROUND_WIDTH = 100;
const MIN_X_OFFSET = 4;
const MAX_X_OFFSET = (GROUND_WIDTH / 2) - (PATH_WIDTH / 2) - 4;
const RAY_ORIGIN_Y = 50;
const SCENERY_POOL_SIZE = 50;

// Define state structure for a single scenery item
interface SceneryItemState {
    key: string;
    active: boolean;
    x: number;
    y: number;
    z: number;
    modelIndex: 0 | 1; // 0: bush, 1: palm
    rotationY: number;
    scale: number;
}

// Helper to generate random number in a range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper type guard for THREE.Mesh
function isMesh(node: THREE.Object3D): node is THREE.Mesh {
    return node.type === 'Mesh';
}

// --- SceneryItemInstance Component ---
interface SceneryItemInstanceProps {
    model: any;
    position: [number, number, number];
    rotationY: number;
    scale: number;
}

const SceneryItemInstance: React.FC<SceneryItemInstanceProps> = React.memo(({ model, position, rotationY, scale }) => {
    return (
        <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
            <primitive object={model.scene.clone()} castShadow receiveShadow />
        </group>
    );
});
SceneryItemInstance.displayName = 'SceneryItemInstance';

// --- Main Scenery Component (Refactored) ---
const Scenery: React.FC = () => {
    const { world } = useRapier();
    const { camera } = useThree();
    const { speed, status } = useGameContext(); // Add status
    const frameCount = useRef(0);
    // Accumulator-driven spawning
    const spawnAccumulator = useRef(0);
    const nextSpawnGap = useRef(randomInRange(SCENERY_SPACING * 0.7, SCENERY_SPACING * 1.3));

    // Load models into an array
    const palmAsset = useGLTF('/models/Palm_v1.glb');
    // Compute bounding box min Y to align palm bottom to ground
    const palmBoxMinY = useMemo(() => {
        const box = new THREE.Box3().setFromObject(palmAsset.scene);
        return box.min.y;
    }, [palmAsset.scene]);

    const models = useMemo(() => [palmAsset], [palmAsset]);

    // State pool for scenery items
    const [sceneryItems, setSceneryItems] = useState<SceneryItemState[]>(() =>
        Array.from({ length: SCENERY_POOL_SIZE }, (_, i) => ({
            key: `scenery-init-${i}`,
            active: false,
            x: 0, y: 0, z: 0,
            modelIndex: 0, // Initialize explicitly as 0
            rotationY: 0,
            scale: 1
        }))
    );

    // Ref to track the Z position for spawning
    const lastScenerySpawnZ = useRef(-80); // Initial value before pre-population

    // Raycasting setup remains
    const placementRay = useMemo(() => new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), []);
    const rayOriginVec = useMemo(() => new THREE.Vector3(), []);

    // Pre-populate scenery when game is ready
    useEffect(() => {
        if (status === "ready") {
            // Reset spawn accumulator and gap on game reset
            spawnAccumulator.current = 0;
            nextSpawnGap.current = randomInRange(SCENERY_SPACING * 0.7, SCENERY_SPACING * 1.3);
            console.log("[Scenery] Resetting and pre-populating for ready state...");
            const initialSceneryItems: SceneryItemState[] = Array.from({ length: SCENERY_POOL_SIZE }, (_, i) => ({
                 key: `scenery-init-${i}`,
                 active: false,
                 x: 0, y: 0, z: 0,
                 modelIndex: 0, // Initialize explicitly as 0
                 rotationY: 0,
                 scale: 1
             }));

            const initialZ = -40; // Start pre-pop slightly ahead of obstacles
            const numToPrepopulate = 15; // Pre-populate a decent amount
            let finalZ = initialZ;

            for(let i = 0; i < numToPrepopulate; i++) {
                if (i >= SCENERY_POOL_SIZE) break;

                const itemZ = initialZ - i * SCENERY_SPACING * randomInRange(0.8, 1.2);
                const side = Math.random() < 0.5 ? -1 : 1;
                const spawnX = side * (PATH_WIDTH / 2 + MIN_X_OFFSET + randomInRange(0, MAX_X_OFFSET - MIN_X_OFFSET));
                // Always use palm model
                const modelIndex = 0;
                const rotationY = randomInRange(0, Math.PI * 2);
                const scale = randomInRange(0.8, 1.2);
                const key = `${spawnX.toFixed(2)}-${itemZ.toFixed(2)}-init-${i}`;

                initialSceneryItems[i] = {
                    key,
                    active: true,
                    x: spawnX,
                    y: 0.5,
                    z: itemZ,
                    modelIndex,
                    rotationY,
                    scale,
                };
                finalZ = itemZ;
            }

            console.log(`[Scenery] Pre-populated ${numToPrepopulate} scenery items up to Z: ${finalZ.toFixed(2)}`);
            setSceneryItems(initialSceneryItems);
            lastScenerySpawnZ.current = finalZ; // Update ref for useFrame
        }
    }, [status]); // Depend on status

    // useFrame for movement, recycling, and spawning
    useFrame((state, delta) => {
        frameCount.current++;

        if (status !== "playing" || speed === 0) return;

        const cameraPos = camera.position;
        const deltaZ = speed * delta;
        // Accumulate travel distance for spawning
        spawnAccumulator.current += deltaZ;
        const spawnZ = cameraPos.z - SPAWN_FORWARD_DISTANCE;
        const recycleThresholdZ = cameraPos.z + RECYCLE_BEHIND_DISTANCE;

        setSceneryItems(prevItems => {
            const nextItems = prevItems.slice();
            let itemsChanged = false; // Track if changes occurred

            // 1. Update existing items (Move & Recycle)
            for (let i = 0; i < nextItems.length; i++) {
                if (!nextItems[i].active) continue;
                const newZ = nextItems[i].z + deltaZ;
                if (newZ > recycleThresholdZ) {
                    nextItems[i].active = false;
                    itemsChanged = true;
                } else {
                    nextItems[i].z = newZ;
                }
            }

            // 2. Spawn new items based on travel accumulator
            let spawnAttempts = 0;
            const MAX_SPAWN_ATTEMPTS_PER_FRAME = 10;
            while (spawnAccumulator.current >= nextSpawnGap.current && spawnAttempts < MAX_SPAWN_ATTEMPTS_PER_FRAME) {
                // Deduct the gap and attempt a spawn
                spawnAccumulator.current -= nextSpawnGap.current;
                spawnAttempts++;
                const inactiveIndex = nextItems.findIndex(item => !item.active);
                if (inactiveIndex === -1) break; // Pool is full
                const side = Math.random() < 0.5 ? -1 : 1;
                const spawnX = side * (PATH_WIDTH / 2 + MIN_X_OFFSET + randomInRange(0, MAX_X_OFFSET - MIN_X_OFFSET));
                // Raycast at fixed Z ahead of camera
                rayOriginVec.set(spawnX, RAY_ORIGIN_Y, spawnZ);
                placementRay.origin = rayOriginVec;
                const hit = world.castRay(placementRay, RAY_ORIGIN_Y * 2, true);
                if (hit) {
                    const toi = (hit as any).timeOfImpact;
                    if (toi != null) {
                        const pt = placementRay.pointAt(toi);
                        if (pt) {
                            nextItems[inactiveIndex] = {
                                key: `${spawnX.toFixed(2)}-${spawnZ.toFixed(2)}-${Date.now()}`,
                                active: true,
                                x: pt.x,
                                y: pt.y,
                                z: pt.z,
                                modelIndex: 0,
                                rotationY: randomInRange(0, Math.PI * 2),
                                scale: randomInRange(0.8, 1.2),
                            };
                            itemsChanged = true;
                        }
                    }
                }
                // Choose next random gap
                nextSpawnGap.current = randomInRange(SCENERY_SPACING * 0.7, SCENERY_SPACING * 1.3);
            }

            return nextItems;
        });

    });

    // --- Rendering ---
    // Wait for palm model only
    if (!models[0]?.scene) {
        return null;
    }

    return (
        <>
            {sceneryItems.map(item =>
                item.active && (
                    <SceneryItemInstance
                        key={item.key}
                        model={models[0]}
                        position={[item.x, item.y - (palmBoxMinY * item.scale), item.z]}
                        rotationY={item.rotationY}
                        scale={item.scale}
                    />
                )
            )}
        </>
    );
};

// Keep preloads
useGLTF.preload('/models/Palm_v1.glb');

export default Scenery;