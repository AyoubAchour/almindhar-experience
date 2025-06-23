import Phaser from 'phaser';

export interface TreasureConfig {
  types: string[];
  spawnDelay: number;
  displaySize: number;
  collisionSize: number;
  fallSpeed: number;
  spawnAreaX: { min: number; max: number };
  spawnY: number;
  screenWidth: number;
  screenHeight: number;
}

export interface TreasurePoints {
  [key: string]: number;
}

export class TreasureSystem {
  private scene: Phaser.Scene;
  private config: TreasureConfig;
  private treasures!: Phaser.Physics.Arcade.Group;
  private lastSpawnTime: number = 0;
  private treasurePoints!: TreasurePoints;
  private bubbleTrails: Map<string, number> = new Map();

  constructor(scene: Phaser.Scene, config: TreasureConfig) {
    this.scene = scene;
    this.config = config;
    this.setupTreasurePoints();
    this.createTreasureGroup();
  }

  private setupTreasurePoints(): void {
    this.treasurePoints = {
      star: 10,
      pottery: 15,
      coins: 20,
      tools: 25,
      pearls: 30
    };
  }

  private createTreasureGroup(): void {
    this.treasures = this.scene.physics.add.group();
  }

  public update(currentTime: number): void {
    // Handle treasure spawning
    if (currentTime - this.lastSpawnTime > this.config.spawnDelay) {
      this.spawnTreasure();
      this.lastSpawnTime = currentTime;
    }

    // Update treasure bubble trails and cleanup
    this.treasures.children.entries.forEach((treasure) => {
      const treasureSprite = treasure as Phaser.Physics.Arcade.Sprite;
      const treasureId = treasureSprite.name || `treasure_${treasureSprite.x}_${treasureSprite.y}`;

      // Create bubble trail for falling treasures
      if (treasureSprite.y > 0 && treasureSprite.y < this.config.screenHeight) {
        this.updateBubbleTrail(treasureSprite, treasureId, currentTime);
      }

      // Clean up treasures that have fallen off screen
      if (treasureSprite.y > this.config.screenHeight + 50) {
        console.log(`Destroying treasure that fell off screen at Y: ${treasureSprite.y}`);
        this.bubbleTrails.delete(treasureId);
        treasureSprite.destroy();
      }
    });
  }

  private updateBubbleTrail(treasureSprite: Phaser.Physics.Arcade.Sprite, treasureId: string, currentTime: number): void {
    const lastBubbleTime = this.bubbleTrails.get(treasureId) || 0;
    
    // Spawn a bubble every 200ms for each treasure
    if (currentTime - lastBubbleTime > 200) {
      this.scene.events.emit('spawnTreasureBubble', treasureSprite.x, treasureSprite.y);
      this.bubbleTrails.set(treasureId, currentTime);
    }
  }

  private spawnTreasure(): void {
    // Choose a random treasure type
    const randomType = Phaser.Utils.Array.GetRandom(this.config.types);

    // Choose a random X position across the screen width
    const randomX = Phaser.Math.Between(this.config.spawnAreaX.min, this.config.spawnAreaX.max);

    // Create the treasure sprite at the top of the screen (above visible area)
    const treasure = this.scene.physics.add.sprite(randomX, this.config.spawnY, randomType);
    treasure.setDisplaySize(this.config.displaySize, this.config.displaySize);

    // Set depth to appear above all decorative objects (foreground layer)
    treasure.setDepth(1000);

    // Add to treasures group first
    this.treasures.add(treasure);

    // Set velocity in the next frame to ensure physics body is ready
    this.scene.time.delayedCall(10, () => {
      if (treasure.body) {
        treasure.body.setSize(this.config.collisionSize, this.config.collisionSize);
        treasure.body.enable = true;
        treasure.body.setVelocityY(this.config.fallSpeed);
        console.log(`Delayed velocity set: ${treasure.body.velocity.y}`);
      } else {
        console.error('Physics body still not found after delay!');
      }
    });

    console.log(`Spawned treasure: ${randomType} at position (${randomX}, ${this.config.spawnY})`);
  }

  public collectTreasure(treasureSprite: Phaser.Physics.Arcade.Sprite): number {
    const treasureType = treasureSprite.texture.key;
    const points = this.treasurePoints[treasureType] || 10;

    // Clean up bubble trail tracking for this treasure
    const treasureId = treasureSprite.name || `treasure_${treasureSprite.x}_${treasureSprite.y}`;
    this.bubbleTrails.delete(treasureId);

    // Remove the treasure from the screen
    treasureSprite.destroy();

    // Emit events for other systems
    this.scene.events.emit('treasureCollected', treasureType, points);
    this.scene.events.emit('playSound', 'treasure-pickup', { volume: 0.4 });

    console.log(`Collected ${treasureType}: +${points} points!`);
    return points;
  }

  // New: Handle fish eating treasure (no points awarded)
  public fishEatTreasure(treasureSprite: Phaser.Physics.Arcade.Sprite): void {
    const treasureType = treasureSprite.texture.key;

    // Clean up bubble trail tracking for this treasure
    const treasureId = treasureSprite.name || `treasure_${treasureSprite.x}_${treasureSprite.y}`;
    this.bubbleTrails.delete(treasureId);

    // Remove the treasure from the screen
    treasureSprite.destroy();

    console.log(`🐟 Fish ate ${treasureType} - no points for player!`);
  }

  public getGroup(): Phaser.Physics.Arcade.Group {
    return this.treasures;
  }

  public pauseAll(): { treasure: Phaser.Physics.Arcade.Sprite; velocityX: number; velocityY: number }[] {
    const pausedVelocities: { treasure: Phaser.Physics.Arcade.Sprite; velocityX: number; velocityY: number }[] = [];
    
    this.treasures.children.entries.forEach((treasureSprite) => {
      const treasure = treasureSprite as Phaser.Physics.Arcade.Sprite;
      if (treasure.body) {
        pausedVelocities.push({
          treasure: treasure,
          velocityX: treasure.body.velocity.x,
          velocityY: treasure.body.velocity.y
        });
        treasure.setVelocity(0, 0);
      }
    });

    return pausedVelocities;
  }

  public resumeAll(pausedVelocities: { treasure: Phaser.Physics.Arcade.Sprite; velocityX: number; velocityY: number }[]): void {
    pausedVelocities.forEach(({ treasure, velocityX, velocityY }) => {
      if (treasure && treasure.body && treasure.active) {
        treasure.setVelocity(velocityX, velocityY);
      }
    });
  }

  public destroy(): void {
    if (this.treasures) {
      this.treasures.destroy(true);
    }
    this.bubbleTrails.clear();
  }
}
