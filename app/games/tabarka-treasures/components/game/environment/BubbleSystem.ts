import Phaser from 'phaser';

export interface BubbleConfig {
  screenWidth: number;
  screenHeight: number;
  ambientBubbleSpawnRate: number;
  treasureBubbleEnabled: boolean;
  bubbleAssetKey: string;
}

export interface BubbleSpawnArea {
  x: { min: number; max: number };
  y: { min: number; max: number };
}

export class BubbleSystem {
  private scene: Phaser.Scene;
  private config: BubbleConfig;
  private bubbleTexture: Phaser.GameObjects.Graphics | null = null;
  private lastAmbientBubbleTime: number = 0;
  private lastSmallBubbleTime: number = 0;

  constructor(scene: Phaser.Scene, config: BubbleConfig) {
    this.scene = scene;
    this.config = config;
    this.createBubbleTexture();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for bubble spawn requests from other systems
    this.scene.events.on('spawnTreasureBubble', this.spawnTreasureBubble, this);
    this.scene.events.on('spawnAmbientBubbles', this.spawnAmbientBubbles, this);
    this.scene.events.on('spawnFishBubble', this.spawnFishBubble, this);
    this.scene.events.on('spawnBasketBubble', this.spawnBasketBubble, this);
  }

  private createBubbleTexture(): void {
    // Create a simple circular bubble texture
    this.bubbleTexture = this.scene.add.graphics();
    this.bubbleTexture.fillStyle(0xFFFFFF, 0.8); // White with transparency
    this.bubbleTexture.fillCircle(10, 10, 10); // Circle with radius 10
    this.bubbleTexture.generateTexture(this.config.bubbleAssetKey, 20, 20);
    this.bubbleTexture.destroy(); // Clean up the graphics object
    
    console.log('Bubble texture created');
  }

  public update(currentTime: number): void {
    // Spawn ambient bubbles periodically
    if (currentTime - this.lastAmbientBubbleTime > this.config.ambientBubbleSpawnRate) {
      this.spawnAmbientBubble();
      this.lastAmbientBubbleTime = currentTime;
    }

    // Spawn small decorative bubbles less frequently
    if (currentTime - this.lastSmallBubbleTime > 3000) { // Every 3 seconds
      this.spawnSmallBubble();
      this.lastSmallBubbleTime = currentTime;
    }
  }

  private spawnAmbientBubble(): void {
    // Create ambient bubbles that rise from bottom to top
    const x = Phaser.Math.Between(this.config.screenWidth * 0.1, this.config.screenWidth * 0.9);
    const y = this.config.screenHeight + 20;

    const bubble = this.scene.add.sprite(x, y, this.config.bubbleAssetKey);
    bubble.setScale(Phaser.Math.FloatBetween(0.3, 0.8));
    bubble.setAlpha(Phaser.Math.FloatBetween(0.4, 0.7));
    bubble.setTint(0x87CEEB); // Sky blue tint

    // Animate bubble rising with slight horizontal drift
    this.scene.tweens.add({
      targets: bubble,
      y: -50,
      x: x + Phaser.Math.Between(-30, 30),
      scaleX: bubble.scaleX * 1.5,
      scaleY: bubble.scaleY * 1.5,
      alpha: 0,
      duration: Phaser.Math.Between(6000, 10000),
      ease: 'Power1',
      onComplete: () => {
        bubble.destroy();
      }
    });
  }

  private spawnSmallBubble(): void {
    // Create smaller decorative bubbles
    const x = Phaser.Math.Between(this.config.screenWidth * 0.2, this.config.screenWidth * 0.8);
    const y = this.config.screenHeight + 10;

    const bubble = this.scene.add.sprite(x, y, this.config.bubbleAssetKey);
    bubble.setScale(0.2);
    bubble.setAlpha(0.6);
    bubble.setTint(0x87CEEB); // Sky blue tint

    // Animate the small bubble rising faster
    this.scene.tweens.add({
      targets: bubble,
      y: -30,
      x: x + Phaser.Math.Between(-15, 15),
      scaleX: 0.6,
      scaleY: 0.6,
      alpha: 0,
      duration: 4000,
      ease: 'Power1',
      onComplete: () => {
        bubble.destroy();
      }
    });
  }

