import Phaser from 'phaser';

export interface ScoreConfig {
  gameTimer: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  score: number;
  timeRemaining: number;
  gameEnded: boolean;
  gamePaused: boolean;
}

export class ScoreSystem {
  private scene: Phaser.Scene;
  private config: ScoreConfig;
  private gameState!: GameState;
  private gameStartTime: number = 0;
  private totalPausedTime: number = 0;
  private pausedTime: number = 0;

  constructor(scene: Phaser.Scene, config: ScoreConfig) {
    this.scene = scene;
    this.config = config;
    this.initializeGameState();
    this.setupEventListeners();
  }

  private initializeGameState(): void {
    this.gameState = {
      score: 0,
      timeRemaining: this.config.gameTimer,
      gameEnded: false,
      gamePaused: false
    };
  }

  private setupEventListeners(): void {
    // Listen for score-related events from other systems
    this.scene.events.on('treasureCollected', this.onTreasureCollected, this);
    this.scene.events.on('playerHitByFish', this.onPlayerHitByFish, this);
    this.scene.events.on('gameStarted', this.startGame, this);
    this.scene.events.on('gamePaused', this.pauseGame, this);
    this.scene.events.on('gameResumed', this.resumeGame, this);
  }

  public startGame(): void {
    this.gameStartTime = this.scene.time.now;
    this.gameState.gameEnded = false;
    this.gameState.gamePaused = false;
    this.totalPausedTime = 0;
    console.log('Game started - timer initialized');
  }

  public update(): boolean {
    // Return false if game should continue, true if game should end
    if (this.gameState.gameEnded || this.gameState.gamePaused) {
      return false; // Don't update timer when paused or ended
    }

    // Update timer (accounting for paused time)
    const currentTime = this.scene.time.now;
    const elapsedSeconds = Math.floor((currentTime - this.gameStartTime - this.totalPausedTime) / 1000);
    this.gameState.timeRemaining = Math.max(0, this.config.gameTimer - elapsedSeconds);

    // Emit timer update event
    this.scene.events.emit('timerUpdated', this.gameState.timeRemaining);

    // Check if time is up
    if (this.gameState.timeRemaining <= 0 && !this.gameState.gameEnded) {
      this.endGame();
      return true; // Game should end
    }

    return false;
  }

  private onTreasureCollected(treasureType: string, points: number): void {
    this.gameState.score += points;
    this.scene.events.emit('scoreUpdated', this.gameState.score);
    console.log(`Score updated: +${points} points. Total: ${this.gameState.score}`);
  }

  private onPlayerHitByFish(): void {
    const penalty = 20;
    this.gameState.score = Math.max(0, this.gameState.score - penalty);
    this.scene.events.emit('scoreUpdated', this.gameState.score);
    console.log(`Score penalty: -${penalty} points. Total: ${this.gameState.score}`);
  }

  public pauseGame(): void {
    if (!this.gameState.gamePaused && !this.gameState.gameEnded) {
      this.gameState.gamePaused = true;
      this.pausedTime = this.scene.time.now;
      console.log('Game paused');
    }
  }

  public resumeGame(): void {
    if (this.gameState.gamePaused) {
      this.totalPausedTime += (this.scene.time.now - this.pausedTime);
      this.gameState.gamePaused = false;
      console.log('Game resumed');
    }
  }

  private endGame(): void {
    this.gameState.gameEnded = true;
    this.scene.events.emit('gameEnded', this.gameState.score);
    console.log(`Game ended! Final score: ${this.gameState.score}`);
  }

  public forceEndGame(): void {
    this.endGame();
  }

  public getScore(): number {
    return this.gameState.score;
  }

  public getTimeRemaining(): number {
    return this.gameState.timeRemaining;
  }

  public isGameEnded(): boolean {
    return this.gameState.gameEnded;
  }

  public isGamePaused(): boolean {
    return this.gameState.gamePaused;
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public addScore(points: number): void {
    this.gameState.score += points;
    this.scene.events.emit('scoreUpdated', this.gameState.score);
  }

  public subtractScore(points: number): void {
    this.gameState.score = Math.max(0, this.gameState.score - points);
    this.scene.events.emit('scoreUpdated', this.gameState.score);
  }

  public resetScore(): void {
    this.gameState.score = 0;
    this.scene.events.emit('scoreUpdated', this.gameState.score);
  }

  public destroy(): void {
    // Remove event listeners
    this.scene.events.off('treasureCollected', this.onTreasureCollected, this);
    this.scene.events.off('playerHitByFish', this.onPlayerHitByFish, this);
    this.scene.events.off('gameStarted', this.startGame, this);
    this.scene.events.off('gamePaused', this.pauseGame, this);
    this.scene.events.off('gameResumed', this.resumeGame, this);
  }
}
