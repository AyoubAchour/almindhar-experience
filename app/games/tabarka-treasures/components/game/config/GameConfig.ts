import Phaser from 'phaser';

export interface GameDimensions {
  width: number;
  height: number;
}

export interface PhysicsConfig {
  gravity: { x: number; y: number };
  debug: boolean;
}

export interface DifficultySettings {
  easy: {
    treasureSpawnDelay: number;
    fishSpawnDelay: number;
    gameTimer: number;
    fishSpeed: number;
    treasureFallSpeed: number;
  };
  medium: {
    treasureSpawnDelay: number;
    fishSpawnDelay: number;
    gameTimer: number;
    fishSpeed: number;
    treasureFallSpeed: number;
  };
  hard: {
    treasureSpawnDelay: number;
    fishSpawnDelay: number;
    gameTimer: number;
    fishSpeed: number;
    treasureFallSpeed: number;
  };
}

export class GameConfig {
  public static readonly DIMENSIONS: GameDimensions = {
    width: 800,
    height: 600
  };

  public static readonly PHYSICS: PhysicsConfig = {
    gravity: { x: 0, y: 0 }, // No gravity for ocean environment
    debug: false // Set to true for collision box debugging
  };

  public static readonly DIFFICULTY_SETTINGS: DifficultySettings = {
    easy: {
      treasureSpawnDelay: 3000,  // 3 seconds between treasures
      fishSpawnDelay: 5000,      // 5 seconds between fish
      gameTimer: 40,             // 40 seconds
      fishSpeed: 80,             // Slower fish
      treasureFallSpeed: 80      // Slower falling treasures
    },
    medium: {
      treasureSpawnDelay: 2500,  // 2.5 seconds between treasures
      fishSpawnDelay: 4000,      // 4 seconds between fish
      gameTimer: 30,             // 30 seconds
      fishSpeed: 100,            // Medium fish speed
      treasureFallSpeed: 100     // Medium falling speed
    },
    hard: {
      treasureSpawnDelay: 2000,  // 2 seconds between treasures
      fishSpawnDelay: 3000,      // 3 seconds between fish
      gameTimer: 20,             // 20 seconds
      fishSpeed: 120,            // Faster fish
      treasureFallSpeed: 120     // Faster falling treasures
    }
  };

  public static readonly PLAYER_CONFIG = {
    speed: 200,                  // Player movement speed
    displaySize: { width: 60, height: 50 },
    collisionSize: { width: 180, height: 60 },
    collisionOffset: { x: 160, y: 200 },
    startPosition: { x: 0.5, y: 0.9 } // Relative to screen dimensions
  };

  public static readonly TREASURE_CONFIG = {
    types: ['star', 'pottery', 'coins', 'tools', 'pearls'],
    displaySize: 45,             // Increased from 35 to 45 (larger treasures)
    collisionSize: 40,           // Increased from 30 to 40 (proportional collision)
    spawnArea: { minX: 0.1, maxX: 0.9 }, // Relative to screen width
    spawnY: -30,
    depth: 1000,                 // High depth to appear above all decorative objects
    points: {
      star: 10,
      pottery: 15,
      coins: 20,
      tools: 25,
      pearls: 30
    }
  };

  public static readonly FISH_CONFIG = {
    types: ['fish1', 'fish2', 'fish3', 'fish4'],
    displaySize: { width: 50, height: 30 },    // Increased from 40x20 to 50x25 (larger fish)
    collisionSize: { width: 90, height: 23 },  // Increased from 35x18 to 45x23 (proportional collision)
    spawnArea: { minY: 0.2, maxY: 0.7 }, // Relative to screen height
    depth: 1000,                               // High depth to appear above all decorative objects
    penalty: 20 // Points lost when hit by fish
  };

  public static readonly AUDIO_CONFIG = {
    enabled: true,
    backgroundMusicVolume: 0.3,
    soundEffectVolume: 0.4,
    assets: {
      backgroundMusic: '/sounds/tbarka-treasures/cultural-bg.mp3',
      treasurePickup: '/sounds/tbarka-treasures/treasure-pickup.mp3',
      fishHit: '/sounds/tbarka-treasures/fish-hit.mp3',
      gameOver: '/sounds/tbarka-treasures/game-over.mp3',
      victory: '/sounds/tbarka-treasures/victory.mp3',
      buttonClick: '/sounds/tbarka-treasures/button-click.mp3'
    }
  };