  public spawnTreasureBubble(treasureX: number, treasureY: number): void {
    if (!this.config.treasureBubbleEnabled) return;

    // Create a small bubble trail behind the falling treasure
    const bubbleX = treasureX + Phaser.Math.Between(-8, 8);
    const bubbleY = treasureY + Phaser.Math.Between(-5, 5);

    const bubble = this.scene.add.sprite(bubbleX, bubbleY, this.config.bubbleAssetKey);
    bubble.setScale(0.15); // Very small bubbles for trail effect
    bubble.setAlpha(0.5);
    bubble.setTint(0xB0E0E6); // Powder blue tint

    // Set depth to appear above decorative objects but below game elements
    bubble.setDepth(500);

    // Animate the bubble rising slowly while fading
    this.scene.tweens.add({
      targets: bubble,
      y: bubbleY - Phaser.Math.Between(30, 60),
      x: bubbleX + Phaser.Math.Between(-10, 10),
      scaleX: 0.3,
      scaleY: 0.3,
      alpha: 0,
      duration: Phaser.Math.Between(1500, 2500),
      ease: 'Power1',
      onComplete: () => {
        bubble.destroy();
      }
    });
  }

  public spawnFishBubble(fishX: number, fishY: number, direction: number): void {
    // Create horizontal bubble trail behind swimming fish (less dense than treasures)
    const bubbleX = fishX + Phaser.Math.Between(-15, 15);
    const bubbleY = fishY + Phaser.Math.Between(-8, 8);

    const bubble = this.scene.add.sprite(bubbleX, bubbleY, this.config.bubbleAssetKey);
    bubble.setScale(0.12); // Smaller than treasure bubbles
    bubble.setAlpha(0.4);  // More transparent than treasure bubbles
    bubble.setTint(0xADD8E6); // Light blue tint

    // Set depth to appear above decorative objects but below game elements
    bubble.setDepth(500);

    // Animate the bubble moving horizontally opposite to fish direction + slight rise
    const horizontalDistance = direction > 0 ? -30 : 30; // Opposite to fish movement

    this.scene.tweens.add({
      targets: bubble,
      x: bubbleX + horizontalDistance,
      y: bubbleY - Phaser.Math.Between(10, 25), // Slight upward movement
      scaleX: 0.25,
      scaleY: 0.25,
      alpha: 0,
      duration: Phaser.Math.Between(1000, 1800), // Faster than treasure bubbles
      ease: 'Power1',
      onComplete: () => {
        bubble.destroy();
      }
    });
  }

  public spawnBasketBubble(basketX: number, basketY: number): void {
    // Create bubble trail behind moving basket
    const bubbleX = basketX + Phaser.Math.Between(-12, 12);
    const bubbleY = basketY + Phaser.Math.Between(10, 20); // Behind/below the basket

    const bubble = this.scene.add.sprite(bubbleX, bubbleY, this.config.bubbleAssetKey);
    bubble.setScale(0.18); // Medium size bubbles
    bubble.setAlpha(0.6);  // More visible than fish bubbles
    bubble.setTint(0x87CEEB); // Sky blue tint

    // Set depth to appear above decorative objects but below game elements
    bubble.setDepth(500);

    // Animate the bubble rising with slight drift
    this.scene.tweens.add({
      targets: bubble,
      y: bubbleY - Phaser.Math.Between(40, 70),
      x: bubbleX + Phaser.Math.Between(-15, 15),
      scaleX: 0.35,
      scaleY: 0.35,
      alpha: 0,
      duration: Phaser.Math.Between(2000, 3000), // Medium duration
      ease: 'Power1',
      onComplete: () => {
        bubble.destroy();
      }
    });
  }

  public spawnAmbientBubbles(): void {
    // Spawn multiple ambient bubbles at once
    const bubbleCount = Phaser.Math.Between(2, 5);
    
    for (let i = 0; i < bubbleCount; i++) {
      this.scene.time.delayedCall(i * 200, () => {
        this.spawnAmbientBubble();
      });
    }
  }

  public setBubbleSpawnRate(rate: number): void {
    this.config.ambientBubbleSpawnRate = rate;
  }

  public setTreasureBubblesEnabled(enabled: boolean): void {
    this.config.treasureBubbleEnabled = enabled;
  }

  public spawnBubbleCluster(x: number, y: number, count: number = 5): void {
    // Spawn a cluster of bubbles at a specific location
    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        const offsetX = x + Phaser.Math.Between(-20, 20);
        const offsetY = y + Phaser.Math.Between(-10, 10);
        this.spawnTreasureBubble(offsetX, offsetY);
      });
    }
  }

  public destroy(): void {
    // Remove event listeners
    this.scene.events.off('spawnTreasureBubble', this.spawnTreasureBubble, this);
    this.scene.events.off('spawnAmbientBubbles', this.spawnAmbientBubbles, this);
    this.scene.events.off('spawnFishBubble', this.spawnFishBubble, this);
    this.scene.events.off('spawnBasketBubble', this.spawnBasketBubble, this);

    if (this.bubbleTexture) {
      this.bubbleTexture.destroy();
    }
  }
}
