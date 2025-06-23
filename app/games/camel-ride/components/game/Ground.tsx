"use client";
import React, { useMemo, useRef, useEffect } from "react";
import { RigidBody, /*HeightfieldCollider,*/ type HeightfieldArgs, CuboidCollider, TrimeshCollider, type RapierRigidBody } from "@react-three/rapier"; // Import RapierRigidBody type
import * as THREE from 'three';
import { useFrame, extend } from "@react-three/fiber"; // Import useLoader
import { createNoise2D } from 'simplex-noise'; // Import simplex-noise
import { useTexture } from '@react-three/drei'; // Import useTexture
import { useGameContext } from "../../context/GameContext"; // Import context hook

// Extend THREE elements for JSX
extend({ Mesh: THREE.Mesh, MeshStandardMaterial: THREE.MeshStandardMaterial })

// Ground dimensions and segments
const GROUND_WIDTH = 100; // How wide the ground plane is
const GROUND_DEPTH = 100; // How deep the ground plane is (along Z) - Reduced for testing
const WIDTH_SEGMENTS = 20; // Number of segments along X - Reduced for testing
const DEPTH_SEGMENTS = 20; // Number of segments along Z - Reduced for testing

// Noise parameters for dunes
const NOISE_SCALE = 170; // Drastically increased scale for much larger dunes
const NOISE_STRENGTH = 2.5; // Base strength for FBM dunes

// Large Occasional Dune Parameters
const LARGE_DUNE_SCALE = 400; // Very large scale for sporadic features
const LARGE_DUNE_STRENGTH = 12; // Max additional height for these features
const LARGE_DUNE_THRESHOLD = 0.6; // Only add large dunes when base noise > this

// FBM (Layered Noise) Parameters
const FBM_OCTAVES = 4; // Number of noise layers
const FBM_PERSISTENCE = 0.5; // How much detail each subsequent layer adds (0-1)
const FBM_LACUNARITY = 2.0; // How much detail increases each layer (>1)

// Path parameters
const PATH_WIDTH = 10; // Width of the flat central path
const TRANSITION_WIDTH = 5; // Width of the smooth transition zone to dunes

// Create a noise function instance
const noise2D = createNoise2D();


// Z position threshold after which a tile is considered "behind" and needs leapfrogging
const RECYCLE_THRESHOLD = GROUND_DEPTH; // Reset when center is a full depth unit past origin

// Function to generate height data based on noise - ACCEPTS Z offset
const generateHeightData = (zOffset: number): Float32Array => {
  const heights: number[] = [];
  for (let j = 0; j <= DEPTH_SEGMENTS; j++) {
    for (let i = 0; i <= WIDTH_SEGMENTS; i++) {
      const x = (i / WIDTH_SEGMENTS - 0.5) * GROUND_WIDTH;
      const z = (j / DEPTH_SEGMENTS - 0.5) * GROUND_DEPTH + zOffset; // Use world Z

      // FBM Calculation (Base Terrain)
      let totalNoise = 0;
      let amplitude = 1.0;
      let frequency = 1.0;
      let maxValue = 0; // Used for normalization
      for (let octave = 0; octave < FBM_OCTAVES; octave++) {
        const noiseVal = noise2D(x * frequency / NOISE_SCALE, z * frequency / NOISE_SCALE);
        totalNoise += noiseVal * amplitude;
        maxValue += amplitude; // Accumulate max possible amplitude
        amplitude *= FBM_PERSISTENCE;
        frequency *= FBM_LACUNARITY;
      }
      totalNoise /= maxValue; // Normalize FBM noise
      const fbmHeight = totalNoise * NOISE_STRENGTH;

      // Large Occasional Dune Calculation
      const largeScaleNoise = noise2D(x / LARGE_DUNE_SCALE, z / LARGE_DUNE_SCALE);
      let largeDuneAddition = 0;
      if (largeScaleNoise > LARGE_DUNE_THRESHOLD) {
        // Scale the addition based on how far above the threshold the noise is
        // Ensures smooth addition rather than a sharp cutoff
        const intensity = (largeScaleNoise - LARGE_DUNE_THRESHOLD) / (1.0 - LARGE_DUNE_THRESHOLD);
        largeDuneAddition = intensity * LARGE_DUNE_STRENGTH;
    }

      // Combine base terrain with large dunes
      const combinedHeight = fbmHeight + largeDuneAddition;

      // Path Flattening Logic
      const absX = Math.abs(x);
      let effectiveStrength = 1.0; // Start with full strength
      if (absX <= PATH_WIDTH / 2) {
        effectiveStrength = 0; // Completely flat in the center
      } else if (absX <= PATH_WIDTH / 2 + TRANSITION_WIDTH) {
        // Smooth transition from flat path to full height dunes
        const t = (absX - PATH_WIDTH / 2) / TRANSITION_WIDTH;
        effectiveStrength = t; // Linear interpolation of strength (0 to 1)
      }

      // Apply path flattening strength to the combined height
      heights.push(combinedHeight * effectiveStrength);
    }
  }
  if (heights.some(v => !Number.isFinite(v))) {
    console.error("Invalid value generated in heightfield heights array");
    // Return flat array on error to prevent crash
    return new Float32Array((WIDTH_SEGMENTS + 1) * (DEPTH_SEGMENTS + 1)).fill(0);
  }
  return new Float32Array(heights);
};

