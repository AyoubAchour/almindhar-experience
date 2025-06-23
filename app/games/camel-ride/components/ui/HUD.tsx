"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Settings } from 'lucide-react';

interface HUDProps {
  distance?: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  fps?: number;
  status?: string;
  isFreeRoam?: boolean;
  onToggleFreeRoam?: () => void;
  showColliders?: boolean;
  onToggleShowColliders?: () => void;
}

const HUD: React.FC<HUDProps> = ({
  distance: propDistance,
  containerRef,
  fps,
  status: propStatus,
  isFreeRoam,
  onToggleFreeRoam,
  showColliders,
  onToggleShowColliders
}) => {
  const { score, distance: contextDistance, status: contextStatus, collisions } = useGameContext();
  const distance = propDistance !== undefined ? propDistance : contextDistance;
  const status = propStatus !== undefined ? propStatus : contextStatus;

  // Fullscreen toggle
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleFullscreen = () => {
    if (!containerRef?.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg px-4 py-2 shadow text-gray-800 dark:text-gray-100 flex items-center gap-x-6 text-sm sm:text-lg font-semibold z-10">
        <span>Score : {score}</span>
        <span>Distance : {distance}m</span>
        <span>Collisions : {collisions}</span>
        <span>Statut : {status}</span>
        <span>FPS : {status === "playing" && !isFreeRoam ? fps : "--"}</span>
        {/* Settings Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="ml-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Paramètres"
            >
              <Settings className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            sideOffset={5}
            align="end"
            className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 space-y-1 w-48"
          >
            <DropdownMenu.Item
              onSelect={handleFullscreen}
              className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {isFullscreen ? "Quitter Plein Écran" : "Plein Écran"}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={onToggleFreeRoam}
              disabled={status === 'gameOver'}
              className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFreeRoam ? "Quitter Libre" : "Mode Libre"}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={onToggleShowColliders}
              className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {showColliders ? "Cacher Colliders" : "Montrer Colliders"}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      {status === "ready" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-blue-100/90 backdrop-blur-sm rounded px-4 py-2 shadow text-blue-800 text-lg font-semibold">
            Appuyez sur Entrée pour commencer
          </div>
        </div>
      )}
    </>
  );
};

export default HUD; 