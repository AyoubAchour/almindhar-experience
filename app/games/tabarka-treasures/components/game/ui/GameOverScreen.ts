import Phaser from 'phaser';

export interface GameOverConfig {
  screenWidth: number;
  screenHeight: number;
  fontSize: {
    title: number;
    score: number;
    button: number;
  };
  colors: {
    background: number;
    overlay: number;
    text: string;
    button: number;
    buttonText: string;
    accent: string;
  };
}

export interface GameOverElements {
  overlay: Phaser.GameObjects.Graphics;
  titleText: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  timeText: Phaser.GameObjects.Text;
  retryButton: Phaser.GameObjects.Graphics;
  retryButtonText: Phaser.GameObjects.Text;
  exitButton: Phaser.GameObjects.Graphics;
  exitButtonText: Phaser.GameObjects.Text;
  container: Phaser.GameObjects.Container;
}

export class GameOverScreen {
  private scene: Phaser.Scene;
  private config: GameOverConfig;
  private gameOverElements: GameOverElements | null = null;
  private isVisible: boolean = false;
  private onRetryCallback?: () => void;
  private onExitCallback?: () => void;

  constructor(scene: Phaser.Scene, config: GameOverConfig) {
    this.scene = scene;
    this.config = config;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for game over events
    this.scene.events.on('gameEnded', this.showGameOver, this);
    this.scene.events.on('hideGameOver', this.hideGameOver, this);
  }

  public showGameOver(finalScore: number, timeRemaining: number = 0, callbacks?: { onRetry?: () => void; onExit?: () => void }): void {
    if (this.isVisible) return;

    this.onRetryCallback = callbacks?.onRetry;
    this.onExitCallback = callbacks?.onExit;

    this.createGameOverScreen(finalScore, timeRemaining);
    this.isVisible = true;

    console.log(`Game over screen shown - Score: ${finalScore}, Time: ${timeRemaining}`);
  }

