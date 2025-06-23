import Phaser from 'phaser';

// Import all our modular systems
import { PlayerSystem } from './systems/PlayerSystem';
import { TreasureSystem } from './systems/TreasureSystem';
import { FishSystem } from './systems/FishSystem';
import { AudioSystem } from './systems/AudioSystem';
import { ScoreSystem } from './systems/ScoreSystem';
import { DatabaseSystem } from './systems/DatabaseSystem';

// Import environment systems
import { OceanBackground } from './environment/OceanBackground';
import { BubbleSystem } from './environment/BubbleSystem';
import { LightRaySystem } from './environment/LightRaySystem';
import { OceanFloor } from './environment/OceanFloor';

// Import UI systems
import { GameUI } from './ui/GameUI';
import { GameOverScreen } from './ui/GameOverScreen';

// Import configuration
import { GameConfig } from './config/GameConfig';
import { AssetLoader } from './config/AssetLoader';
import { CulturalFacts } from './config/CulturalFacts';
import { translations } from './config/Translations';

export class GameScene extends Phaser.Scene {
  // System references
  private playerSystem!: PlayerSystem;
  private treasureSystem!: TreasureSystem;
  private fishSystem!: FishSystem;
  private audioSystem!: AudioSystem;
  private scoreSystem!: ScoreSystem;
  private databaseSystem!: DatabaseSystem;

  // Environment systems
  private oceanBackground!: OceanBackground;
  private bubbleSystem!: BubbleSystem;
  private lightRaySystem!: LightRaySystem;
  private oceanFloor!: OceanFloor;

  // UI systems
  private gameUI!: GameUI;
  private gameOverScreen!: GameOverScreen;

  // Asset loader
  private assetLoader!: AssetLoader;

  // Game configuration
  private difficulty: 'easy' | 'medium' | 'hard';
  private experienceId: string;
  private onRewardEarned: (reward: any) => void;
  private onBackToModeSelection: () => void;
  private onGameEnd?: (finalScore: number, timeRemaining?: number, gameCompleted?: boolean) => Promise<void>;

  // Game state
  private gamePaused: boolean = false;
  private spacebarPaused: boolean = false; // Track spacebar-initiated pause separately

  constructor(experienceId: string, difficulty: 'easy' | 'medium' | 'hard', onRewardEarned: (reward: any) => void, onBackToModeSelection: () => void, onGameEnd?: (finalScore: number, timeRemaining?: number, gameCompleted?: boolean) => Promise<void>) {
    super({ key: 'TabarkaTreasuresGameScene' });
    
    this.experienceId = experienceId;
    this.difficulty = difficulty;
    this.onRewardEarned = onRewardEarned;
    this.onBackToModeSelection = onBackToModeSelection;
    this.onGameEnd = onGameEnd;

    // Setup window event listeners for settings
    this.setupWindowEventListeners();
  }

  private setupWindowEventListeners(): void {
    const handlePauseGame = () => {
      this.pauseGame();
    };

    const handleResumeGame = () => {
      this.resumeGame();
    };

    const handlePauseGameForSettings = () => {
      this.pauseGameForSettings();
    };

    const handleResumeGameFromSettings = () => {
      this.resumeGameFromSettings();
    };

    const handleDeveloperModeChange = (event: CustomEvent) => {
      const enabled = event.detail.enabled;
      console.log(`Developer mode ${enabled ? 'enabled' : 'disabled'}`);
      
      // Toggle Phaser's built-in physics debug rendering
      if (this.physics && this.physics.world) {
        this.physics.world.debugGraphic?.setVisible(enabled);
        if (enabled && !this.physics.world.debugGraphic) {
          this.physics.world.createDebugGraphic();
        }
      }
    };

    window.addEventListener('pauseGame', handlePauseGame);
    window.addEventListener('resumeGame', handleResumeGame);
    window.addEventListener('pauseGameForSettings', handlePauseGameForSettings);
    window.addEventListener('resumeGameFromSettings', handleResumeGameFromSettings);
    window.addEventListener('setDeveloperMode', handleDeveloperModeChange as EventListener);

    // Store references for cleanup
    (this as any).handlePauseGame = handlePauseGame;
    (this as any).handleResumeGame = handleResumeGame;
    (this as any).handlePauseGameForSettings = handlePauseGameForSettings;
    (this as any).handleResumeGameFromSettings = handleResumeGameFromSettings;
    (this as any).handleDeveloperModeChange = handleDeveloperModeChange;
  }

