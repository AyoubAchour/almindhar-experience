import Phaser from 'phaser';

export interface PlayerConfig {
  startX: number;
  startY: number;
  speed: number;
  assetKey: string;
  displayWidth: number;
  displayHeight: number;
  collisionWidth: number;
  collisionHeight: number;
  collisionOffsetX: number;
  collisionOffsetY: number;
}

export interface PlayerControls {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  wasdKeys: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
}

export class PlayerSystem {
  private scene: Phaser.Scene;
  private player!: Phaser.Physics.Arcade.Sprite;
  private controls!: PlayerControls;
  private config: PlayerConfig;
  private lastBubbleTime: number = 0; // Track bubble timing for basket movement

  constructor(scene: Phaser.Scene, config: PlayerConfig) {
    this.scene = scene;
    this.config = config;
    this.createPlayer();
    this.setupControls();
  }

  private createPlayer(): void {
    // Create the player sprite (basket)
    this.player = this.scene.physics.add.sprite(
      this.config.startX,
      this.config.startY,
      this.config.assetKey
    );

    // Set display size
    this.player.setDisplaySize(this.config.displayWidth, this.config.displayHeight);

    // Set depth to appear above all other game elements (foreground layer)
    this.player.setDepth(1001);

    // Keep player within screen bounds
    this.player.setCollideWorldBounds(true);

    // Set collision box for treasures (top opening area only)
    this.player.body!.setSize(this.config.collisionWidth, this.config.collisionHeight);
    this.player.body!.setOffset(this.config.collisionOffsetX, this.config.collisionOffsetY);

    console.log(`Player created - size: ${this.config.displayWidth}x${this.config.displayHeight}, collision: ${this.config.collisionWidth}x${this.config.collisionHeight} at offset (${this.config.collisionOffsetX},${this.config.collisionOffsetY})`);
  }

  private setupControls(): void {
    // Set up keyboard controls
    this.controls = {
      cursors: this.scene.input.keyboard!.createCursorKeys(),
      wasdKeys: this.scene.input.keyboard!.addKeys('W,S,A,D') as {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      }
    };
  }

  public update(): void {
    // Reset velocity
    this.player.setVelocity(0, 0);

    let isMoving = false;

    // Check for left movement (A key or left arrow)
    if (this.controls.cursors.left.isDown || this.controls.wasdKeys.A.isDown) {
      this.player.setVelocityX(-this.config.speed);
      isMoving = true;
    }
    // Check for right movement (D key or right arrow)
    else if (this.controls.cursors.right.isDown || this.controls.wasdKeys.D.isDown) {
      this.player.setVelocityX(this.config.speed);
      isMoving = true;
    }

    // Check for up movement (W key or up arrow)
    if (this.controls.cursors.up.isDown || this.controls.wasdKeys.W.isDown) {
      this.player.setVelocityY(-this.config.speed);
      isMoving = true;
    }
    // Check for down movement (S key or down arrow)
    else if (this.controls.cursors.down.isDown || this.controls.wasdKeys.S.isDown) {
      this.player.setVelocityY(this.config.speed);
      isMoving = true;
    }

    // Create bubble trail when moving
    if (isMoving) {
      this.updateBasketBubbleTrail();
    }
  }

  private updateBasketBubbleTrail(): void {
    const currentTime = this.scene.time.now;

    // Spawn a bubble every 150ms when basket is moving (high density - very frequent)
    if (currentTime - this.lastBubbleTime > 150) {
      this.scene.events.emit('spawnBasketBubble', this.player.x, this.player.y);
      this.lastBubbleTime = currentTime;
    }
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.player;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.player.x, y: this.player.y };
  }

  public setVelocity(x: number, y: number): void {
    this.player.setVelocity(x, y);
  }

  public stopMovement(): void {
    this.player.setVelocity(0, 0);
  }

  public addVisualEffect(effect: any): void {
    // Add visual effects like scaling, tinting, etc.
    this.scene.tweens.add(effect);
  }

  public destroy(): void {
    if (this.player) {
      this.player.destroy();
    }
  }
}