  private createGameOverScreen(finalScore: number, timeRemaining: number): void {
    // Create semi-transparent overlay
    const overlay = this.scene.add.graphics();
    overlay.fillStyle(this.config.colors.overlay, 0.8);
    overlay.fillRect(0, 0, this.config.screenWidth, this.config.screenHeight);

    // Create main background panel
    const panelWidth = 400;
    const panelHeight = 300;
    const panelX = (this.config.screenWidth - panelWidth) / 2;
    const panelY = (this.config.screenHeight - panelHeight) / 2;

    const background = this.scene.add.graphics();
    background.fillStyle(this.config.colors.background, 0.95);
    background.lineStyle(3, 0xFFFFFF, 1);
    background.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);
    background.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 20);

    // Create title text
    const titleText = this.scene.add.text(
      this.config.screenWidth / 2,
      panelY + 40,
      'Partie Terminée!',
      {
        fontSize: `${this.config.fontSize.title}px`,
        color: this.config.colors.text,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setOrigin(0.5);

    // Create score text
    const scoreText = this.scene.add.text(
      this.config.screenWidth / 2,
      panelY + 100,
      `Score Final: ${finalScore}`,
      {
        fontSize: `${this.config.fontSize.score}px`,
        color: this.config.colors.accent,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setOrigin(0.5);

    // Create time text (if time remaining)
    const timeText = this.scene.add.text(
      this.config.screenWidth / 2,
      panelY + 140,
      timeRemaining > 0 ? `Temps Restant: ${timeRemaining}s` : 'Temps Écoulé!',
      {
        fontSize: `${this.config.fontSize.button}px`,
        color: this.config.colors.text,
        fontFamily: 'Arial, sans-serif',
        align: 'center'
      }
    ).setOrigin(0.5);

    // Create retry button
    const buttonWidth = 140;
    const buttonHeight = 40;
    const retryButton = this.scene.add.graphics();
    const retryButtonX = this.config.screenWidth / 2 - buttonWidth - 10;
    const retryButtonY = panelY + 200;

    retryButton.fillStyle(this.config.colors.button, 1);
    retryButton.lineStyle(2, 0xFFFFFF, 1);
    retryButton.fillRoundedRect(retryButtonX, retryButtonY, buttonWidth, buttonHeight, 8);
    retryButton.strokeRoundedRect(retryButtonX, retryButtonY, buttonWidth, buttonHeight, 8);

    const retryButtonText = this.scene.add.text(
      retryButtonX + buttonWidth / 2,
      retryButtonY + buttonHeight / 2,
      'Rejouer',
      {
        fontSize: `${this.config.fontSize.button}px`,
        color: this.config.colors.buttonText,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Create exit button
    const exitButton = this.scene.add.graphics();
    const exitButtonX = this.config.screenWidth / 2 + 10;
    const exitButtonY = panelY + 200;

    exitButton.fillStyle(0x666666, 1);
    exitButton.lineStyle(2, 0xFFFFFF, 1);
    exitButton.fillRoundedRect(exitButtonX, exitButtonY, buttonWidth, buttonHeight, 8);
    exitButton.strokeRoundedRect(exitButtonX, exitButtonY, buttonWidth, buttonHeight, 8);

    const exitButtonText = this.scene.add.text(
      exitButtonX + buttonWidth / 2,
      exitButtonY + buttonHeight / 2,
      'Retour',
      {
        fontSize: `${this.config.fontSize.button}px`,
        color: this.config.colors.buttonText,
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Create container
    const container = this.scene.add.container(0, 0, [
      overlay,
      background,
      titleText,
      scoreText,
      timeText,
      retryButton,
      retryButtonText,
      exitButton,
      exitButtonText
    ]);

    container.setDepth(3000); // Ensure game over screen appears on top

    // Store elements
    this.gameOverElements = {
      overlay,
      titleText,
      scoreText,
      timeText,
      retryButton,
      retryButtonText,
      exitButton,
      exitButtonText,
      container
    };

    // Setup button interactions
    this.setupButtons(retryButtonX, retryButtonY, exitButtonX, exitButtonY, buttonWidth, buttonHeight);

    // Add entrance animation
    this.animateEntrance();
  }

  private setupButtons(retryX: number, retryY: number, exitX: number, exitY: number, width: number, height: number): void {
    if (!this.gameOverElements) return;

    const { retryButton, exitButton } = this.gameOverElements;

    // Setup retry button
    retryButton.setInteractive(
      new Phaser.Geom.Rectangle(retryX, retryY, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    retryButton.on('pointerover', () => this.highlightButton(retryButton, retryX, retryY, width, height, this.config.colors.button));
    retryButton.on('pointerout', () => this.unhighlightButton(retryButton, retryX, retryY, width, height, this.config.colors.button));
    retryButton.on('pointerdown', () => this.handleRetry());

    // Setup exit button
    exitButton.setInteractive(
      new Phaser.Geom.Rectangle(exitX, exitY, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    exitButton.on('pointerover', () => this.highlightButton(exitButton, exitX, exitY, width, height, 0x666666));
    exitButton.on('pointerout', () => this.unhighlightButton(exitButton, exitX, exitY, width, height, 0x666666));
    exitButton.on('pointerdown', () => this.handleExit());
  }

  private highlightButton(button: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, baseColor: number): void {
    button.clear();
    button.fillStyle(this.lightenColor(baseColor), 1);
    button.lineStyle(2, 0xFFFFFF, 1);
    button.fillRoundedRect(x, y, width, height, 8);
    button.strokeRoundedRect(x, y, width, height, 8);
  }

  private unhighlightButton(button: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, baseColor: number): void {
    button.clear();
    button.fillStyle(baseColor, 1);
    button.lineStyle(2, 0xFFFFFF, 1);
    button.fillRoundedRect(x, y, width, height, 8);
    button.strokeRoundedRect(x, y, width, height, 8);
  }

  private lightenColor(color: number): number {
    const c = Phaser.Display.Color.IntegerToColor(color);
    return Phaser.Display.Color.GetColor(
      Math.min(255, c.red + 40),
      Math.min(255, c.green + 40),
      Math.min(255, c.blue + 40)
    );
  }

  private animateEntrance(): void {
    if (!this.gameOverElements) return;

    const { container } = this.gameOverElements;

    container.setAlpha(0);
    container.setScale(0.8);

    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });
  }

  private handleRetry(): void {
    this.hideGameOver();
    if (this.onRetryCallback) {
      this.onRetryCallback();
    }
  }

  private handleExit(): void {
    this.hideGameOver();
    if (this.onExitCallback) {
      this.onExitCallback();
    }
  }

  public hideGameOver(): void {
    if (!this.isVisible || !this.gameOverElements) return;

    const { container } = this.gameOverElements;

    this.scene.tweens.add({
      targets: container,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroyGameOverScreen();
      }
    });

    this.isVisible = false;
  }

  private destroyGameOverScreen(): void {
    if (this.gameOverElements) {
      this.gameOverElements.container.destroy();
      this.gameOverElements = null;
    }
  }

  public isScreenVisible(): boolean {
    return this.isVisible;
  }

  public destroy(): void {
    // Remove event listeners
    this.scene.events.off('gameEnded', this.showGameOver, this);
    this.scene.events.off('hideGameOver', this.hideGameOver, this);

    // Destroy screen if visible
    if (this.isVisible) {
      this.destroyGameOverScreen();
    }
  }
}
