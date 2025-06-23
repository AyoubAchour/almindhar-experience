import Phaser from 'phaser';
import { GameConfig } from './GameConfig';

export interface AssetPaths {
  images: {
    [key: string]: string;
  };
  audio: {
    [key: string]: string;
  };
}

export interface LoadingProgress {
  percentage: number;
  filesLoaded: number;
  totalFiles: number;
  currentFile: string;
}

export class AssetLoader {
  private scene: Phaser.Scene;
  private onProgressCallback?: (progress: LoadingProgress) => void;
  private onCompleteCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public loadAllAssets(
    onProgress?: (progress: LoadingProgress) => void,
    onComplete?: () => void
  ): void {
    this.onProgressCallback = onProgress;
    this.onCompleteCallback = onComplete;

    this.setupLoadingEvents();
    this.loadGameAssets();
  }

  private setupLoadingEvents(): void {
    // Track loading progress
    this.scene.load.on('progress', (percentage: number) => {
      if (this.onProgressCallback) {
        this.onProgressCallback({
          percentage: Math.round(percentage * 100),
          filesLoaded: this.scene.load.totalComplete,
          totalFiles: this.scene.load.totalToLoad,
          currentFile: ''
        });
      }
    });

    // Track individual file loading
    this.scene.load.on('fileprogress', (file: any) => {
      if (this.onProgressCallback) {
        this.onProgressCallback({
          percentage: Math.round(this.scene.load.progress * 100),
          filesLoaded: this.scene.load.totalComplete,
          totalFiles: this.scene.load.totalToLoad,
          currentFile: file.key
        });
      }
    });

    // Handle loading completion
    this.scene.load.on('complete', () => {
      console.log('All assets loaded successfully');
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    });

    // Handle loading errors
    this.scene.load.on('loaderror', (file: any) => {
      console.error(`Failed to load asset: ${file.key} from ${file.url}`);
    });
  }

  private loadGameAssets(): void {
    // Load player assets
    this.loadPlayerAssets();

    // Load treasure assets
    this.loadTreasureAssets();

    // Load fish assets
    this.loadFishAssets();

    // Load environment assets
    this.loadEnvironmentAssets();

    // Load audio assets
    this.loadAudioAssets();

    // Create procedural textures
    this.createProceduralTextures();

    console.log(`Loading ${this.scene.load.totalToLoad} assets...`);
  }

  private loadPlayerAssets(): void {
    // Load basket image
    this.scene.load.image('basket', '/images/tabarka-treasures/basket.png');
  }

  private loadTreasureAssets(): void {
    const treasureTypes = GameConfig.TREASURE_CONFIG.types;
    
    treasureTypes.forEach(type => {
      this.scene.load.image(type, `/images/tabarka-treasures/${type}.png`);
    });

    console.log(`Loading ${treasureTypes.length} treasure assets`);
  }

  private loadFishAssets(): void {
    const fishTypes = GameConfig.FISH_CONFIG.types;
    
    fishTypes.forEach(type => {
      this.scene.load.image(type, `/images/tabarka-treasures/fish/${type}.png`);
    });

    console.log(`Loading ${fishTypes.length} fish assets`);
  }

  private loadEnvironmentAssets(): void {
    const envConfig = GameConfig.ENVIRONMENT_CONFIG.oceanFloor;

    // Load rock assets
    envConfig.decorationAssets.rocks.forEach((rock, index) => {
      this.scene.load.image(rock, `/images/tabarka-treasures/environement/rocks/rock${index + 1}.png`);
    });

    // Load coral assets
    envConfig.decorationAssets.coral.forEach((coral, index) => {
      this.scene.load.image(coral, `/images/tabarka-treasures/environement/coral/coral${index + 1}.png`);
    });

    // Load seaweed assets
    envConfig.decorationAssets.seaweed.forEach((seaweed, index) => {
      this.scene.load.image(seaweed, `/images/tabarka-treasures/environement/seaweed/seaweed${index + 1}.png`);
    });

    // Load boat asset
    this.scene.load.image('shipwreck', '/images/tabarka-treasures/environement/boat.png');

    console.log('Loading environment decoration assets');
  }

