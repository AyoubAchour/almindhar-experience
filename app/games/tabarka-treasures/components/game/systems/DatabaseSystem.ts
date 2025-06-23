import Phaser from 'phaser';

export interface DatabaseConfig {
  experienceId: string;
  gameId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  userId?: string;
}

export interface GameResult {
  score: number;
  timeRemaining: number;
  difficulty: string;
  experienceId: string;
  gameId: string;
}

export interface RewardInfo {
  couponCode: string;
  discountPercentage: number;
  expiryDate: string;
}

export class DatabaseSystem {
  private scene: Phaser.Scene;
  private config: DatabaseConfig;

  constructor(scene: Phaser.Scene, config: DatabaseConfig) {
    this.scene = scene;
    this.config = config;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for database-related events
    this.scene.events.on('gameEnded', this.saveGameResult, this);
    this.scene.events.on('saveScore', this.saveScore, this);
  }

  private async saveGameResult(finalScore: number): Promise<void> {
    try {
      const gameResult: GameResult = {
        score: finalScore,
        timeRemaining: 0, // Will be updated by caller if needed
        difficulty: this.config.difficulty,
        experienceId: this.config.experienceId,
        gameId: this.config.gameId
      };

      await this.saveScore(gameResult);
      
      // Note: Reward generation is now handled by the unified system
      // via useGameScore hook in the React component

    } catch (error) {
      console.error('Failed to save game result:', error);
      this.scene.events.emit('databaseError', error);
    }
  }

  public async saveScore(gameResult: GameResult): Promise<void> {
    try {
      console.log('Saving score to database:', gameResult);

      // Use the correct API endpoint for saving scores
      const response = await fetch(`/api/games/scores/${this.config.experienceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: gameResult.score,
          completed: true
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save score: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Score saved successfully:', result);

      this.scene.events.emit('scoreSaved', result);

    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  }

  private shouldAwardReward(score: number): boolean {
    // Determine if score qualifies for a reward based on difficulty
    const thresholds = {
      easy: 100,   // 5% discount
      medium: 150, // 10% discount  
      hard: 200    // 15% discount
    };

    return score >= thresholds[this.config.difficulty];
  }

  private async generateReward(score: number): Promise<RewardInfo> {
    try {
      const discountPercentages = {
        easy: 5,
        medium: 10,
        hard: 15
      };

      const discountPercentage = discountPercentages[this.config.difficulty];

      // Generate reward via API
      const response = await fetch('/api/rewards/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.config.userId,
          experienceId: this.config.experienceId,
          gameId: this.config.gameId,
          score: score,
          difficulty: this.config.difficulty,
          discountPercentage: discountPercentage
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate reward: ${response.statusText}`);
      }

      const reward = await response.json();
      console.log('Reward generated:', reward);

      return {
        couponCode: reward.couponCode,
        discountPercentage: discountPercentage,
        expiryDate: reward.expiryDate
      };

    } catch (error) {
      console.error('Error generating reward:', error);
      throw error;
    }
  }

  public async loadBestScore(): Promise<number> {
    try {
      const response = await fetch(`/api/games/scores/${this.config.experienceId}`);

      if (!response.ok) {
        throw new Error(`Failed to load best score: ${response.statusText}`);
      }

      const result = await response.json();
      // Get the highest score from the scores array
      const bestScore = result.scores && result.scores.length > 0 ? result.scores[0].score : 0;
      return bestScore;

    } catch (error) {
      console.error('Error loading best score:', error);
      return 0;
    }
  }

  public async submitScore(score: number, completed: boolean): Promise<void> {
    try {
      console.log('Submitting score to database:', { score, completed });

      // Use the correct API endpoint for saving scores
      const response = await fetch(`/api/games/scores/${this.config.experienceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          completed
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit score: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Score submitted successfully:', result);

      this.scene.events.emit('scoreSaved', result);

    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  public async awardGameBadges(score: number, completed: boolean): Promise<any[]> {
    try {
      console.log('Awarding badges for Tabarka Treasures game:', { score, completed });

      const response = await fetch('/api/badges/tabarka-treasures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          completed,
          experienceId: this.config.experienceId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to award badges: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Badge award result:', result);

      return result.badges || [];

    } catch (error) {
      console.error('Error awarding game badges:', error);
      return [];
    }
  }

  public async loadGameStats(): Promise<any> {
    try {
      const response = await fetch(`/api/games/stats?experienceId=${this.config.experienceId}&gameId=${this.config.gameId}&userId=${this.config.userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load game stats: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error loading game stats:', error);
      return null;
    }
  }

  public setUserId(userId: string): void {
    this.config.userId = userId;
  }

  public setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.config.difficulty = difficulty;
  }

  public destroy(): void {
    // Remove event listeners
    this.scene.events.off('gameEnded', this.saveGameResult, this);
    this.scene.events.off('saveScore', this.saveScore, this);
  }
}
