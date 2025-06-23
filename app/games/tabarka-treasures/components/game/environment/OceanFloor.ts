import Phaser from 'phaser';

export interface OceanFloorConfig {
  screenWidth: number;
  screenHeight: number;
  floorHeight: number;
  sandColor: number;

  // Background rocks configuration - large, distant rocks for depth
  backgroundRocks: {
    count: number;
    xRange: { min: number; max: number; };
    yOffset: number;
    scale: { min: number; max: number; };
    tintRange: { min: number; max: number; };
    alpha: number;                    // Transparency for depth effect
  };

  // Foreground rocks configuration - smaller, detailed rocks
  rocks: {
    count: number;
    xRange: { min: number; max: number; };
    yOffset: number;
    scale: { min: number; max: number; };
    tintRange: { min: number; max: number; };
  };

  // Background seaweed configuration - tall, distant seaweed for depth
  backgroundSeaweed: {
    count: number;
    xRange: { min: number; max: number; };
    yOffset: number;
    scaleX: number;
    scaleYVariations: number[];
    tintRange: { min: number; max: number; };
    alpha: number;                    // Transparency for depth effect
    animation: {
      rotationRange: { min: number; max: number; };
      scaleXRange: { min: number; max: number; };
      duration: { min: number; max: number; };
      delayRange: { min: number; max: number; };
    };
  };

  // Foreground seaweed configuration - smaller, detailed seaweed
  seaweed: {
    count: number;
    xRange: { min: number; max: number; };
    yOffset: number;
    scaleX: number;
    scaleYVariations: number[];
    tintRange: { min: number; max: number; };
    animation: {
      rotationRange: { min: number; max: number; };
      scaleXRange: { min: number; max: number; };
      duration: { min: number; max: number; };
      delayRange: { min: number; max: number; };
    };
  };

  // Coral configuration - medium layer decorations
  coral: {
    count: number;
    xRange: { min: number; max: number; };
    yOffset: number;
    scale: { min: number; max: number; };
    tintRange: { min: number; max: number; };
    animation: {
      rotationRange: { min: number; max: number; };
      duration: { min: number; max: number; };
    };
  };

  // Asset file names
  decorationAssets: {
    rocks: string[];
    coral: string[];
    seaweed: string[];
  };
}

export interface FloorDecoration {
  sprite: Phaser.GameObjects.Sprite;
  type: 'rock' | 'coral' | 'seaweed' | 'backgroundRock' | 'backgroundSeaweed';
  animationTween?: Phaser.Tweens.Tween;
  debugLabel?: Phaser.GameObjects.Text; // Debug label for developer mode
}

export class OceanFloor {
  private scene: Phaser.Scene;
  private config: OceanFloorConfig;
  private sandFloor!: Phaser.GameObjects.Graphics;
  private decorations: FloorDecoration[] = [];
  private depthLayers: Phaser.GameObjects.Graphics[] = [];
  private rippleGraphics!: Phaser.GameObjects.Graphics;
  private developerMode: boolean = false; // Track developer mode state

  constructor(scene: Phaser.Scene, config: OceanFloorConfig) {
    this.scene = scene;
    this.config = config;
    this.createSandFloor();
    this.createFloorDecorations();
    this.createOceanDepthOverlay();
    this.setupDeveloperModeListener();
  }

  private createSandFloor(): void {
    // Create the sand floor as a graphics object
    this.sandFloor = this.scene.add.graphics();

    // Calculate floor position - make it take up more space for depth illusion
    const floorStartY = this.config.screenHeight * 0.6; // Start sand at 60% down the screen
    const floorHeight = this.config.screenHeight * 0.4; // Sand takes up 40% of screen height

    // Create realistic sand floor with proper depth perspective
    this.createPerspectiveSandFloor(floorStartY, floorHeight);
    this.createDepthGradientLayers(floorStartY, floorHeight);

    console.log(`Perspective sand floor created starting at Y: ${floorStartY} with height: ${floorHeight}`);
  }