  private loadAudioAssets(): void {
    const audioConfig = GameConfig.AUDIO_CONFIG.assets;
    
    // Load background music
    this.scene.load.audio('cultural-bg', audioConfig.backgroundMusic);

    // Load sound effects
    this.scene.load.audio('treasure-pickup', audioConfig.treasurePickup);
    this.scene.load.audio('fish-hit', audioConfig.fishHit);
    this.scene.load.audio('game-over', audioConfig.gameOver);
    this.scene.load.audio('victory', audioConfig.victory);
    this.scene.load.audio('button-click', audioConfig.buttonClick);

    console.log('Loading audio assets');
  }

  private createProceduralTextures(): void {
    // Create bubble texture procedurally
    this.scene.load.once('complete', () => {
      this.createBubbleTexture();
    });
  }

  private createBubbleTexture(): void {
    // Create a simple circular bubble texture
    const bubbleGraphics = this.scene.add.graphics();
    bubbleGraphics.fillStyle(0xFFFFFF, 0.8); // White with transparency
    bubbleGraphics.fillCircle(10, 10, 10); // Circle with radius 10
    bubbleGraphics.generateTexture('bubble', 20, 20);
    bubbleGraphics.destroy(); // Clean up the graphics object
    
    console.log('Bubble texture created procedurally');
  }

  public static getAssetPaths(): AssetPaths {
    return {
      images: {
        // Player assets
        basket: '/images/tabarka-treasures/basket.png',
        
        // Treasure assets
        star: '/images/tabarka-treasures/star.png',
        pottery: '/images/tabarka-treasures/pottery.png',
        coins: '/images/tabarka-treasures/coins.png',
        tools: '/images/tabarka-treasures/tools.png',
        pearls: '/images/tabarka-treasures/pearls.png',
        
        // Fish assets
        fish1: '/images/tabarka-treasures/fish/fish1.png',
        fish2: '/images/tabarka-treasures/fish/fish2.png',
        fish3: '/images/tabarka-treasures/fish/fish3.png',
        fish4: '/images/tabarka-treasures/fish/fish4.png',

        // Environment assets
        rock1: '/images/tabarka-treasures/environement/rocks/rock1.png',
        rock2: '/images/tabarka-treasures/environement/rocks/rock2.png',
        rock3: '/images/tabarka-treasures/environement/rocks/rock3.png',
        coral1: '/images/tabarka-treasures/environement/coral/coral1.png',
        coral2: '/images/tabarka-treasures/environement/coral/coral2.png',
        seaweed1: '/images/tabarka-treasures/environement/seaweed/seaweed1.png',
        seaweed2: '/images/tabarka-treasures/environement/seaweed/seaweed2.png',
        seaweed3: '/images/tabarka-treasures/environement/seaweed/seaweed3.png',
        shipwreck: '/images/tabarka-treasures/environement/boat.png'
      },
      audio: {
        culturalBg: '/sounds/tbarka-treasures/cultural-bg.mp3',
        treasurePickup: '/sounds/tbarka-treasures/treasure-pickup.mp3',
        fishHit: '/sounds/tbarka-treasures/fish-hit.mp3',
        gameOver: '/sounds/tbarka-treasures/game-over.mp3',
        victory: '/sounds/tbarka-treasures/victory.mp3',
        buttonClick: '/sounds/tbarka-treasures/button-click.mp3'
      }
    };
  }

  public static validateAssets(): Promise<{ valid: string[]; missing: string[] }> {
    return new Promise(async (resolve) => {
      const assetPaths = AssetLoader.getAssetPaths();
      const valid: string[] = [];
      const missing: string[] = [];

      // Check image assets
      for (const [key, path] of Object.entries(assetPaths.images)) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            valid.push(`${key} (image)`);
          } else {
            missing.push(`${key} (image): ${path}`);
          }
        } catch {
          missing.push(`${key} (image): ${path}`);
        }
      }

      // Check audio assets
      for (const [key, path] of Object.entries(assetPaths.audio)) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            valid.push(`${key} (audio)`);
          } else {
            missing.push(`${key} (audio): ${path}`);
          }
        } catch {
          missing.push(`${key} (audio): ${path}`);
        }
      }

      resolve({ valid, missing });
    });
  }

  public destroy(): void {
    // Remove event listeners
    this.scene.load.off('progress');
    this.scene.load.off('fileprogress');
    this.scene.load.off('complete');
    this.scene.load.off('loaderror');
  }
}
