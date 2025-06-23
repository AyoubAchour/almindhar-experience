import Phaser from 'phaser';

export interface AudioConfig {
  enabled: boolean;
  backgroundMusicVolume: number;
  soundEffectVolume: number;
}

export interface AudioAssets {
  backgroundMusic: string;
  treasurePickup: string;
  fishHit: string;
  gameOver: string;
  victory: string;
  buttonClick: string;
}

export class AudioSystem {
  private scene: Phaser.Scene;
  private config: AudioConfig;
  private backgroundMusic: Phaser.Sound.BaseSound | null = null;
  private soundEffects: Map<string, Phaser.Sound.BaseSound> = new Map();
  private masterVolume: number = 1.0; // Master volume multiplier

  constructor(scene: Phaser.Scene, config: AudioConfig) {
    this.scene = scene;
    this.config = config;
    this.setupEventListeners();
    this.setupWindowEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for audio events from other systems
    this.scene.events.on('playSound', this.playSound, this);
    this.scene.events.on('playBackgroundMusic', this.playBackgroundMusic, this);
    this.scene.events.on('stopBackgroundMusic', this.stopBackgroundMusic, this);
    this.scene.events.on('setAudioEnabled', this.setEnabled, this);
  }

  private setupWindowEventListeners(): void {
    // Listen for settings events from React components
    const handleMasterVolumeChange = (event: CustomEvent) => {
      this.setMasterVolume(event.detail.volume);
    };

    window.addEventListener('setMasterVolume', handleMasterVolumeChange as EventListener);

    // Store reference for cleanup
    (this as any).handleMasterVolumeChange = handleMasterVolumeChange;
  }

  public initializeBackgroundMusic(musicKey: string): void {
    if (!this.config.enabled) return;

    try {
      // Check if the audio asset exists in the cache
      if (!this.scene.cache.audio.exists(musicKey)) {
        console.warn(`Audio asset '${musicKey}' not found in cache. Background music will not be available.`);
        return;
      }

      this.backgroundMusic = this.scene.sound.add(musicKey, {
        loop: true,
        volume: this.config.backgroundMusicVolume * this.masterVolume
      });

      if (!this.backgroundMusic) {
        console.warn(`Failed to create background music object for '${musicKey}'. Audio may not be supported.`);
        return;
      }

      console.log(`Background music '${musicKey}' initialized successfully`);
    } catch (error) {
      console.error(`Error initializing background music '${musicKey}':`, error);
      this.backgroundMusic = null;
    }
  }

  public playBackgroundMusic(): void {
    if (!this.config.enabled || !this.backgroundMusic) {
      if (!this.backgroundMusic) {
        console.warn('Background music not initialized. Cannot play.');
      }
      return;
    }

    try {
      if (!this.backgroundMusic.isPlaying) {
        this.backgroundMusic.play();
        console.log('Background music started');
      }
    } catch (error) {
      console.error('Error playing background music:', error);
      // Try to reinitialize if there was an error
      this.backgroundMusic = null;
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      try {
        if (this.backgroundMusic.isPlaying) {
          this.backgroundMusic.stop();
          console.log('Background music stopped');
        }
      } catch (error) {
        console.error('Error stopping background music:', error);
        this.backgroundMusic = null;
      }
    }
  }

  public playSound(soundKey: string, options: { volume?: number } = {}): void {
    if (!this.config.enabled) return;

    const volume = (options.volume || this.config.soundEffectVolume) * this.masterVolume;

    try {
      this.scene.sound.play(soundKey, { volume });
      console.log(`Played sound: ${soundKey} at volume ${volume}`);
    } catch (error) {
      console.error(`Failed to play sound: ${soundKey}`, error);
    }
  }