  private pauseGame(): void {
    this.gamePaused = true;
    // Pause physics world
    if (this.physics && this.physics.world) {
      this.physics.world.pause();
    }
    this.audioSystem?.stopBackgroundMusic();
    this.events.emit('gamePaused');
    console.log('Game paused by settings menu');
  }

  private resumeGame(): void {
    this.gamePaused = false;
    // Resume physics world
    if (this.physics && this.physics.world) {
      this.physics.world.resume();
    }
    this.audioSystem?.playBackgroundMusic();
    this.events.emit('gameResumed');
    console.log('Game resumed from settings menu');
  }

  private pauseGameForSettings(): void {
    // Only set gamePaused if not already paused by spacebar
    if (!this.spacebarPaused) {
      this.gamePaused = true;
      // Pause physics world
      if (this.physics && this.physics.world) {
        this.physics.world.pause();
      }
      // Emit pause event only if we're actually pausing
      this.events.emit('gamePaused');
    }
    // Keep background music playing for volume adjustment regardless
    console.log(translations.console.pausedForSettings);
  }

  private resumeGameFromSettings(): void {
    // Only resume if not paused by spacebar
    if (!this.spacebarPaused) {
      this.gamePaused = false;
      // Resume physics world
      if (this.physics && this.physics.world) {
        this.physics.world.resume();
      }
      // Emit resume event only if we're actually resuming
      this.events.emit('gameResumed');
      console.log(translations.console.resumedFromSettings);
    } else {
      console.log(translations.console.remainsPausedAfterSettings);
    }
    // Music was never stopped, so no need to restart it
  }

  preload() {
    // Initialize and use asset loader
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAllAssets(
      (progress) => {
        console.log(`Loading assets: ${progress.percentage}% (${progress.filesLoaded}/${progress.totalFiles})`);
      },
      () => {
        console.log('All assets loaded successfully');
      }
    );
  }

  create() {
    // Get actual screen dimensions from the game canvas
    const screenWidth = this.scale.gameSize.width;
    const screenHeight = this.scale.gameSize.height;

    console.log(`Game scene initialized with dimensions: ${screenWidth}x${screenHeight}`);

    // Initialize environment systems first (background layers)
    this.initializeEnvironment(screenWidth, screenHeight);

    // Initialize core game systems
    this.initializeGameSystems(screenWidth, screenHeight);

    // Initialize UI systems
    this.initializeUI(screenWidth, screenHeight);

    // Setup system interactions
    this.setupSystemInteractions();

    // Start the game
    this.startGame();

    // Initialize developer mode state from localStorage after all systems are created
    this.initializeDeveloperModeState();

    // Setup keyboard controls for game pause
    this.setupKeyboardControls();

    console.log('Modular game scene initialized successfully!');
  }

  private initializeEnvironment(screenWidth: number, screenHeight: number): void {
    const envConfig = GameConfig.getEnvironmentConfig(screenWidth, screenHeight);

    // Create ocean background
    this.oceanBackground = new OceanBackground(this, envConfig.ocean);

    // Create light rays
    this.lightRaySystem = new LightRaySystem(this, envConfig.lightRays);

    // Create ocean floor
    this.oceanFloor = new OceanFloor(this, envConfig.oceanFloor);

    // Create bubble system
    this.bubbleSystem = new BubbleSystem(this, {
      screenWidth: envConfig.bubbles.screenWidth,
      screenHeight: envConfig.bubbles.screenHeight,
      ambientBubbleSpawnRate: envConfig.bubbles.ambientSpawnRate,
      treasureBubbleEnabled: envConfig.bubbles.treasureBubbleEnabled,
      bubbleAssetKey: envConfig.bubbles.assetKey
    });
  }

