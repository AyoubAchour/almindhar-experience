import Phaser from 'phaser';
import { TreasureSystem } from './TreasureSystem';

export interface FishConfig {
  types: string[];
  spawnDelay: number;
  displayWidth: number;
  displayHeight: number;
  collisionWidth: number;
  collisionHeight: number;
  speed: number;
  spawnAreaY: { min: number; max: number };
  screenWidth: number;
  screenHeight: number;
  detectionRadius?: number; // New: Detection radius for treasure chasing
}

export class FishSystem {
  private scene: Phaser.Scene;
  private config: FishConfig;
  private fish!: Phaser.Physics.Arcade.Group;
  private lastSpawnTime: number = 0;
  private fishBubbleTrails: Map<string, number> = new Map(); // Track bubble timing for each fish
  private treasureSystem: TreasureSystem | null = null; // Reference to treasure system
  private fishTargets: Map<string, { treasure: Phaser.Physics.Arcade.Sprite; originalSpeed: number; originalDirection: number }> = new Map(); // Track fish targets
  private detectionRadius: number;
  private developerMode: boolean = false; // Track developer mode state
  private debugCircles: Map<string, Phaser.GameObjects.Graphics> = new Map(); // Debug visualization circles
  private fishIdCounter: number = 0; // Counter for generating unique fish IDs

  constructor(scene: Phaser.Scene, config: FishConfig) {
    this.scene = scene;
    this.config = config;
    this.detectionRadius = config.detectionRadius || 80; // Default 80px detection radius
    this.createFishGroup();
    this.setupDeveloperModeListener();
  }

  // New: Setup listener for developer mode changes
  private setupDeveloperModeListener(): void {
    const handleDeveloperModeChange = (event: CustomEvent) => {
      this.developerMode = event.detail.enabled;
      console.log(`🐛 Fish System - Developer mode ${this.developerMode ? 'enabled' : 'disabled'}`);
      
      if (!this.developerMode) {
        // Hide all debug circles when developer mode is disabled
        this.debugCircles.forEach(circle => circle.setVisible(false));
      }
    };

    window.addEventListener('setDeveloperMode', handleDeveloperModeChange as EventListener);
  }

  // New: Set reference to treasure system for interaction
  public setTreasureSystem(treasureSystem: TreasureSystem): void {
    this.treasureSystem = treasureSystem;
  }

  private createFishGroup(): void {
    this.fish = this.scene.physics.add.group();
  }

  public update(currentTime: number): void {
    // Handle fish spawning
    if (currentTime - this.lastSpawnTime > this.config.spawnDelay) {
      this.spawnFish();
      this.lastSpawnTime = currentTime;
    }

    // Update fish bubble trails, treasure chasing, and cleanup
    this.fish.children.entries.forEach((fishSprite) => {
      const fish = fishSprite as Phaser.Physics.Arcade.Sprite;
      const fishId = fish.name; // Use the persistent ID assigned at spawn

      // Update treasure chasing behavior
      this.updateFishTreasureChasing(fish, fishId);

      // Update fish rotation if not chasing (for normal swimming)
      if (!this.fishTargets.has(fishId)) {
        this.updateFishRotation(fish);
      }

      // Update debug visualization if developer mode is enabled
      this.updateDebugCircle(fish, fishId);

      // Create bubble trail for swimming fish (less frequent than treasures)
      if (fish.x > -30 && fish.x < this.config.screenWidth + 30) {
        this.updateFishBubbleTrail(fish, fishId, currentTime);
      }

      // Clean up fish that have moved off screen
      if (fish.x > this.config.screenWidth + 50 || fish.x < -50) {
        this.fishBubbleTrails.delete(fishId);
        this.fishTargets.delete(fishId);
        this.removeDebugCircle(fishId); // Clean up debug circle
        fish.destroy();
      }
    });
  }

  // New: Update fish treasure chasing behavior
  private updateFishTreasureChasing(fish: Phaser.Physics.Arcade.Sprite, fishId: string): void {
    if (!this.treasureSystem || !fish.body) return;

    const currentTarget = this.fishTargets.get(fishId);
    
    // Check if current target is still valid
    if (currentTarget && (!currentTarget.treasure.active || !currentTarget.treasure.body)) {
      // Target is gone, resume normal movement
      this.resumeNormalMovement(fish, fishId, currentTarget);
      return;
    }

    // If fish has a target, move toward it
    if (currentTarget) {
      this.chaseTarget(fish, currentTarget.treasure);
      
      // Check if fish reached the treasure (close enough to "eat" it)
      const distance = Phaser.Math.Distance.Between(fish.x, fish.y, currentTarget.treasure.x, currentTarget.treasure.y);
      if (distance < 25) { // Close enough to eat
        this.eatTreasure(fish, fishId, currentTarget.treasure);
      }
    } else {
      // Fish doesn't have a target, scan for nearby treasures
      const nearbyTreasure = this.findNearbyTreasure(fish);
      if (nearbyTreasure) {
        this.acquireTarget(fish, fishId, nearbyTreasure);
      }
    }
  }