  public static readonly ENVIRONMENT_CONFIG = {
    ocean: {
      topColor: 0x87CEEB,        // Sky blue
      bottomColor: 0x4682B4,     // Steel blue
      animationSpeed: 8000,      // 8 seconds per cycle
      waveIntensity: 5
    },
    bubbles: {
      ambientSpawnRate: 2000,    // Every 2 seconds
      treasureBubbleEnabled: true,
      assetKey: 'bubble'
    },
    lightRays: {
      rayCount: 2,
      rayWidth: 8,
      rayColor: 0xFFFFAA,        // Light yellow
      rayAlpha: 0.3,
      animationSpeed: 6000,      // 6 seconds per cycle
      segmentCount: 20
    },
    oceanFloor: {
      floorHeight: 80,
      sandColor: 0xF4A460,       // Sandy brown

      // 🏔️ BACKGROUND ROCKS - Large, distant rocks for depth
      backgroundRocks: {
        count: 2,                           // Few large background rocks
        xRange: { min: 100, max: 200 },     // Spread across background
        yOffset: -120,                      // Much higher up (distant background)
        scale: { min: 1.8, max: 2.5 },     // Large size for background
        tintRange: { min: 0x666666, max: 0x888888 }, // Darker/muted for distance
        alpha: 0.7                          // Semi-transparent for depth effect
      },

      // � FOREGROUND ROCKS - Smaller, detailed rocks
      rocks: {
        count: 3,                           // Fewer foreground rocks
        xRange: { min: 30, max: 80 },       // Closer to edges
        yOffset: -15,                       // Just above floor
        scale: { min: 0.3, max: 0.6 },     // Much smaller for foreground detail
        tintRange: { min: 0xAAAAAA, max: 0xDDDDDD } // Brighter for foreground
      },

      // 🌿 BACKGROUND SEAWEED - Tall, distant seaweed for depth
      backgroundSeaweed: {
        count: 4,                           // Few tall background plants
        xRange: { min: 150, max: 250 },     // Background positioning
        yOffset: -80,                       // Higher up for background effect
        scaleX: 1.2,                        // Wider for background presence
        scaleYVariations: [2.0, 2.5, 3.0], // Very tall for background
        tintRange: { min: 0x1a5a1a, max: 0x2d4a2d }, // Darker green for distance
        alpha: 0.6,                         // Semi-transparent for depth
        animation: {
          rotationRange: { min: -0.1, max: 0.1 },    // Subtle movement
          scaleXRange: { min: 1.0, max: 1.3 },       // Gentle swaying
          duration: { min: 4000, max: 6000 },        // Slower, distant movement
          delayRange: { min: 0, max: 3000 }
        }
      },

      // 🌿 FOREGROUND SEAWEED - Smaller, detailed seaweed
      seaweed: {
        count: 6,                           // More foreground plants for detail
        xRange: { min: 20, max: 60 },       // Close to edges
        yOffset: 0,                         // Exactly on floor
        scaleX: 0.4,                        // Much smaller width
        scaleYVariations: [0.3, 0.5, 0.7, 0.9], // Smaller heights for foreground
        tintRange: { min: 0x32CD32, max: 0x90EE90 }, // Brighter green for foreground
        animation: {
          rotationRange: { min: -0.3, max: 0.3 },    // More active movement
          scaleXRange: { min: 0.3, max: 0.5 },       // Detailed swaying
          duration: { min: 1500, max: 3000 },        // Faster movement
          delayRange: { min: 0, max: 1500 }
        }
      },

      // 🪸 CORAL CONFIGURATION - Medium layer decorations
      coral: {
        count: 2,                           // Fewer coral for balance
        xRange: { min: 80, max: 120 },      // Middle layer positioning
        yOffset: -10,                       // Slightly above floor
        scale: { min: 0.4, max: 0.7 },     // Medium size
        tintRange: { min: 0xFF6B6B, max: 0xFF8E8E }, // Bright coral colors
        animation: {
          rotationRange: { min: -0.15, max: 0.15 },  // Moderate swaying
          duration: { min: 3000, max: 5000 }
        }
      },

      // Asset file names (don't change unless you rename files)
      decorationAssets: {
        rocks: ['rock1', 'rock2', 'rock3'],
        coral: ['coral1', 'coral2'],
        seaweed: ['seaweed1', 'seaweed2', 'seaweed3']
      }
    }
  };

