import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";


const NUM_CLOUDS = 7;
const CLOUD_MIN_X = -60;
const CLOUD_MAX_X = 60;
const CLOUD_MIN_Z = -120;
const CLOUD_MAX_Z = 120;
const CLOUD_Y = 12;
const CLOUD_SPEED_MIN = 0.02;
const CLOUD_SPEED_MAX = 0.06;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// Generate initial cloud data
function createClouds() {
  return Array.from({ length: NUM_CLOUDS }, () => ({
    x: randomBetween(CLOUD_MIN_X, CLOUD_MAX_X),
    y: CLOUD_Y + randomBetween(-2, 2),
    z: randomBetween(CLOUD_MIN_Z, CLOUD_MAX_Z),
    speed: randomBetween(CLOUD_SPEED_MIN, CLOUD_SPEED_MAX),
    scale: randomBetween(2.5, 5),
  }));
}

interface CloudsProps {
  status: string;
}

const Clouds: React.FC<CloudsProps> = ({ status }) => {
  const clouds = useRef(createClouds());

  useFrame((state, delta) => {
    if (status !== "playing") return;
    for (const cloud of clouds.current) {
      cloud.x += cloud.speed * delta * 60; // scale for similar visual speed as before
      if (cloud.x > CLOUD_MAX_X + 10) {
        cloud.x = CLOUD_MIN_X - 10;
        cloud.z = randomBetween(CLOUD_MIN_Z, CLOUD_MAX_Z);
        cloud.y = CLOUD_Y + randomBetween(-2, 2);
        cloud.scale = randomBetween(2.5, 5);
        cloud.speed = randomBetween(CLOUD_SPEED_MIN, CLOUD_SPEED_MAX);
      }
    }
  });

  // Show clouds behind the player when not playing, in front when playing
  let visibleClouds = clouds.current;
  if (status === "playing") {
    // Only show clouds in front of the player (z > 0)
    visibleClouds = clouds.current.filter(cloud => cloud.z > 0);
  } else {
    // Only show clouds behind the player (z < 0)
    visibleClouds = clouds.current.filter(cloud => cloud.z < 0);
  }

  return (
    <group>
      {visibleClouds.map((cloud, i) => (
        <group key={i} position={[cloud.x, cloud.y, cloud.z]} scale={[cloud.scale, cloud.scale * 0.6, cloud.scale * 0.8]}>
          {/* Main cloud body */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#f8f8ff" roughness={1} transparent opacity={0.95} />
          </mesh>
          {/* Fluffy bits */}
          <mesh position={[-1.2, 0.2, 0.3]}>
            <sphereGeometry args={[0.7, 12, 12]} />
            <meshStandardMaterial color="#f8f8ff" roughness={1} transparent opacity={0.92} />
          </mesh>
          <mesh position={[1.1, 0.1, -0.2]}>
            <sphereGeometry args={[0.6, 12, 12]} />
            <meshStandardMaterial color="#eaf6ff" roughness={1} transparent opacity={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default Clouds; 