  private initializeGameSystems(screenWidth: number, screenHeight: number): void {
    // Initialize player system
    const playerConfig = GameConfig.getPlayerConfig(screenWidth, screenHeight);
    this.playerSystem = new PlayerSystem(this, {
      startX: playerConfig.startX,
      startY: playerConfig.startY,
      speed: playerConfig.speed,
      assetKey: 'basket',
      displayWidth: playerConfig.displaySize.width,
      displayHeight: playerConfig.displaySize.height,
      collisionWidth: playerConfig.collisionSize.width,
      collisionHeight: playerConfig.collisionSize.height,
      collisionOffsetX: playerConfig.collisionOffset.x,
      collisionOffsetY: playerConfig.collisionOffset.y
    });

    // Initialize treasure system
    const treasureConfig = GameConfig.getTreasureConfig(this.difficulty, screenWidth, screenHeight);
    this.treasureSystem = new TreasureSystem(this, treasureConfig);

    // Initialize fish system
    const fishConfig = GameConfig.getFishConfig(this.difficulty, screenWidth, screenHeight);
    // Set detection radius based on difficulty - harder = fish are more aggressive
    const detectionRadius = this.difficulty === 'easy' ? 80 : this.difficulty === 'medium' ? 90 : 100;
    
    this.fishSystem = new FishSystem(this, {
      types: fishConfig.types,
      spawnDelay: fishConfig.spawnDelay,
      displayWidth: fishConfig.displaySize.width,
      displayHeight: fishConfig.displaySize.height,
      collisionWidth: fishConfig.collisionSize.width,
      collisionHeight: fishConfig.collisionSize.height,
      speed: fishConfig.speed,
      spawnAreaY: fishConfig.spawnAreaY,
      screenWidth: fishConfig.screenWidth,
      screenHeight: fishConfig.screenHeight,
      detectionRadius: detectionRadius // Fish detection radius varies by difficulty
    });

    // Connect fish system to treasure system for chasing behavior
    this.fishSystem.setTreasureSystem(this.treasureSystem);

    // Initialize audio system
    this.audioSystem = new AudioSystem(this, GameConfig.AUDIO_CONFIG);

    // Initialize score system
    const difficultySettings = GameConfig.getDifficultySettings(this.difficulty);
    this.scoreSystem = new ScoreSystem(this, {
      gameTimer: difficultySettings.gameTimer,
      difficulty: this.difficulty
    });

    // Initialize database system
    this.databaseSystem = new DatabaseSystem(this, {
      experienceId: this.experienceId,
      gameId: GameConfig.DATABASE_CONFIG.gameId,
      difficulty: this.difficulty
    });
  }

  private initializeUI(screenWidth: number, screenHeight: number): void {
    const uiConfig = GameConfig.getUIConfig(screenWidth, screenHeight);

    // Initialize game UI
    this.gameUI = new GameUI(this, {
      ...uiConfig,
      difficulty: this.difficulty
    });

    // Initialize game over screen
    this.gameOverScreen = new GameOverScreen(this, {
      screenWidth: uiConfig.screenWidth,
      screenHeight: uiConfig.screenHeight,
      fontSize: {
        title: uiConfig.fontSize.title,
        score: uiConfig.fontSize.large,
        button: uiConfig.fontSize.button
      },
      colors: {
        background: uiConfig.modal.background,
        overlay: uiConfig.modal.overlay,
        text: uiConfig.colors.primary,
        button: uiConfig.colors.button,
        buttonText: uiConfig.colors.buttonText,
        accent: uiConfig.colors.accent
      }
    });
  }