  public preloadAudioAssets(assets: AudioAssets): void {
    // Load audio files
    this.scene.load.audio('cultural-bg', assets.backgroundMusic);
    this.scene.load.audio('treasure-pickup', assets.treasurePickup);
    this.scene.load.audio('fish-hit', assets.fishHit);
    this.scene.load.audio('game-over', assets.gameOver);
    this.scene.load.audio('victory', assets.victory);
    this.scene.load.audio('button-click', assets.buttonClick);

    console.log('Audio assets queued for loading');
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;

    if (!enabled && this.backgroundMusic) {
      try {
        if (this.backgroundMusic.isPlaying) {
          this.backgroundMusic.stop();
        }
      } catch (error) {
        console.error('Error stopping background music when disabling audio:', error);
        this.backgroundMusic = null;
      }
    } else if (enabled && this.backgroundMusic) {
      try {
        if (!this.backgroundMusic.isPlaying) {
          this.backgroundMusic.play();
        }
      } catch (error) {
        console.error('Error playing background music when enabling audio:', error);
        this.backgroundMusic = null;
      }
    }

    console.log(`Audio ${enabled ? 'enabled' : 'disabled'}`);
  }

  public setBackgroundMusicVolume(volume: number): void {
    this.config.backgroundMusicVolume = Math.max(0, Math.min(1, volume));

    // Only attempt to set volume if we have a valid background music object
    if (this.isBackgroundMusicValid()) {
      try {
        const finalVolume = this.config.backgroundMusicVolume * this.masterVolume;
        // Use bracket notation to avoid TypeScript errors
        (this.backgroundMusic as any)['volume'] = finalVolume;
        console.log(`Background music volume set to: ${finalVolume}`);
      } catch (error) {
        console.error('Error setting background music volume:', error);
        this.backgroundMusic = null;
      }
    }
  }

  private isBackgroundMusicValid(): boolean {
    return !!(
      this.backgroundMusic &&
      this.backgroundMusic !== null &&
      typeof this.backgroundMusic === 'object' &&
      !(this.backgroundMusic as any).pendingDestroy &&
      !(this.backgroundMusic as any).destroyed
    );
  }

  public setSoundEffectVolume(volume: number): void {
    this.config.soundEffectVolume = Math.max(0, Math.min(1, volume));
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));

    // Update background music volume if we have a valid object
    if (this.isBackgroundMusicValid()) {
      try {
        const finalVolume = this.config.backgroundMusicVolume * this.masterVolume;
        // Use bracket notation to avoid TypeScript errors
        (this.backgroundMusic as any)['volume'] = finalVolume;
        console.log(`Master volume applied to background music: ${finalVolume}`);
      } catch (error) {
        console.error('Error setting master volume on background music:', error);
        this.backgroundMusic = null;
      }
    }

    console.log(`Master volume set to: ${this.masterVolume}`);
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public isBackgroundMusicPlaying(): boolean {
    if (!this.isBackgroundMusicValid()) return false;

    try {
      return (this.backgroundMusic as any).isPlaying || false;
    } catch (error) {
      console.error('Error checking background music playing status:', error);
      this.backgroundMusic = null;
      return false;
    }
  }

  public destroy(): void {
    // Remove event listeners
    this.scene.events.off('playSound', this.playSound, this);
    this.scene.events.off('playBackgroundMusic', this.playBackgroundMusic, this);
    this.scene.events.off('stopBackgroundMusic', this.stopBackgroundMusic, this);
    this.scene.events.off('setAudioEnabled', this.setEnabled, this);

    // Remove window event listeners
    if ((this as any).handleMasterVolumeChange) {
      window.removeEventListener('setMasterVolume', (this as any).handleMasterVolumeChange);
    }

    // Stop and clean up audio
    if (this.backgroundMusic) {
      try {
        if (this.backgroundMusic.isPlaying) {
          this.backgroundMusic.stop();
        }
        this.backgroundMusic.destroy();
      } catch (error) {
        console.error('Error destroying background music:', error);
      }
      this.backgroundMusic = null;
    }

    this.soundEffects.forEach((sound) => {
      try {
        if (sound.isPlaying) {
          sound.stop();
        }
        sound.destroy();
      } catch (error) {
        console.error('Error destroying sound effect:', error);
      }
    });

    this.soundEffects.clear();
  }
}