  private createPerspectiveSandFloor(floorStartY: number, floorHeight: number): void {
    // Create a sand floor that gives the illusion of extending into the distance

    // Define color zones for depth perspective
    const nearSandColor = this.lightenColor(this.config.sandColor, 40);  // Lightest - closest to camera
    const midSandColor = this.config.sandColor;                          // Base color - middle distance
    const farSandColor = this.darkenColor(this.config.sandColor, 50);    // Darkest - far distance
    const deepSandColor = this.darkenColor(this.config.sandColor, 80);   // Very dark - deepest areas

    // Create multiple horizontal bands with different colors for depth illusion
    const bandCount = 8;
    const bandHeight = floorHeight / bandCount;

    for (let i = 0; i < bandCount; i++) {
      const bandY = floorStartY + (i * bandHeight);
      const depthRatio = i / (bandCount - 1); // 0 = near, 1 = far

      // Calculate color based on depth
      let bandColor: number;
      if (depthRatio < 0.3) {
        // Near area - lighter sand
        bandColor = this.interpolateColor(nearSandColor, midSandColor, depthRatio / 0.3);
      } else if (depthRatio < 0.7) {
        // Mid area - base to darker sand
        bandColor = this.interpolateColor(midSandColor, farSandColor, (depthRatio - 0.3) / 0.4);
      } else {
        // Far area - darkest sand
        bandColor = this.interpolateColor(farSandColor, deepSandColor, (depthRatio - 0.7) / 0.3);
      }

      // Create more natural wavy edges with multiple wave frequencies
      const points: { x: number; y: number }[] = [];
      const segments = Math.floor(this.config.screenWidth / 20); // More segments for smoother curves

      for (let j = 0; j <= segments; j++) {
        const x = (j / segments) * this.config.screenWidth;

        // Create complex wave patterns with multiple frequencies for natural look
        const baseAmplitude = 8 * (1 - depthRatio * 0.5); // Larger base waves, reduce less with distance

        // Primary wave - main sand dune pattern
        const primaryWave = Math.sin((x / this.config.screenWidth) * Math.PI * 3 + i * 0.8) * baseAmplitude;

        // Secondary wave - medium frequency details
        const secondaryWave = Math.sin((x / this.config.screenWidth) * Math.PI * 8 + i * 1.2) * (baseAmplitude * 0.4);

        // Detail wave - fine sand ripples
        const detailWave = Math.sin((x / this.config.screenWidth) * Math.PI * 15 + i * 0.3) * (baseAmplitude * 0.2);

        // Combine all waves for natural sand formation
        const totalWave = primaryWave + secondaryWave + detailWave;
        const y = bandY + totalWave;
        points.push({ x, y });
      }

      // Draw the band - clear line styles first to prevent white lines
      this.sandFloor.lineStyle(0, 0x000000, 0);
      this.sandFloor.fillStyle(bandColor);
      this.sandFloor.beginPath();
      this.sandFloor.moveTo(0, points[0].y);

      // Draw wavy top edge
      for (let j = 1; j < points.length; j++) {
        this.sandFloor.lineTo(points[j].x, points[j].y);
      }

      // Complete the band rectangle - ensure no gaps between bands
      const nextBandY = (i === bandCount - 1) ? this.config.screenHeight : bandY + bandHeight + 20; // Larger overlap to prevent gaps
      this.sandFloor.lineTo(this.config.screenWidth, nextBandY);
      this.sandFloor.lineTo(0, nextBandY);
      this.sandFloor.closePath();
      this.sandFloor.fillPath();
    }
  }

  private createDepthGradientLayers(floorStartY: number, floorHeight: number): void {
    // Add subtle gradient overlays to enhance depth perception

    // Create a subtle vertical gradient overlay
    const gradientOverlay = this.scene.add.graphics();

    // Create gradient from transparent at top to darker at bottom
    const topColor = 0x000000; // Black for darkening effect
    const bottomColor = 0x000000;

    // Apply a very subtle darkening gradient
    gradientOverlay.fillGradientStyle(
      topColor, topColor,    // Top colors (will be made transparent)
      bottomColor, bottomColor, // Bottom colors
      0.0, 0.0,             // Top alpha (transparent)
      0.3, 0.3              // Bottom alpha (subtle darkening)
    );

    gradientOverlay.fillRect(0, floorStartY, this.config.screenWidth, floorHeight);
    gradientOverlay.setDepth(1.5); // Above sand, below decorations

    // Add some texture lines for sand grain effect
    this.addSandTextureLines(floorStartY, floorHeight);

    // Store reference for cleanup
    this.depthLayers.push(gradientOverlay);
  }