  private setupSystemInteractions(): void {
    // Setup collision detection between player and treasures
    this.physics.add.overlap(
      this.playerSystem.getSprite(),
      this.treasureSystem.getGroup(),
      (_, treasure) => {
        this.treasureSystem.collectTreasure(treasure as Phaser.Physics.Arcade.Sprite);
        const treasureType = (treasure as Phaser.Physics.Arcade.Sprite).texture.key;

        // Show cultural fact via window event to React component
        const fact = CulturalFacts.getRandomFact(treasureType);
        window.dispatchEvent(new CustomEvent('showReactCulturalFact', {
          detail: { treasureType, fact }
        }));

        // Add visual effect to player (scale up and down)
        this.playerSystem.addVisualEffect({
          targets: this.playerSystem.getSprite(),
          scaleX: 0.1,        // Scale up by 0.2 (from 1.0 to 1.2)
          scaleY: 0.1,        // Scale up by 0.2 (from 1.0 to 1.2)
          duration: 100,      // Slightly longer duration for better visibility
          yoyo: true,         // Return to original scale
          ease: 'Back.easeOut' // Bouncy effect for positive feedback
        });
      }
    );

    // Setup collision detection between player and fish
    this.physics.add.overlap(
      this.playerSystem.getSprite(),
      this.fishSystem.getGroup(),
      (_, fish) => {
        this.fishSystem.handleFishHit(fish as Phaser.Physics.Arcade.Sprite);

        // Add visual effect to player (red flash + scale animation)
        this.playerSystem.addVisualEffect({
          targets: this.playerSystem.getSprite(),
          tint: 0xFF0000,     // Red flash for damage
          scaleX: 1.2,        // Scale up by 0.2 (from 1.0 to 1.2)
          scaleY: 1.2,        // Scale up by 0.2 (from 1.0 to 1.2)
          duration: 200,      // Duration for both tint and scale
          yoyo: true,         // Return to original state
          ease: 'Power2'      // Sharp effect for negative feedback
        });
      }
    );

    // Setup reward handling
    this.events.on('rewardEarned', (reward: any) => {
      this.onRewardEarned(reward);
    });

    // Setup game end handling
    this.events.on('gameEnded', (finalScore: number) => {
      this.handleGameEnd(finalScore);
    });
  }

  private async handleGameEnd(finalScore: number): Promise<void> {
    console.log('Game ended with score:', finalScore);

    // IMMEDIATELY pause the game to prevent any further updates
    this.gamePaused = true;
    this.scene.pause();

    try {
      // Use the new game end callback if provided
      if (this.onGameEnd) {
        // Calculate time remaining and game completion status
        const timeRemaining = this.scoreSystem.getTimeRemaining();
        const gameCompleted = timeRemaining > 0; // If time is left, player completed successfully
        
        await this.onGameEnd(finalScore, timeRemaining, gameCompleted);
      } else {
        // Fallback to old system for backward compatibility
        await this.databaseSystem.submitScore(finalScore, true);
        const earnedBadges = await this.databaseSystem.awardGameBadges(finalScore, true);

        if (earnedBadges && earnedBadges.length > 0) {
          console.log('🎖️ Badges earned in GameScene:', earnedBadges);
          for (let i = 0; i < earnedBadges.length; i++) {
            const badge = earnedBadges[i];
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            window.dispatchEvent(new CustomEvent('badgeEarned', {
              detail: badge
            }));
          }
        }
      }

    } catch (error) {
      console.error('Error handling game end:', error);
    }

    // Don't auto-navigate - let the modal handle navigation
    // The user will choose their next action via the modal buttons
  }

  private startGame(): void {
    // Initialize and start background music
    this.audioSystem.initializeBackgroundMusic('cultural-bg');
    this.audioSystem.playBackgroundMusic();

    // Start the game timer
    this.events.emit('gameStarted');

    console.log(`${translations.console.gameStarted}: ${this.difficulty}`);
  }

  private initializeDeveloperModeState(): void {
    try {
      const savedSettings = localStorage.getItem('tabarka-treasures-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        const developerMode = parsed.developerMode ?? false;
        
        if (developerMode) {
          console.log('Initializing developer mode from localStorage');
          
          // Emit the developer mode event to all systems
          window.dispatchEvent(new CustomEvent('setDeveloperMode', {
            detail: { enabled: true }
          }));
        }
      }
    } catch (error) {
      console.error('Failed to initialize developer mode state:', error);
    }
  }