  // New: Find nearby treasure within detection radius
  private findNearbyTreasure(fish: Phaser.Physics.Arcade.Sprite): Phaser.Physics.Arcade.Sprite | null {
    if (!this.treasureSystem) return null;

    const treasures = this.treasureSystem.getGroup();
    let closestTreasure: Phaser.Physics.Arcade.Sprite | null = null;
    let closestDistance = this.detectionRadius;

    treasures.children.entries.forEach((treasureSprite) => {
      const treasure = treasureSprite as Phaser.Physics.Arcade.Sprite;
      if (!treasure.active || !treasure.body) return;

      const distance = Phaser.Math.Distance.Between(fish.x, fish.y, treasure.x, treasure.y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestTreasure = treasure;
      }
    });

    return closestTreasure;
  }

  // New: Acquire a treasure as target
  private acquireTarget(fish: Phaser.Physics.Arcade.Sprite, fishId: string, treasure: Phaser.Physics.Arcade.Sprite): void {
    if (!fish.body) return;

    const body = fish.body as Phaser.Physics.Arcade.Body;
    const originalSpeed = Math.abs(body.velocity.x);
    const originalDirection = body.velocity.x > 0 ? 1 : -1;

    this.fishTargets.set(fishId, {
      treasure,
      originalSpeed,
      originalDirection
    });

    console.log(`🐟 Fish acquired treasure target at (${treasure.x}, ${treasure.y})`);
  }