// Helper function to update mesh geometry vertices
const updateGeometryVertices = (mesh: THREE.Mesh | null, zOffset: number) => {
  if (!mesh || !mesh.geometry) return;

  const newHeights = generateHeightData(zOffset);
  const positions = mesh.geometry.attributes.position.array;

  if (newHeights.length !== positions.length / 3) {
      console.error("Height data length mismatch during geometry update.");
      return; // Prevent applying mismatched data
  }

  for (let i = 0; i < newHeights.length; i++) {
    positions[i * 3 + 1] = newHeights[i]; // Update Y coordinate
  }
  mesh.geometry.attributes.position.needsUpdate = true;
  mesh.geometry.computeVertexNormals(); // Recalculate normals
};

// Define a reusable Ground Tile component
interface GroundTileProps {
  diffuseMap: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  aoMap: THREE.Texture;
  initialZ: number;
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
  meshRef: React.RefObject<THREE.Mesh | null>;
}

const GroundTile: React.FC<GroundTileProps> = React.memo(({ 
  diffuseMap, normalMap, roughnessMap, aoMap, initialZ, rigidBodyRef, meshRef 
}) => {
  // Use a cloned geometry for this specific tile instance
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(
          GROUND_WIDTH, GROUND_DEPTH, WIDTH_SEGMENTS, DEPTH_SEGMENTS
    );
      geom.rotateX(-Math.PI / 2);
      // IMPORTANT: Clone attributes so each tile mesh has its own vertex data instance
      geom.setAttribute('position', geom.attributes.position.clone());
      geom.setAttribute('normal', geom.attributes.normal.clone());
      geom.setAttribute('uv', geom.attributes.uv.clone());
      if (geom.index) {
          geom.setIndex(geom.index.clone());
      }
      return geom;
  }, []); // Create geometry once per tile

  // Update geometry heights on mount
  useEffect(() => {
      updateGeometryVertices(meshRef.current, initialZ);
  }, [initialZ, meshRef]); // Rerun if initialZ changes (shouldn't, but safe)

  // Define path collider dimensions - Drastically reduce height
  const pathColliderHeight = 0.1;
  const pathColliderArgs: [number, number, number] = [PATH_WIDTH / 2, pathColliderHeight, GROUND_DEPTH / 2];

  // Define invisible wall dimensions and properties
  const wallWidth = 0.1;
  const wallHeight = 5.0; // Tall enough to prevent crossing
  const wallArgs: [number, number, number] = [wallWidth / 2, wallHeight / 2, GROUND_DEPTH / 2];
  const leftWallPosition: [number, number, number] = [-PATH_WIDTH / 2 - wallWidth / 2, wallHeight / 2, 0];
  const rightWallPosition: [number, number, number] = [PATH_WIDTH / 2 + wallWidth / 2, wallHeight / 2, 0];

  return (
    <RigidBody 
      ref={rigidBodyRef} 
      type="fixed" 
      userData={{ type: 'ground' }}
      position={[0, 0, initialZ]}
    >
      {/* Add a flat, THINNER collider ONLY for the central path */}
      <CuboidCollider 
        args={pathColliderArgs} 
        position={[0, -pathColliderHeight / 2, 0]} // Position it so top is at y=0
      />
      
      {/* Add invisible walls along the path edges */}
      <CuboidCollider args={wallArgs} position={leftWallPosition} />
      <CuboidCollider args={wallArgs} position={rightWallPosition} />

      {/* Visual mesh still covers the whole area */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow>
        <meshStandardMaterial
          side={THREE.DoubleSide}
          map={diffuseMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          aoMap={aoMap}
          aoMapIntensity={1}
        />
      </mesh>
    </RigidBody>
  );
});
GroundTile.displayName = 'GroundTile'; // Add display name for better debugging

