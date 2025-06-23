"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Settings interface for Tabarka Treasures
export interface GameSettings {
  volume: number; // 0-100
  factsEnabled: boolean;
  developerMode: boolean; // New: Developer debugging mode
}

// Default settings
const defaultSettings: GameSettings = {
  volume: 70,
  factsEnabled: true,
  developerMode: false, // Default to false for production
};

// Settings context type
interface SettingsContextType extends GameSettings {
  setVolume: (volume: number) => void;
  setFactsEnabled: (enabled: boolean) => void;
  setDeveloperMode: (enabled: boolean) => void; // New: Developer mode setter
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'tabarka-treasures-settings';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [volume, setVolumeState] = useState(defaultSettings.volume);
  const [factsEnabled, setFactsEnabledState] = useState(defaultSettings.factsEnabled);
  const [developerMode, setDeveloperModeState] = useState(defaultSettings.developerMode);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed: GameSettings = JSON.parse(savedSettings);
        const loadedVolume = parsed.volume ?? defaultSettings.volume;
        const loadedFactsEnabled = parsed.factsEnabled ?? defaultSettings.factsEnabled;
        const loadedDeveloperMode = parsed.developerMode ?? defaultSettings.developerMode;

        setVolumeState(loadedVolume);
        setFactsEnabledState(loadedFactsEnabled);
        setDeveloperModeState(loadedDeveloperMode);

        // Emit initial settings to any existing game instances
        window.dispatchEvent(new CustomEvent('setMasterVolume', {
          detail: { volume: loadedVolume / 100 }
        }));
        window.dispatchEvent(new CustomEvent('setFactsEnabled', {
          detail: { enabled: loadedFactsEnabled }
        }));
        window.dispatchEvent(new CustomEvent('setDeveloperMode', {
          detail: { enabled: loadedDeveloperMode }
        }));

        console.log(`Initial settings loaded: volume=${loadedVolume}, factsEnabled=${loadedFactsEnabled}, developerMode=${loadedDeveloperMode}`);
      } else {
        // Emit default settings if no saved settings exist
        window.dispatchEvent(new CustomEvent('setMasterVolume', {
          detail: { volume: defaultSettings.volume / 100 }
        }));
        window.dispatchEvent(new CustomEvent('setFactsEnabled', {
          detail: { enabled: defaultSettings.factsEnabled }
        }));
        window.dispatchEvent(new CustomEvent('setDeveloperMode', {
          detail: { enabled: defaultSettings.developerMode }
        }));

        console.log('No saved settings found, using defaults');
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = (newSettings: GameSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    setVolumeState(clampedVolume);
    const newSettings = { volume: clampedVolume, factsEnabled, developerMode };
    saveSettings(newSettings);

    // Emit event for Phaser game
    window.dispatchEvent(new CustomEvent('setMasterVolume', {
      detail: { volume: clampedVolume / 100 } // Convert to 0-1 range
    }));
  };

  const setFactsEnabled = (enabled: boolean) => {
    setFactsEnabledState(enabled);
    const newSettings = { volume, factsEnabled: enabled, developerMode };
    saveSettings(newSettings);

    // Emit event for Phaser game
    window.dispatchEvent(new CustomEvent('setFactsEnabled', {
      detail: { enabled }
    }));
  };

  const setDeveloperMode = (enabled: boolean) => {
    setDeveloperModeState(enabled);
    const newSettings = { volume, factsEnabled, developerMode: enabled };
    saveSettings(newSettings);

    // Emit event for Phaser game
    window.dispatchEvent(new CustomEvent('setDeveloperMode', {
      detail: { enabled }
    }));
  };

  const resetSettings = () => {
    setVolumeState(defaultSettings.volume);
    setFactsEnabledState(defaultSettings.factsEnabled);
    setDeveloperModeState(defaultSettings.developerMode);
    saveSettings(defaultSettings);

    // Emit reset events
    window.dispatchEvent(new CustomEvent('setMasterVolume', {
      detail: { volume: defaultSettings.volume / 100 }
    }));
    window.dispatchEvent(new CustomEvent('setFactsEnabled', {
      detail: { enabled: defaultSettings.factsEnabled }
    }));
    window.dispatchEvent(new CustomEvent('setDeveloperMode', {
      detail: { enabled: defaultSettings.developerMode }
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        volume,
        factsEnabled,
        developerMode,
        setVolume,
        setFactsEnabled,
        setDeveloperMode,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