  private setupKeyboardControls(): void {
    // Create keyboard input for spacebar
    const spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    if (spaceKey) {
      spaceKey.on('down', () => {
        // Only allow pause/resume during active gameplay (not during game over)
        if (this.scoreSystem && !this.scoreSystem.isGameEnded()) {
          if (this.spacebarPaused) {
            this.resumeGameFromSpacebar();
          } else {
            this.pauseGameFromSpacebar();
          }
        }
      });
      
      console.log(translations.console.keyboardControlsEnabled);
    } else {
      console.warn(translations.console.keyboardNotAvailable);
    }
  }

  private pauseGameFromSpacebar(): void {
    this.spacebarPaused = true;
    this.gamePaused = true;
    
    // Pause physics world
    if (this.physics && this.physics.world) {
      this.physics.world.pause();
    }
    
    // Stop background music
    this.audioSystem?.stopBackgroundMusic();
    
    // Emit pause event to all systems (including UI)
    this.events.emit('gamePaused');
    
    console.log(translations.console.gamePaused);
  }

  private resumeGameFromSpacebar(): void {
    this.spacebarPaused = false;
    this.gamePaused = false;
    
    // Resume physics world
    if (this.physics && this.physics.world) {
      this.physics.world.resume();
    }
    
    // Resume background music
    this.audioSystem?.playBackgroundMusic();
    
    // Emit resume event to all systems (including UI)
    this.events.emit('gameResumed');
    
    console.log(translations.console.gameResumed);
  }

  update() {
    // Don't update if game is paused
    if (this.gamePaused) {
      return;
    }

    // Update all systems
    const currentTime = this.time.now;

    // Check if game should end
    const shouldEnd = this.scoreSystem.update();
    if (shouldEnd) {
      return; // Game ended, stop updating
    }

    // Update core systems
    this.playerSystem.update();
    this.treasureSystem.update(currentTime);
    this.fishSystem.update(currentTime);
    this.bubbleSystem.update(currentTime);

    // Check for custom fish collisions (expanded collision area)
    const collidedFish = this.fishSystem.checkCustomCollision(this.playerSystem.getSprite());
    if (collidedFish) {
      this.fishSystem.handleFishHit(collidedFish);
      
      // Add visual effect (red flash + scale animation)
      this.playerSystem.addVisualEffect({
        targets: this.playerSystem.getSprite(),
        tint: 0xFF0000,     // Red flash for damage
        scaleX: 0.15,        // Scale up by 0.2 (from 1.0 to 1.2)
        scaleY: 0.15,        // Scale up by 0.2 (from 1.0 to 1.2)
        duration: 100,      // Duration for both tint and scale
        yoyo: true,         // Return to original state
        ease: 'Power2'      // Sharp effect for negative feedback
      });
    }
  }

  destroy() {
    // Clean up window event listeners
    if ((this as any).handlePauseGame) {
      window.removeEventListener('pauseGame', (this as any).handlePauseGame);
    }
    if ((this as any).handleResumeGame) {
      window.removeEventListener('resumeGame', (this as any).handleResumeGame);
    }
    if ((this as any).handlePauseGameForSettings) {
      window.removeEventListener('pauseGameForSettings', (this as any).handlePauseGameForSettings);
    }
    if ((this as any).handleResumeGameFromSettings) {
      window.removeEventListener('resumeGameFromSettings', (this as any).handleResumeGameFromSettings);
    }

    // Clean up all systems
    this.playerSystem?.destroy();
    this.treasureSystem?.destroy();
    this.fishSystem?.destroy();
    this.audioSystem?.destroy();
    this.scoreSystem?.destroy();
    this.databaseSystem?.destroy();
    this.oceanBackground?.destroy();
    this.bubbleSystem?.destroy();
    this.lightRaySystem?.destroy();
    this.oceanFloor?.destroy();
    this.gameUI?.destroy();
    this.gameOverScreen?.destroy();
    this.assetLoader?.destroy();

    // Call scene shutdown instead of destroy
    this.scene.stop();
  }
}
