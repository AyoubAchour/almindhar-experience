import Phaser from 'phaser';

export interface LightRayConfig {
  screenWidth: number;
  screenHeight: number;
  rayCount: number;
  rayWidth: number;
  rayColor: number;
  rayAlpha: number;
  animationSpeed: number;
  segmentCount: number;
}

export interface LightRay {
  graphics: Phaser.GameObjects.Graphics;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  segments: { x: number; y: number; alpha: number }[];
}

export class LightRaySystem {
  private scene: Phaser.Scene;
  private config: LightRayConfig;
  private lightRays: LightRay[] = [];
  private animationTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, config: LightRayConfig) {
    this.scene = scene;
    this.config = config;
    this.createLightRays();
    this.startAnimation();
  }

  private createLightRays(): void {
    // 🌟 MANUAL LIGHT RAY PLACEMENT - Adjust these parameters as needed
    this.createManualLightRay({
      startX: 350,                    // X start position (0 = left edge, screenWidth = right edge)
      startY: -50,                    // Y start position (0 = top edge)
      length: 5000,                  // How far the ray extends (in pixels)
      angle: 70,                    // Ray angle in degrees (0 = horizontal right, 90 = straight down, 135 = diagonal down-right)
      width: 250,                    // Ray width/thickness
      color: 0xCCFFFF,             // Ray color (0xFFFFAA = light yellow, 0xFFFFFF = white)
      alpha: 0.1,                  // Ray transparency (0.0 = invisible, 1.0 = solid)
      segmentCount: 300             // Number of segments (higher = smoother)
    });

    console.log(`Created ${this.lightRays.length} manual light ray`);
  }

  /**
   * 🌟 MANUAL LIGHT RAY CREATOR
   * Creates a single light ray with full manual control over all parameters
   *
   * @param options - Configuration object for the light ray
   * @param options.startX - X start position (0 = left edge, screenWidth = right edge)
   * @param options.startY - Y start position (0 = top edge)
   * @param options.length - How far the ray extends (in pixels)
   * @param options.angle - Ray angle in degrees (0 = horizontal right, 90 = straight down, 135 = diagonal down-right)
   * @param options.width - Ray thickness/width in pixels
   * @param options.color - Ray color in hex (0xFFFFAA = light yellow, 0xFFFFFF = white)
   * @param options.alpha - Ray transparency (0.0 = invisible, 1.0 = solid)
   * @param options.segmentCount - Number of segments for smoothness (higher = smoother)
   */
  private createManualLightRay(options: {
    startX: number;
    startY: number;
    length: number;
    angle: number;
    width: number;
    color: number;
    alpha: number;
    segmentCount: number;
  }): void {
    // Calculate end position from angle and length
    const angleInRadians = (options.angle * Math.PI) / 180; // Convert degrees to radians
    const endX = options.startX + Math.cos(angleInRadians) * options.length;
    const endY = options.startY + Math.sin(angleInRadians) * options.length;

    // Create graphics object for this light ray
    const graphics = this.scene.add.graphics();
    graphics.setBlendMode(Phaser.BlendModes.ADD); // Additive blending for light effect
    graphics.setDepth(100); // Set depth to appear above ocean but below UI

    // Create segments for smooth light ray
    const segments: { x: number; y: number; alpha: number }[] = [];

    for (let i = 0; i <= options.segmentCount; i++) {
      const t = i / options.segmentCount;
      const x = Phaser.Math.Interpolation.Linear([options.startX, endX], t);
      const y = Phaser.Math.Interpolation.Linear([options.startY, endY], t);

      // Calculate alpha based on distance from start (fade towards end)
      const distanceFromStart = t;
      const alpha = options.alpha * (1 - distanceFromStart * 0.8); // Fade to 20% at end

      segments.push({ x, y, alpha });
    }

    const lightRay: LightRay = {
      graphics,
      startX: options.startX,
      startY: options.startY,
      endX: endX,
      endY: endY,
      segments
    };

    // Store the custom parameters for this ray
    (lightRay as any).customWidth = options.width;
    (lightRay as any).customColor = options.color;
    (lightRay as any).customAlpha = options.alpha;

    this.lightRays.push(lightRay);
    this.drawManualLightRay(lightRay);

    console.log(`Created manual light ray from (${options.startX}, ${options.startY}) to (${endX.toFixed(1)}, ${endY.toFixed(1)}) at ${options.angle}° angle`);
  }

  private drawManualLightRay(lightRay: LightRay): void {
    lightRay.graphics.clear();

    // Get custom parameters or fall back to config defaults
    const rayWidth = (lightRay as any).customWidth || this.config.rayWidth;
    const rayColor = (lightRay as any).customColor || this.config.rayColor;

    // Draw the light ray as connected segments with varying alpha
    for (let i = 0; i < lightRay.segments.length - 1; i++) {
      const currentSegment = lightRay.segments[i];
      const nextSegment = lightRay.segments[i + 1];

      // Set line style for this segment using custom parameters
      lightRay.graphics.lineStyle(
        rayWidth,
        rayColor,
        currentSegment.alpha
      );

      // Draw line segment
      lightRay.graphics.beginPath();
      lightRay.graphics.moveTo(currentSegment.x, currentSegment.y);
      lightRay.graphics.lineTo(nextSegment.x, nextSegment.y);
      lightRay.graphics.strokePath();
    }
  }



  private startAnimation(): void {
    let animationOffset = 0;

    this.animationTween = this.scene.tweens.addCounter({
      from: 0,
      to: 360,
      duration: this.config.animationSpeed,
      repeat: -1,
      onUpdate: (tween) => {
        const value = tween.getValue();
        if (value !== null) {
          animationOffset = value;
          this.updateLightRayAnimation(animationOffset);
        }
      }
    });
  }

  private updateLightRayAnimation(offset: number): void {
    // Update each light ray with subtle animation
    this.lightRays.forEach((lightRay, index) => {
      // Calculate wave effect for this ray
      const waveOffset = offset + (index * 60); // Offset each ray slightly
      const waveIntensity = Math.sin(waveOffset * Math.PI / 180) * 0.3;

      // Get custom alpha or fall back to config default
      const baseRayAlpha = (lightRay as any).customAlpha || this.config.rayAlpha;

      // Update segment alphas with wave effect
      lightRay.segments.forEach((segment, segmentIndex) => {
        const segmentCount = (lightRay as any).customSegmentCount || this.config.segmentCount;
        const t = segmentIndex / segmentCount;
        const baseAlpha = baseRayAlpha * (1 - t * 0.8);
        segment.alpha = Math.max(0, baseAlpha + waveIntensity * baseAlpha);
      });

      // Redraw the light ray using manual method
      this.drawManualLightRay(lightRay);
    });
  }

  public setRayColor(color: number): void {
    this.config.rayColor = color;
    this.lightRays.forEach(lightRay => this.drawManualLightRay(lightRay));
  }

  public setRayAlpha(alpha: number): void {
    this.config.rayAlpha = Math.max(0, Math.min(1, alpha));
    this.lightRays.forEach(lightRay => this.drawManualLightRay(lightRay));
  }

  public setAnimationSpeed(speed: number): void {
    this.config.animationSpeed = speed;
    
    if (this.animationTween) {
      this.animationTween.destroy();
      this.startAnimation();
    }
  }

  public pauseAnimation(): void {
    if (this.animationTween) {
      this.animationTween.pause();
    }
  }

  public resumeAnimation(): void {
    if (this.animationTween) {
      this.animationTween.resume();
    }
  }

  public setVisible(visible: boolean): void {
    this.lightRays.forEach(lightRay => {
      lightRay.graphics.setVisible(visible);
    });
  }

  public destroy(): void {
    if (this.animationTween) {
      this.animationTween.destroy();
    }

    this.lightRays.forEach(lightRay => {
      if (lightRay.graphics) {
        lightRay.graphics.destroy();
      }
    });

    this.lightRays = [];
  }
}