  private addSandTextureLines(floorStartY: number, floorHeight: number): void {
    // Add subtle horizontal lines to simulate sand grain texture
    const textureGraphics = this.scene.add.graphics();
    const lineColor = this.darkenColor(this.config.sandColor, 30);

    textureGraphics.lineStyle(1, lineColor, 0.2); // Very subtle lines

    // Create random horizontal texture lines
    const lineCount = Math.floor(floorHeight / 8);

    for (let i = 0; i < lineCount; i++) {
      const y = floorStartY + (Math.random() * floorHeight);
      const startX = Math.random() * this.config.screenWidth * 0.2;
      const endX = startX + (Math.random() * this.config.screenWidth * 0.6);

      textureGraphics.moveTo(startX, y);
      textureGraphics.lineTo(endX, y);
    }

    textureGraphics.strokePath();
    textureGraphics.setDepth(1.8); // Above gradient, below decorations

    // Store reference for cleanup
    this.depthLayers.push(textureGraphics);
  }

  private createOceanDepthOverlay(): void {
    // Create a subtle blue overlay to simulate ocean depth effect
    const depthOverlay = this.scene.add.graphics();

    // Use a more intense blue tint that covers the entire screen
    const oceanBlue = 0x0f2557; // Deeper, more intense ocean blue
    const overlayAlpha = 0.4; // More intense blue effect for deeper ocean atmosphere

    // Fill the entire screen with the blue overlay
    depthOverlay.fillStyle(oceanBlue, overlayAlpha);
    depthOverlay.fillRect(0, 0, this.config.screenWidth, this.config.screenHeight);

    // Set depth to be above game elements but below UI (UI is at depth 1000+)
    depthOverlay.setDepth(500);

    // Store reference for cleanup
    this.depthLayers.push(depthOverlay);

    console.log('Ocean depth overlay created with blue tint for underwater atmosphere');
  }

