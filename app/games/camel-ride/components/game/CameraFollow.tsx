import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef, useEffect } from "react";

interface CameraFollowProps {
  camelRef: React.RefObject<any>;
  lastValidCameraPosition: React.MutableRefObject<THREE.Vector3 | null>;
  lastValidLookAt: React.MutableRefObject<THREE.Vector3 | null>;
  status: string;
}

const CameraFollow: React.FC<CameraFollowProps> = ({ camelRef, lastValidCameraPosition, lastValidLookAt, status }) => {
  const { camera } = useThree();
  const camPos = useRef(new THREE.Vector3(0, 3, 10));
  const lookAt = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    if (status === "gameOver") {
      if (lastValidCameraPosition.current && lastValidLookAt.current) {
        camera.position.copy(lastValidCameraPosition.current);
        camera.lookAt(lastValidLookAt.current);
      }
      return;
    } else if (status !== "playing") {
      return;
    }
    if (!camelRef.current) return;
    const pos = camelRef.current.getPosition();
    if (!pos) return;

    const targetCameraX = pos.x * 0.5;
    const targetCameraY = 3;
    const targetCameraZ = 10;
    const targetCameraPos = new THREE.Vector3(targetCameraX, targetCameraY, targetCameraZ);

    const targetLookAtX = pos.x;
    const targetLookAtY = pos.y + 0.5;
    const targetLookAtZ = 0;
    const targetLookAtPos = new THREE.Vector3(targetLookAtX, targetLookAtY, targetLookAtZ);

    camPos.current.lerp(targetCameraPos, 0.1);
    lookAt.current.lerp(targetLookAtPos, 0.1);

    camera.position.copy(camPos.current);
    camera.lookAt(lookAt.current);

    lastValidCameraPosition.current = camera.position.clone();
    lastValidLookAt.current = lookAt.current.clone();
  });
  return null;
};

export default CameraFollow; 