  // New: Chase the target treasure
  private chaseTarget(fish: Phaser.Physics.Arcade.Sprite, treasure: Phaser.Physics.Arcade.Sprite): void {
    if (!fish.body || !treasure.body) return;

    const body = fish.body as Phaser.Physics.Arcade.Body;
    
    // Calculate direction to treasure
    const dx = treasure.x - fish.x;
    const dy = treasure.y - fish.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize direction and apply speed (slightly faster when chasing)
      const chaseSpeed = this.config.speed * 1.2; // 20% faster when chasing
      const velocityX = (dx / distance) * chaseSpeed;
      const velocityY = (dy / distance) * chaseSpeed;

      body.setVelocity(velocityX, velocityY);

      // Update fish rotation to face movement direction
      this.updateFishRotation(fish);
    }
  }

  // New: Fish eats the treasure
  private eatTreasure(fish: Phaser.Physics.Arcade.Sprite, fishId: string, treasure: Phaser.Physics.Arcade.Sprite): void {
    console.log(`🐟 Fish ate treasure! No points for player.`);
    
    // Use treasure system to properly remove the treasure
    if (this.treasureSystem) {
      this.treasureSystem.fishEatTreasure(treasure);
    } else {
      treasure.destroy();
    }
    
    // Play eating sound effect
    this.scene.events.emit('playSound', 'fish-hit', { volume: 0.3 });
    
    // Create some bubble effects at the eating location
    this.scene.events.emit('spawnTreasureBubble', fish.x, fish.y);
    this.scene.events.emit('spawnTreasureBubble', fish.x + 10, fish.y - 5);
    this.scene.events.emit('spawnTreasureBubble', fish.x - 10, fish.y + 5);
    
    // Resume normal movement
    const target = this.fishTargets.get(fishId);
    if (target) {
      this.resumeNormalMovement(fish, fishId, target);
    }
  }

  // New: Resume normal horizontal movement
  private resumeNormalMovement(fish: Phaser.Physics.Arcade.Sprite, fishId: string, target: { originalSpeed: number; originalDirection: number }): void {
    if (!fish.body) return;

    const body = fish.body as Phaser.Physics.Arcade.Body;
    
    // Resume original horizontal movement
    body.setVelocity(target.originalSpeed * target.originalDirection, 0);
    
    // Set proper origin for horizontal movement
    if (target.originalDirection > 0) {
      // Moving right - origin toward right side (fish head)
      fish.setOrigin(-0.9, 0.5);
    } else {
      // Moving left - origin toward left side (fish head when flipped)
      fish.setOrigin(0.9, 0.5);
    }
    
    // Reset rotation to horizontal swimming (0 degrees)
    fish.setRotation(0);
    fish.setFlipX(target.originalDirection < 0);
    
    // Clear the target
    this.fishTargets.delete(fishId);
    
    console.log(`🐟 Fish resumed normal movement`);
  }

  private spawnFish(): void {
    // Choose random side (left or right)
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -50 : this.config.screenWidth + 50;

    // Choose random Y position in the middle area of the screen
    const randomY = Phaser.Math.Between(this.config.spawnAreaY.min, this.config.spawnAreaY.max);

    // Randomly select one of the fish types
    const randomFishType = Phaser.Utils.Array.GetRandom(this.config.types);

    // Create the fish sprite with random type
    const fish = this.scene.physics.add.sprite(startX, randomY, randomFishType);
    fish.setDisplaySize(this.config.displayWidth, this.config.displayHeight);

    // Set initial origin based on spawn direction (for proper head-based rotation)
    if (fromLeft) {
      // Moving right - origin toward right side (fish head)
      fish.setOrigin(0.7, 0.5);
    } else {
      // Moving left - origin toward left side (fish head when flipped)
      fish.setOrigin(0.3, 0.5);
    }

    // Assign unique persistent ID to the fish
    fish.name = `fish_${this.fishIdCounter++}`;

    // Set depth to appear above all decorative objects (foreground layer)
    fish.setDepth(1000);

    // Set up physics body and movement
    this.scene.time.delayedCall(10, () => {
      if (fish.body) {
        fish.body.setSize(this.config.collisionWidth, this.config.collisionHeight);
        fish.body.enable = true;

        // Set horizontal velocity based on direction
        const speed = fromLeft ? this.config.speed : -this.config.speed;
        fish.body.setVelocityX(speed);

        // Set initial rotation and flipping for horizontal movement
        fish.setRotation(0); // Start with horizontal swimming
        fish.setFlipX(!fromLeft); // Flip if moving left
      }
    });

    // Add to fish group
    this.fish.add(fish);

    console.log(`Spawned ${randomFishType} moving ${fromLeft ? 'right' : 'left'} at Y: ${randomY}`);
  }

  private updateFishBubbleTrail(fish: Phaser.Physics.Arcade.Sprite, fishId: string, currentTime: number): void {
    const lastBubbleTime = this.fishBubbleTrails.get(fishId) || 0;

    // Spawn a bubble every 700ms for each fish (very reduced density - much less frequent)
    if (currentTime - lastBubbleTime > 700) {
      // Determine fish direction from velocity
      const direction = fish.body ? (fish.body as Phaser.Physics.Arcade.Body).velocity.x : 0;
      this.scene.events.emit('spawnFishBubble', fish.x, fish.y, direction);
      this.fishBubbleTrails.set(fishId, currentTime);
    }
  }

  public checkCustomCollision(playerSprite: Phaser.Physics.Arcade.Sprite): Phaser.Physics.Arcade.Sprite | null {
    // Custom collision detection for fish - check larger area around player
    const playerBounds = {
      x: playerSprite.x - 30, // Expand collision area
      y: playerSprite.y - 25, // Expand collision area
      width: 60,
      height: 50
    };

    let collidedFish: Phaser.Physics.Arcade.Sprite | null = null;

    this.fish.children.entries.forEach((fishSprite) => {
      const fish = fishSprite as Phaser.Physics.Arcade.Sprite;

      const fishBounds = {
        x: fish.x - 20,
        y: fish.y - 10,
        width: 40,
        height: 20
      };

      // Check if fish overlaps with expanded player area
      if (playerBounds.x < fishBounds.x + fishBounds.width &&
          playerBounds.x + playerBounds.width > fishBounds.x &&
          playerBounds.y < fishBounds.y + fishBounds.height &&
          playerBounds.y + playerBounds.height > fishBounds.y) {
        console.log('Manual fish collision detected with expanded area!');
        collidedFish = fish;
        return;
      }
    });

    return collidedFish;
  }

  public handleFishHit(fishSprite: Phaser.Physics.Arcade.Sprite): number {
    // Get the fish ID before destroying it
    const fishId = fishSprite.name;
    
    // Clean up debug circle if it exists
    if (fishId) {
      this.removeDebugCircle(fishId);
      
      // Also clean up other tracking data
      this.fishBubbleTrails.delete(fishId);
      this.fishTargets.delete(fishId);
    }
    
    // Remove the fish
    fishSprite.destroy();

    // Emit events for other systems
    this.scene.events.emit('playSound', 'fish-hit', { volume: 0.5 });
    this.scene.events.emit('playerHitByFish');

    const penalty = 20;
    console.log(`Hit by fish! Penalty: ${penalty} points`);
    return penalty;
  }

  public getGroup(): Phaser.Physics.Arcade.Group {
    return this.fish;
  }

  public pauseAll(): { fish: Phaser.Physics.Arcade.Sprite; velocityX: number; velocityY: number }[] {
    const pausedVelocities: { fish: Phaser.Physics.Arcade.Sprite; velocityX: number; velocityY: number }[] = [];
    
    this.fish.children.entries.forEach((fishSprite) => {
      const fish = fishSprite as Phaser.Physics.Arcade.Sprite;
      if (fish.body) {
        pausedVelocities.push({
          fish: fish,
          velocityX: fish.body.velocity.x,
          velocityY: fish.body.velocity.y
        });
        fish.setVelocity(0, 0);
      }
    });

    return pausedVelocities;
  }

  public resumeAll(pausedVelocities: { fish: Phaser.Physics.Arcade.Sprite; velocityX: number; velocityY: number }[]): void {
    pausedVelocities.forEach(({ fish, velocityX, velocityY }) => {
      if (fish && fish.body && fish.active) {
        fish.setVelocity(velocityX, velocityY);
      }
    });
  }

  public destroy(): void {
    if (this.fish) {
      this.fish.destroy(true);
    }
    // Clean up tracking maps
    this.fishBubbleTrails.clear();
    this.fishTargets.clear();
    
    // Clean up debug circles
    this.debugCircles.forEach(circle => circle.destroy());
    this.debugCircles.clear();
  }

  // New: Create or update debug circle for a fish
  private updateDebugCircle(fish: Phaser.Physics.Arcade.Sprite, fishId: string): void {
    if (!this.developerMode) return;

    let debugCircle = this.debugCircles.get(fishId);
    
    if (!debugCircle) {
      // Create new debug circle
      debugCircle = this.scene.add.graphics();
      debugCircle.setDepth(2000); // Above everything else
      this.debugCircles.set(fishId, debugCircle);
    }

    // Clear and redraw the circle
    debugCircle.clear();
    debugCircle.lineStyle(2, 0xff0000, 0.5); // Red line, 50% opacity
    debugCircle.strokeCircle(fish.x, fish.y, this.detectionRadius);
    
    // Add a small dot at the center
    debugCircle.fillStyle(0xff0000, 0.8);
    debugCircle.fillCircle(fish.x, fish.y, 3);
    
    debugCircle.setVisible(true);
  }

  // New: Remove debug circle for a fish
  private removeDebugCircle(fishId: string): void {
    const debugCircle = this.debugCircles.get(fishId);
    if (debugCircle) {
      debugCircle.destroy();
      this.debugCircles.delete(fishId);
    }
  }

  // New: Update fish rotation to face movement direction
  private updateFishRotation(fish: Phaser.Physics.Arcade.Sprite): void {
    if (!fish.body) return;

    const body = fish.body as Phaser.Physics.Arcade.Body;
    const velocityX = body.velocity.x;
    const velocityY = body.velocity.y;

    // Only rotate if fish is actually moving
    if (Math.abs(velocityX) > 5 || Math.abs(velocityY) > 5) {
      // Set rotation origin based on movement direction
      // This makes fish rotate around their head/nose instead of center
      if (velocityX >= 0) {
        // Moving right - set origin toward the right side (fish head)
        fish.setOrigin(0.8, 0.5); // 70% to the right, centered vertically
      } else {
        // Moving left - set origin toward the left side (fish head when flipped)
        fish.setOrigin(0.2, 0.5); // 30% to the right (70% to left), centered vertically
      }

      // Calculate angle based on velocity direction
      // atan2 returns angle in radians, with 0 pointing right
      const targetAngle = Math.atan2(velocityY, Math.abs(velocityX));
      
      // Apply rotation - fish sprites are designed to face right by default
      fish.setRotation(targetAngle);
      
      // Handle horizontal flipping for left movement
      // Only flip if moving more left than right
      fish.setFlipX(velocityX < 0);
    }
  }
}