  private createFloorDecorations(): void {
    // Manual decoration placement - spawn objects one by one with full control
    const floorStartY = this.config.screenHeight * 0.6; // Start sand at 60% down the screen

    // 🪨 MANUAL ROCK PLACEMENT - Adjust these parameters as needed
    this.spawnRock3({
      x: 1050,           // X position (0 to screenWidth)
      y: floorStartY + 150,   // Y position (floorStartY = sand surface)
      scale: 0.8,       // Size multiplier (0.5 = half size, 2.0 = double size)
      tint: 0x888888,   // Color tint (0xFFFFFF = normal, 0x666666 = darker)
      depth: 3         // Layer depth (2 = background, 3 = middle, 4 = foreground)
    });

    // 🪨 ROCK2 PLACEMENT - Different position and style
    this.spawnRock2({
      x: 250,           // X position (different from rock3)
      y: floorStartY + 170 ,   // Y position (sand surface)
      scale: 1.5,       // Slightly smaller than rock3
      tint: 0xAAAAAA,   // Lighter tint than rock3
      depth: 2         // Foreground layer (closer to camera)
    });

    // 🌿 SEAWEED3 PLACEMENT - Tall swaying seaweed
    this.spawnSeaweed3({
      x: 1100,           // X position
      y: floorStartY + 90,   // Y position (sand surface)
      scaleX: 0.7,      // Width scaling
      scaleY: 1,      // Height scaling (taller seaweed)
      tint: 0x228B22,   // Green color (forest green)
      depth: 2,         // Middle layer
      animation: true   // Enable swaying animation
    });

    // 🪸 CORAL1 PLACEMENT - First coral type
    this.spawnCoral1({
      x: 450,           // X position (left side of scene)
      y: floorStartY + 80,   // Y position (sand surface)
      scale: 0.5,       // Size multiplier
      tint: 0xFF6B6B,   // Coral red color
      depth: 3,         // Middle layer
      animation: true   // Enable gentle swaying
    });

    // 🪸 CORAL2 PLACEMENT - Second coral type
    this.spawnCoral2({
      x: 950,           // X position (right side of scene)
      y: floorStartY + 100,   // Y position (sand surface)
      scale: 0.8,       // Slightly larger than coral1
      tint: 0xFF8E8E,   // Lighter coral pink color
      depth: 2,         // Foreground layer
      animation: true   // Enable gentle swaying
    });


    // 🌿 SEAWEED2 PLACEMENT - Second seaweed type
    this.spawnSeaweed2({
      x: 1050,           // X position (far right)
      y: floorStartY + 400,   // Y position (sand surface)
      scaleX: 0.9,      // Width scaling (wider)
      scaleY: 0.9,      // Height scaling (normal height)
      tint: 0x006400,   // Dark green color
      depth: 4,         // Foreground layer
      animation: true   // Enable swaying animation
    });

    // 🪨 ROCK1 PLACEMENT - Foreground rock
    this.spawnRock1({
      x: 100,           // X position (center area)
      y: floorStartY + 400,   // Y position (sand surface)
      scale: 0.9,       // Larger size for foreground presence
      tint: 0xBBBBBB,   // Light grey color
      depth: 4          // Foreground layer (closest to camera)
    });

    // 🪸 CORAL2 PLACEMENT #2 - Second independent coral2
    this.spawnCoral2({
      x: 180,           // X position (different from first coral2)
      y: floorStartY + 300,   // Y position (sand surface)
      scale: 0.8,       // Smaller than the first coral2
      tint: 0xFFA07A,   // Light salmon color (different from first)
      depth: 2,         // Background layer (different depth)
      animation: true   // Enable gentle swaying
    });

    // 🚢 SHIPWRECK PLACEMENT - Beautiful underwater discovery
    this.spawnShipwreck({
      x: 700,           // X position (center-right area)
      y: floorStartY + 100, // Y position (slightly buried in sand)
      scale: 1.2,       // Larger size for impressive presence
      tint: 0x666666,   // Dark tint for distant/murky underwater effect
      depth: 1          // Deep background layer (furthest back)
    });

    console.log(`Created ${this.decorations.length} manually placed floor decorations`);
  }

  /**
   * 🪨 MANUAL ROCK3 SPAWNER
   * Spawns a single rock3 asset with full manual control over positioning and appearance
   *
   * @param options - Configuration object for the rock
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scale - Size multiplier (1.0 = normal, 0.5 = half size, 2.0 = double size)
   * @param options.tint - Color tint in hex (0xFFFFFF = normal, 0x666666 = darker, 0xAABBCC = custom color)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   */
  private spawnRock3(options: {
    x: number;
    y: number;
    scale: number;
    tint: number;
    depth: number;
  }): void {
    // Create the rock3 sprite at specified position
    const rock = this.scene.add.sprite(options.x, options.y, 'rock3');

    // Set origin to bottom-center so rock sits properly on sand
    rock.setOrigin(0.5, 1);

    // Apply size scaling
    rock.setScale(options.scale);

    // Apply color tinting
    rock.setTint(options.tint);

    // Set rendering depth layer
    rock.setDepth(options.depth);

    // Add to decorations array for cleanup later
    this.decorations.push({
      sprite: rock,
      type: 'rock'
    });

    console.log(`Spawned rock3 at (${options.x}, ${options.y}) with scale ${options.scale} and tint 0x${options.tint.toString(16)}`);
  }

