import Phaser from 'phaser';
import { translations } from '../config/Translations';

export interface GameUIConfig {
  screenWidth: number;
  screenHeight: number;
  fontSize: {
    large: number;
    medium: number;
    small: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UIElements {
  scoreText: Phaser.GameObjects.Text;
  timerText: Phaser.GameObjects.Text;
  difficultyText: Phaser.GameObjects.Text;
  backgroundPanel?: Phaser.GameObjects.Graphics;
}

export class GameUI {
  private scene: Phaser.Scene;
  private config: GameUIConfig;
  private uiElements!: UIElements;
  private currentScore: number = 0;
  private currentTime: number = 0;

  constructor(scene: Phaser.Scene, config: GameUIConfig) {
    this.scene = scene;
    this.config = config;
    this.createUIElements();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for UI update events from other systems
    this.scene.events.on('scoreUpdated', this.updateScore, this);
    this.scene.events.on('timerUpdated', this.updateTimer, this);
    this.scene.events.on('gameStarted', this.onGameStarted, this);
    this.scene.events.on('gameEnded', this.onGameEnded, this);
    this.scene.events.on('gamePaused', this.onGamePaused, this);
    this.scene.events.on('gameResumed', this.onGameResumed, this);
  }

  private createUIElements(): void {
    // Create score display
    this.uiElements = {
      scoreText: this.scene.add.text(20, 20, `${translations.ui.score}: 0`, {
        fontSize: `${this.config.fontSize.large}px`,
        color: this.config.colors.primary,
        fontFamily: 'Arial, sans-serif',
        stroke: this.config.colors.background,
        strokeThickness: 2
      }),

      // Create timer display
      timerText: this.scene.add.text(this.config.screenWidth - 20, 20, `${translations.ui.time}: 60`, {
        fontSize: `${this.config.fontSize.large}px`,
        color: this.config.colors.primary,
        fontFamily: 'Arial, sans-serif',
        stroke: this.config.colors.background,
        strokeThickness: 2
      }).setOrigin(1, 0),

      // Create difficulty indicator
      difficultyText: this.scene.add.text(
        this.config.screenWidth / 2,
        20,
        `${translations.ui.difficulty}: ${this.getLocalizedDifficulty()}`,
        {
          fontSize: `${this.config.fontSize.medium}px`,
          color: this.getDifficultyColor(),
          fontFamily: 'Arial, sans-serif',
          stroke: this.config.colors.background,
          strokeThickness: 2
        }
      ).setOrigin(0.5, 0)
    };

    // Create semi-transparent background panel for UI (after uiElements is initialized)
    this.createBackgroundPanel();

    // Set UI elements to high depth so they appear on top
    Object.values(this.uiElements).forEach(element => {
      if (element) {
        element.setDepth(1000);
      }
    });

    console.log('Game UI elements created');
  }

  private createBackgroundPanel(): void {
    // Create subtle background panel for better text readability
    const panel = this.scene.add.graphics();
    panel.setDepth(999); // Just below text

    // Top panel for score and timer
    panel.fillStyle(0x000000, 0.3);
    panel.fillRoundedRect(10, 10, this.config.screenWidth - 20, 50, 10);

    // Add the background panel to uiElements
    this.uiElements.backgroundPanel = panel;
  }

  private getDifficultyColor(): string {
    switch (this.config.difficulty) {
      case 'easy': return '#4CAF50';   // Green
      case 'medium': return '#FF9800'; // Orange
      case 'hard': return '#F44336';   // Red
      default: return this.config.colors.accent;
    }
  }

  private getLocalizedDifficulty(): string {
    switch (this.config.difficulty) {
      case 'easy': return translations.difficulties.easy;
      case 'medium': return translations.difficulties.medium;
      case 'hard': return translations.difficulties.hard;
    }
  }

  private updateScore(newScore: number): void {
    this.currentScore = newScore;
    this.uiElements.scoreText.setText(`${translations.ui.score}: ${newScore}`);
    
    // Add subtle animation for score updates
    this.scene.tweens.add({
      targets: this.uiElements.scoreText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
  }

  private updateTimer(timeRemaining: number): void {
    this.currentTime = timeRemaining;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    this.uiElements.timerText.setText(`${translations.ui.time}: ${timeString}`);
    
    // Change color when time is running low
    if (timeRemaining <= 10) {
      this.uiElements.timerText.setColor('#FF4444'); // Red
      
      // Add pulsing animation for urgency
      if (timeRemaining <= 5) {
        this.scene.tweens.add({
          targets: this.uiElements.timerText,
          alpha: 0.5,
          duration: 500,
          yoyo: true,
          ease: 'Power2'
        });
      }
    } else if (timeRemaining <= 30) {
      this.uiElements.timerText.setColor('#FFAA00'); // Orange
    } else {
      this.uiElements.timerText.setColor(this.config.colors.primary);
    }
  }

  private onGameStarted(): void {
    // Show all UI elements
    this.setVisible(true);
    
    // Reset colors and animations
    this.uiElements.timerText.setColor(this.config.colors.primary);
    this.uiElements.timerText.setAlpha(1);
  }

  private onGameEnded(finalScore: number): void {
    // Update final score
    this.updateScore(finalScore);
  }

  private onGamePaused(): void {
    // Add "PAUSED" indicator
    const pausedText = this.scene.add.text(
      this.config.screenWidth / 2,
      this.config.screenHeight / 2,
      translations.ui.paused,
      {
        fontSize: `${this.config.fontSize.large * 2}px`,
        color: this.config.colors.accent,
        fontFamily: 'Arial, sans-serif',
        stroke: this.config.colors.background,
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(1001);

    // Store reference for removal
    (this.uiElements as any).pausedText = pausedText;
  }

  private onGameResumed(): void {
    // Remove "PAUSED" indicator
    const pausedText = (this.uiElements as any).pausedText;
    if (pausedText) {
      pausedText.destroy();
      delete (this.uiElements as any).pausedText;
    }
  }

  public setVisible(visible: boolean): void {
    Object.values(this.uiElements).forEach(element => {
      if (element) {
        element.setVisible(visible);
      }
    });
  }

  public getCurrentScore(): number {
    return this.currentScore;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public destroy(): void {
    // Remove event listeners
    this.scene.events.off('scoreUpdated', this.updateScore, this);
    this.scene.events.off('timerUpdated', this.updateTimer, this);
    this.scene.events.off('gameStarted', this.onGameStarted, this);
    this.scene.events.off('gameEnded', this.onGameEnded, this);
    this.scene.events.off('gamePaused', this.onGamePaused, this);
    this.scene.events.off('gameResumed', this.onGameResumed, this);

    // Destroy UI elements
    Object.values(this.uiElements).forEach(element => {
      if (element) {
        element.destroy();
      }
    });
  }
}
