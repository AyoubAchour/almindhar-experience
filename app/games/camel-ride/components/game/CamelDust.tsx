import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import vert from './CamelDust.vert';
import frag from './CamelDust.frag';
import type { CamelHandle } from './Camel';

// Increase number of particles for a denser dust trail
const NUM_PARTICLES = 200;
const DUST_LIFETIME = 1.2;
const FADE_DURATION = 0.5; // seconds

interface CamelDustProps {
  isRunning: boolean;
  isGrounded: boolean;
}

export default function CamelDust({ isRunning, isGrounded }: CamelDustProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useLoader(THREE.TextureLoader, '/textures/dust.png');
  const uTime = useRef(0);
  const [startTimesArray] = useState(() => new Float32Array(NUM_PARTICLES));
  const [fade, setFade] = useState(1); // 1 = fully visible, 0 = invisible
  const fadeRef = useRef(1);
  const fadeTarget = useRef(1);
  const prevGroundedRef = useRef(true); // Track previous grounded state

  // Precompute per-particle attributes
  const { positions, startTimes, offsets } = useMemo(() => {
    const positions = new Float32Array(NUM_PARTICLES * 3);
    const startTimes = new Float32Array(NUM_PARTICLES);
    const offsets = new Float32Array(NUM_PARTICLES * 3);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      positions.set([0, 0, 0], i * 3); // all at origin, moved in shader
      
      // Stagger particle start times throughout the lifetime
      startTimes[i] = Math.random() * DUST_LIFETIME;
      
      // Wider spread for more natural dust trail
      offsets.set([
        (Math.random() - 0.3) * 0.8, // wider x spread
        Math.random() * 0.3,         // higher y spread
        (Math.random() + 0.5) * 0.4  // wider z spread
      ], i * 3);
    }
    return { positions, startTimes, offsets };
  }, []);

  // Keep a reference to startTimes for updates
  useEffect(() => {
    startTimesArray.set(startTimes);
  }, [startTimes, startTimesArray]);

  // Shader material
  const materialRef = useRef<ShaderMaterial>(null);
  
  // Timer for emitting new particles
  const emitTimerRef = useRef(0);

  // Since we're now a child of Camel, always grounded (parent controls visibility)
  useFrame((_, delta) => {
    const grounded = true;
    // Debug log
    // console.log('isRunning:', isRunning, 'grounded:', grounded, 'prevGrounded:', prevGroundedRef.current);

    // Only reset all particle start times when transitioning from grounded to not grounded
    if (prevGroundedRef.current && !grounded) {
      // console.log('Transition: grounded -> not grounded. Resetting all particles.');
      for (let i = 0; i < NUM_PARTICLES; i++) {
        startTimesArray[i] = uTime.current - DUST_LIFETIME - 1;
      }
      if (pointsRef.current) {
        const geometry = pointsRef.current.geometry;
        geometry.setAttribute('aStartTime', new THREE.BufferAttribute(startTimesArray.slice(), 1));
      }
    }
    prevGroundedRef.current = grounded;

    // Determine fade target
    fadeTarget.current = isRunning && grounded ? 1 : 0;
    // Smoothly interpolate fade value
    if (fadeRef.current !== fadeTarget.current) {
      const direction = fadeTarget.current > fadeRef.current ? 1 : -1;
      const fadeStep = delta / FADE_DURATION;
      let nextFade = fadeRef.current + direction * fadeStep;
      if ((direction > 0 && nextFade > fadeTarget.current) || (direction < 0 && nextFade < fadeTarget.current)) {
        nextFade = fadeTarget.current;
      }
      fadeRef.current = nextFade;
      setFade(nextFade);
    }

    // Only emit new particles if running and grounded
    if (isRunning && grounded) {
      uTime.current += delta;
      emitTimerRef.current += delta;
      
      // Every 0.1 seconds, reset a few particles to create continuous emission
      if (emitTimerRef.current > 0.1) {
        emitTimerRef.current = 0;
        
        // Reset 10% of particles each time for continuous emission
        const particlesToReset = Math.floor(NUM_PARTICLES * 0.1);
        for (let i = 0; i < particlesToReset; i++) {
          const idx = Math.floor(Math.random() * NUM_PARTICLES);
          startTimesArray[idx] = uTime.current;
        }
        
        // Update the startTimes buffer attribute
        if (pointsRef.current) {
          const geometry = pointsRef.current.geometry;
          // Create a new buffer attribute with updated startTimes
          geometry.setAttribute('aStartTime', new THREE.BufferAttribute(startTimesArray.slice(), 1));
        }
      }
      
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = uTime.current;
        materialRef.current.uniforms.uLifetime.value = DUST_LIFETIME;
        materialRef.current.uniforms.uEmitterPos.value.set(0, 0, 0);
      }
    } else {
      // Still update emitter position for fade-out
      if (materialRef.current) {
        materialRef.current.uniforms.uEmitterPos.value.set(0, 0, 0);
      }
    }
    // Always update fade uniform
    if (materialRef.current) {
      materialRef.current.uniforms.uFade.value = fadeRef.current;
    }
  });

  return (
    <points ref={pointsRef} visible={isRunning && isGrounded}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={NUM_PARTICLES}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aStartTime"
          count={NUM_PARTICLES}
          array={startTimes}
          itemSize={1}
          args={[startTimes, 1]}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={NUM_PARTICLES}
          array={offsets}
          itemSize={3}
          args={[offsets, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={{
          uTime: { value: 0 },
          uEmitterPos: { value: new THREE.Vector3() },
          uMap: { value: texture },
          uLifetime: { value: DUST_LIFETIME },
          uFade: { value: 1 },
        }}
        transparent
        depthWrite={false}
      />
    </points>
  );
} 