  /**
   * 🪨 MANUAL ROCK2 SPAWNER
   * Spawns a single rock2 asset with full manual control over positioning and appearance
   *
   * @param options - Configuration object for the rock
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scale - Size multiplier (1.0 = normal, 0.5 = half size, 2.0 = double size)
   * @param options.tint - Color tint in hex (0xFFFFFF = normal, 0x666666 = darker, 0xAABBCC = custom color)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   */
  private spawnRock2(options: {
    x: number;
    y: number;
    scale: number;
    tint: number;
    depth: number;
  }): void {
    // Create the rock2 sprite at specified position
    const rock = this.scene.add.sprite(options.x, options.y, 'rock2');

    // Set origin to bottom-center so rock sits properly on sand
    rock.setOrigin(0.5, 1);

    // Apply size scaling
    rock.setScale(options.scale);

    // Apply color tinting
    rock.setTint(options.tint);

    // Set rendering depth layer
    rock.setDepth(options.depth);

    // Add to decorations array for cleanup later
    this.decorations.push({
      sprite: rock,
      type: 'rock'
    });

    console.log(`Spawned rock2 at (${options.x}, ${options.y}) with scale ${options.scale} and tint 0x${options.tint.toString(16)}`);
  }

  /**
   * 🪨 MANUAL ROCK1 SPAWNER
   * Spawns a single rock1 asset with full manual control over positioning and appearance
   *
   * @param options - Configuration object for the rock
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scale - Size multiplier (1.0 = normal, 0.5 = half size, 2.0 = double size)
   * @param options.tint - Color tint in hex (0xFFFFFF = normal, 0xBBBBBB = light grey, 0x999999 = medium grey)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   */
  private spawnRock1(options: {
    x: number;
    y: number;
    scale: number;
    tint: number;
    depth: number;
  }): void {
    // Create the rock1 sprite at specified position
    const rock = this.scene.add.sprite(options.x, options.y, 'rock1');

    // Set origin to bottom-center so rock sits properly on sand
    rock.setOrigin(0.5, 1);

    // Apply size scaling
    rock.setScale(options.scale);

    // Apply color tinting
    rock.setTint(options.tint);

    // Set rendering depth layer
    rock.setDepth(options.depth);

    // Add to decorations array for cleanup later
    const decoration: FloorDecoration = {
      sprite: rock,
      type: 'rock'
    };
    this.decorations.push(decoration);
    
    // Create debug label
    this.createDebugLabel(decoration, `Rock1 (${options.scale.toFixed(1)}x)`);

    console.log(`Spawned rock1 at (${options.x}, ${options.y}) with scale ${options.scale} and tint 0x${options.tint.toString(16)}`);
  }