  public static readonly UI_CONFIG = {
    fontSize: {
      large: 24,
      medium: 18,
      small: 14,
      title: 28,
      button: 16
    },
    colors: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      accent: '#FFD700',         // Gold
      background: '#000000',
      button: 0x4CAF50,          // Green
      buttonText: '#FFFFFF'
    },
    modal: {
      width: 500,
      height: 350,
      background: 0x1E3A8A,      // Dark blue
      border: 0xFFFFFF,          // White
      overlay: 0x000000          // Black overlay
    }
  };

  public static readonly DATABASE_CONFIG = {
    experienceId: 'tabarka-experience',
    gameId: 'tabarka-treasures'
  };

  public static createPhaserConfig(difficulty: 'easy' | 'medium' | 'hard'): Phaser.Types.Core.GameConfig {
    return {
      type: Phaser.AUTO,
      width: GameConfig.DIMENSIONS.width,
      height: GameConfig.DIMENSIONS.height,
      parent: 'phaser-game',
      backgroundColor: '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: GameConfig.PHYSICS.gravity,
          debug: GameConfig.PHYSICS.debug
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 400,
          height: 300
        },
        max: {
          width: 1200,
          height: 900
        }
      }
    };
  }

  public static getDifficultySettings(difficulty: 'easy' | 'medium' | 'hard') {
    return GameConfig.DIFFICULTY_SETTINGS[difficulty];
  }

  public static getPlayerConfig(screenWidth: number = GameConfig.DIMENSIONS.width, screenHeight: number = GameConfig.DIMENSIONS.height) {
    return {
      ...GameConfig.PLAYER_CONFIG,
      startX: screenWidth * GameConfig.PLAYER_CONFIG.startPosition.x,
      startY: screenHeight * GameConfig.PLAYER_CONFIG.startPosition.y
    };
  }

  public static getTreasureConfig(difficulty: 'easy' | 'medium' | 'hard', screenWidth: number = GameConfig.DIMENSIONS.width, screenHeight: number = GameConfig.DIMENSIONS.height) {
    const difficultySettings = GameConfig.getDifficultySettings(difficulty);
    return {
      ...GameConfig.TREASURE_CONFIG,
      spawnDelay: difficultySettings.treasureSpawnDelay,
      fallSpeed: difficultySettings.treasureFallSpeed,
      spawnAreaX: {
        min: screenWidth * GameConfig.TREASURE_CONFIG.spawnArea.minX,
        max: screenWidth * GameConfig.TREASURE_CONFIG.spawnArea.maxX
      },
      screenWidth: screenWidth,
      screenHeight: screenHeight
    };
  }

  public static getFishConfig(difficulty: 'easy' | 'medium' | 'hard', screenWidth: number = GameConfig.DIMENSIONS.width, screenHeight: number = GameConfig.DIMENSIONS.height) {
    const difficultySettings = GameConfig.getDifficultySettings(difficulty);
    return {
      ...GameConfig.FISH_CONFIG,
      spawnDelay: difficultySettings.fishSpawnDelay,
      speed: difficultySettings.fishSpeed,
      spawnAreaY: {
        min: screenHeight * GameConfig.FISH_CONFIG.spawnArea.minY,
        max: screenHeight * GameConfig.FISH_CONFIG.spawnArea.maxY
      },
      screenWidth: screenWidth,
      screenHeight: screenHeight
    };
  }

  public static getEnvironmentConfig(screenWidth: number = GameConfig.DIMENSIONS.width, screenHeight: number = GameConfig.DIMENSIONS.height) {
    return {
      ...GameConfig.ENVIRONMENT_CONFIG,
      ocean: {
        ...GameConfig.ENVIRONMENT_CONFIG.ocean,
        width: screenWidth,
        height: screenHeight
      },
      bubbles: {
        ...GameConfig.ENVIRONMENT_CONFIG.bubbles,
        screenWidth: screenWidth,
        screenHeight: screenHeight
      },
      lightRays: {
        ...GameConfig.ENVIRONMENT_CONFIG.lightRays,
        screenWidth: screenWidth,
        screenHeight: screenHeight
      },
      oceanFloor: {
        ...GameConfig.ENVIRONMENT_CONFIG.oceanFloor,
        screenWidth: screenWidth,
        screenHeight: screenHeight
      }
    };
  }

  public static getUIConfig(screenWidth: number = GameConfig.DIMENSIONS.width, screenHeight: number = GameConfig.DIMENSIONS.height) {
    return {
      ...GameConfig.UI_CONFIG,
      screenWidth: screenWidth,
      screenHeight: screenHeight
    };
  }
}