// Main Ground component managing three tiles
const Ground: React.FC = () => {
  const { speed } = useGameContext();
  const rigidBodyA = useRef<RapierRigidBody>(null);
  const rigidBodyB = useRef<RapierRigidBody>(null);
  const rigidBodyC = useRef<RapierRigidBody>(null);
  const meshA = useRef<THREE.Mesh>(null);
  const meshB = useRef<THREE.Mesh>(null);
  const meshC = useRef<THREE.Mesh>(null);
  
  // Add an offset so the ground starts behind the player
  const INITIAL_Z_OFFSET = 30;
  const posA_Z = useRef(-GROUND_DEPTH * 0.5 + INITIAL_Z_OFFSET);
  const posB_Z = useRef(-GROUND_DEPTH * 1.5 + INITIAL_Z_OFFSET);
  const posC_Z = useRef(-GROUND_DEPTH * 2.5 + INITIAL_Z_OFFSET);

  // Load NEW textures using useTexture
  const [diffuseMap, normalMap, roughnessMap, aoMap] = useTexture([
    '/textures/ground_0043_color_2k.jpg',    // New color map
    '/textures/ground_0043_normal_opengl_2k.png', // New normal map (PNG)
    '/textures/ground_0043_roughness_2k.jpg', // New roughness map (JPG)
    '/textures/ground_0043_ao_2k.jpg'       // New AO map
  ]);
  
  // Combine textures for configuration
  const textures = useMemo(() => [diffuseMap, normalMap, roughnessMap, aoMap].filter(t => t) as THREE.Texture[], 
    [diffuseMap, normalMap, roughnessMap, aoMap]); // Include aoMap

  // Configure texture repetition (apply to all loaded textures)
  useMemo(() => {
    textures.forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(9, 9); // Increased repetition for smaller details
      texture.needsUpdate = true;
    });
  }, [textures]);

  useFrame((state, delta) => {
    if (speed === 0 || !rigidBodyA.current || !rigidBodyB.current || !rigidBodyC.current) return;

    const deltaZ = speed * delta;
    // Update positions
    posA_Z.current += deltaZ;
    posB_Z.current += deltaZ;
    posC_Z.current += deltaZ;

    // Check for leapfrogging Tile A
    if (posA_Z.current > RECYCLE_THRESHOLD) {
      console.log(`[Ground] Leapfrogging Tile A`);
      posA_Z.current = posC_Z.current - GROUND_DEPTH; // Move behind the current farthest (C)
      updateGeometryVertices(meshA.current, posA_Z.current);
    }
    // Check for leapfrogging Tile B
    if (posB_Z.current > RECYCLE_THRESHOLD) {
      console.log(`[Ground] Leapfrogging Tile B`);
      posB_Z.current = posA_Z.current - GROUND_DEPTH; // Move behind the current farthest (A)
      updateGeometryVertices(meshB.current, posB_Z.current);
    }
     // Check for leapfrogging Tile C
    if (posC_Z.current > RECYCLE_THRESHOLD) {
      console.log(`[Ground] Leapfrogging Tile C`);
      posC_Z.current = posB_Z.current - GROUND_DEPTH; // Move behind the current farthest (B)
      updateGeometryVertices(meshC.current, posC_Z.current);
    }

    // Set actual physics positions
    rigidBodyA.current.setTranslation({ x: 0, y: 0, z: posA_Z.current }, true);
    rigidBodyB.current.setTranslation({ x: 0, y: 0, z: posB_Z.current }, true);
    rigidBodyC.current.setTranslation({ x: 0, y: 0, z: posC_Z.current }, true);
  });

  return (
    <>
      <GroundTile
        rigidBodyRef={rigidBodyA}
        meshRef={meshA}
        initialZ={posA_Z.current}
        diffuseMap={diffuseMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
      <GroundTile
        rigidBodyRef={rigidBodyB}
        meshRef={meshB}
        initialZ={posB_Z.current}
        diffuseMap={diffuseMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
      <GroundTile
        rigidBodyRef={rigidBodyC}
        meshRef={meshC}
        initialZ={posC_Z.current}
        diffuseMap={diffuseMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </>
  );
};

export default Ground; 