  /**
   * 🌿 MANUAL SEAWEED3 SPAWNER
   * Spawns a single seaweed3 asset with full manual control over positioning, scaling, and animation
   *
   * @param options - Configuration object for the seaweed
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scaleX - Width scaling (1.0 = normal width)
   * @param options.scaleY - Height scaling (1.0 = normal height, 1.5 = taller)
   * @param options.tint - Color tint in hex (0x228B22 = forest green, 0x32CD32 = lime green)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   * @param options.animation - Enable swaying animation (true/false)
   */
  private spawnSeaweed3(options: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    tint: number;
    depth: number;
    animation: boolean;
  }): void {
    // Create the seaweed3 sprite at specified position
    const seaweed = this.scene.add.sprite(options.x, options.y, 'seaweed3');

    // Set origin to bottom-center so seaweed grows up from sand
    seaweed.setOrigin(0.5, 1);

    // Apply width and height scaling separately
    seaweed.setScale(options.scaleX, options.scaleY);

    // Apply color tinting
    seaweed.setTint(options.tint);

    // Set rendering depth layer
    seaweed.setDepth(options.depth);

    // Add swaying animation if enabled
    let animationTween: Phaser.Tweens.Tween | undefined;
    if (options.animation) {
      animationTween = this.scene.tweens.add({
        targets: seaweed,
        rotation: 0.15,        // Gentle swaying rotation (in radians)
        scaleX: options.scaleX * 1.1,  // Slight width variation
        duration: 3000,        // 3 seconds per sway
        yoyo: true,           // Sway back and forth
        repeat: -1,           // Infinite loop
        ease: 'Sine.easeInOut', // Smooth natural movement
        delay: Math.random() * 1000  // Random start delay for natural variation
      });
    }

    // Add to decorations array for cleanup later
    this.decorations.push({
      sprite: seaweed,
      type: 'seaweed',
      animationTween: animationTween
    });

    console.log(`Spawned seaweed3 at (${options.x}, ${options.y}) with scale (${options.scaleX}, ${options.scaleY}) and tint 0x${options.tint.toString(16)}`);
  }

  /**
   * 🪸 MANUAL CORAL1 SPAWNER
   * Spawns a single coral1 asset with full manual control over positioning and gentle swaying animation
   *
   * @param options - Configuration object for the coral
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scale - Size multiplier (1.0 = normal, 0.5 = half size, 1.5 = larger)
   * @param options.tint - Color tint in hex (0xFF6B6B = coral red, 0xFF4500 = orange red)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   * @param options.animation - Enable gentle swaying animation (true/false)
   */
  private spawnCoral1(options: {
    x: number;
    y: number;
    scale: number;
    tint: number;
    depth: number;
    animation: boolean;
  }): void {
    // Create the coral1 sprite at specified position
    const coral = this.scene.add.sprite(options.x, options.y, 'coral1');

    // Set origin to bottom-center so coral sits properly on sand
    coral.setOrigin(0.5, 1);

    // Apply size scaling
    coral.setScale(options.scale);

    // Apply color tinting
    coral.setTint(options.tint);

    // Set rendering depth layer
    coral.setDepth(options.depth);

    // Add gentle swaying animation if enabled
    let animationTween: Phaser.Tweens.Tween | undefined;
    if (options.animation) {
      animationTween = this.scene.tweens.add({
        targets: coral,
        rotation: 0.1,         // Gentle swaying rotation (smaller than seaweed)
        duration: 4000,        // 4 seconds per sway (slower than seaweed)
        yoyo: true,           // Sway back and forth
        repeat: -1,           // Infinite loop
        ease: 'Sine.easeInOut', // Smooth natural movement
        delay: Math.random() * 2000  // Random start delay for natural variation
      });
    }

    // Add to decorations array for cleanup later
    this.decorations.push({
      sprite: coral,
      type: 'coral',
      animationTween: animationTween
    });

    console.log(`Spawned coral1 at (${options.x}, ${options.y}) with scale ${options.scale} and tint 0x${options.tint.toString(16)}`);
  }

  /**
   * 🪸 MANUAL CORAL2 SPAWNER
   * Spawns a single coral2 asset with full manual control over positioning and gentle swaying animation
   *
   * @param options - Configuration object for the coral
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scale - Size multiplier (1.0 = normal, 0.5 = half size, 1.5 = larger)
   * @param options.tint - Color tint in hex (0xFF8E8E = coral pink, 0xFFA07A = light salmon)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   * @param options.animation - Enable gentle swaying animation (true/false)
   */
  private spawnCoral2(options: {
    x: number;
    y: number;
    scale: number;
    tint: number;
    depth: number;
    animation: boolean;
  }): void {
    // Create the coral2 sprite at specified position
    const coral = this.scene.add.sprite(options.x, options.y, 'coral2');

    // Set origin to bottom-center so coral sits properly on sand
    coral.setOrigin(0.5, 1);

    // Apply size scaling
    coral.setScale(options.scale);

    // Apply color tinting
    coral.setTint(options.tint);

    // Set rendering depth layer
    coral.setDepth(options.depth);

    // Add gentle swaying animation if enabled
    let animationTween: Phaser.Tweens.Tween | undefined;
    if (options.animation) {
      animationTween = this.scene.tweens.add({
        targets: coral,
        rotation: 0.08,        // Very gentle swaying rotation (even smaller than coral1)
        duration: 5000,        // 5 seconds per sway (slower than coral1)
        yoyo: true,           // Sway back and forth
        repeat: -1,           // Infinite loop
        ease: 'Sine.easeInOut', // Smooth natural movement
        delay: Math.random() * 2500  // Random start delay for natural variation
      });
    }

    // Add to decorations array for cleanup later
    this.decorations.push({
      sprite: coral,
      type: 'coral',
      animationTween: animationTween
    });

    console.log(`Spawned coral2 at (${options.x}, ${options.y}) with scale ${options.scale} and tint 0x${options.tint.toString(16)}`);
  }

  /**
   * 🌿 MANUAL SEAWEED1 SPAWNER
   * Spawns a single seaweed1 asset with full manual control over positioning, scaling, and animation
   *
   * @param options - Configuration object for the seaweed
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scaleX - Width scaling (1.0 = normal width)
   * @param options.scaleY - Height scaling (1.0 = normal height, 1.2 = taller)
   * @param options.tint - Color tint in hex (0x32CD32 = lime green, 0x90EE90 = light green)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   * @param options.animation - Enable swaying animation (true/false)
   */


  /**
   * 🌿 MANUAL SEAWEED2 SPAWNER
   * Spawns a single seaweed2 asset with full manual control over positioning, scaling, and animation
   *
   * @param options - Configuration object for the seaweed
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY for sand surface)
   * @param options.scaleX - Width scaling (1.0 = normal width)
   * @param options.scaleY - Height scaling (1.0 = normal height, 1.3 = taller)
   * @param options.tint - Color tint in hex (0x006400 = dark green, 0x228B22 = forest green)
   * @param options.depth - Rendering layer (2 = background, 3 = middle, 4 = foreground)
   * @param options.animation - Enable swaying animation (true/false)
   */
  private spawnSeaweed2(options: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    tint: number;
    depth: number;
    animation: boolean;
  }): void {
    // Create the seaweed2 sprite at specified position
    const seaweed = this.scene.add.sprite(options.x, options.y, 'seaweed2');

    // Set origin to bottom-center so seaweed grows up from sand
    seaweed.setOrigin(0.5, 1);

    // Apply width and height scaling separately
    seaweed.setScale(options.scaleX, options.scaleY);

    // Apply color tinting
    seaweed.setTint(options.tint);

    // Set rendering depth layer
    seaweed.setDepth(options.depth);

    // Add swaying animation if enabled
    let animationTween: Phaser.Tweens.Tween | undefined;
    if (options.animation) {
      animationTween = this.scene.tweens.add({
        targets: seaweed,
        rotation: 0.18,        // More active swaying rotation
        scaleX: options.scaleX * 1.2,  // More width variation
        duration: 2000,        // 2 seconds per sway (fastest seaweed)
        yoyo: true,           // Sway back and forth
        repeat: -1,           // Infinite loop
        ease: 'Sine.easeInOut', // Smooth natural movement
        delay: Math.random() * 600  // Random start delay for natural variation
      });
    }

    // Add to decorations array for cleanup later
    this.decorations.push({
      sprite: seaweed,
      type: 'seaweed',
      animationTween: animationTween
    });

    console.log(`Spawned seaweed2 at (${options.x}, ${options.y}) with scale (${options.scaleX}, ${options.scaleY}) and tint 0x${options.tint.toString(16)}`);
  }

  /**
   * 🚢 MANUAL SHIPWRECK SPAWNER
   * Spawns a single shipwreck boat asset with full manual control over positioning and appearance
   *
   * @param options - Configuration object for the shipwreck
   * @param options.x - X position on screen (0 to screenWidth)
   * @param options.y - Y position on screen (use floorStartY + offset for burial effect)
   * @param options.scale - Size multiplier (1.0 = normal, 1.5 = larger for impressive presence)
   * @param options.tint - Color tint in hex (0xFFFFFF = normal, 0xCCCCCC = weathered look)
   * @param options.depth - Rendering layer (1 = deep background, 2 = background, 3 = middle)
   */
  private spawnShipwreck(options: {
    x: number;
    y: number;
    scale: number;
    tint: number;
    depth: number;
  }): void {
    // Create the shipwreck sprite at specified position
    const shipwreck = this.scene.add.sprite(options.x, options.y, 'shipwreck');

    // Set origin to bottom-center so shipwreck sits properly on/in sand
    shipwreck.setOrigin(0.5, 1);

    // Apply size scaling
    shipwreck.setScale(options.scale);

    // Apply color tinting
    shipwreck.setTint(options.tint);

    // Set rendering depth layer
    shipwreck.setDepth(options.depth);

    // Add to decorations array for cleanup later
    this.decorations.push({
      sprite: shipwreck,
      type: 'backgroundRock' // Using existing type for cleanup compatibility
    });

    console.log(`Spawned shipwreck at (${options.x}, ${options.y}) with scale ${options.scale} and tint 0x${options.tint.toString(16)}`);
  }

  private lightenColor(color: number, amount: number): number {
    const c = Phaser.Display.Color.IntegerToColor(color);
    const lightened = Phaser.Display.Color.GetColor(
      Math.min(255, c.red + amount),
      Math.min(255, c.green + amount),
      Math.min(255, c.blue + amount)
    );
    return lightened;
  }

  private darkenColor(color: number, amount: number): number {
    const c = Phaser.Display.Color.IntegerToColor(color);
    const darkened = Phaser.Display.Color.GetColor(
      Math.max(0, c.red - amount),
      Math.max(0, c.green - amount),
      Math.max(0, c.blue - amount)
    );
    return darkened;
  }

  private interpolateColor(color1: number, color2: number, ratio: number): number {
    // Interpolate between two colors based on ratio (0 = color1, 1 = color2)
    const c1 = Phaser.Display.Color.IntegerToColor(color1);
    const c2 = Phaser.Display.Color.IntegerToColor(color2);

    const red = Math.round(c1.red + (c2.red - c1.red) * ratio);
    const green = Math.round(c1.green + (c2.green - c1.green) * ratio);
    const blue = Math.round(c1.blue + (c2.blue - c1.blue) * ratio);

    return Phaser.Display.Color.GetColor(red, green, blue);
  }

  public pauseAnimations(): void {
    this.decorations.forEach(decoration => {
      if (decoration.animationTween) {
        decoration.animationTween.pause();
      }
    });
  }

  public resumeAnimations(): void {
    this.decorations.forEach(decoration => {
      if (decoration.animationTween) {
        decoration.animationTween.resume();
      }
    });
  }

  public setVisible(visible: boolean): void {
    this.sandFloor.setVisible(visible);
    this.decorations.forEach(decoration => {
      decoration.sprite.setVisible(visible);
    });
  }

  public getFloorY(): number {
    // Return the start of the perspective sand floor
    return this.config.screenHeight * 0.6;
  }

  public destroy(): void {
    if (this.sandFloor) {
      this.sandFloor.destroy();
    }

    // Clean up depth layers
    this.depthLayers.forEach(layer => {
      if (layer) {
        layer.destroy();
      }
    });
    this.depthLayers = [];

    // Clean up ripple graphics
    if (this.rippleGraphics) {
      this.rippleGraphics.destroy();
    }

    // Clean up decorations
    this.decorations.forEach(decoration => {
      if (decoration.animationTween) {
        decoration.animationTween.destroy();
      }
      if (decoration.sprite) {
        decoration.sprite.destroy();
      }
    });

    this.decorations = [];
  }

  // New: Setup listener for developer mode changes
  private setupDeveloperModeListener(): void {
    const handleDeveloperModeChange = (event: CustomEvent) => {
      this.developerMode = event.detail.enabled;
      console.log(`🐛 OceanFloor - Developer mode ${this.developerMode ? 'enabled' : 'disabled'}`);
      
      // Toggle debug labels visibility
      this.decorations.forEach(decoration => {
        if (decoration.debugLabel) {
          decoration.debugLabel.setVisible(this.developerMode);
        }
      });
    };

    window.addEventListener('setDeveloperMode', handleDeveloperModeChange as EventListener);
  }

  // New: Create debug label for a decoration
  private createDebugLabel(decoration: FloorDecoration, name: string): void {
    const x = decoration.sprite.x;
    const y = decoration.sprite.y - 20; // Position above the sprite
    
    decoration.debugLabel = this.scene.add.text(x, y, name, {
      fontSize: '12px',
      color: '#ffff00', // Yellow text
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 }
    });
    
    decoration.debugLabel.setDepth(3000); // Above everything
    decoration.debugLabel.setOrigin(0.5, 1); // Center horizontally, bottom align
    decoration.debugLabel.setVisible(this.developerMode);
  }
}
