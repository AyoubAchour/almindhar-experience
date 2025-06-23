import Phaser from 'phaser';

export interface OceanBackgroundConfig {
  width: number;
  height: number;
  topColor: number;
  bottomColor: number;
  animationSpeed: number;
  waveIntensity: number;
}

export class OceanBackground {
  private scene: Phaser.Scene;
  private config: OceanBackgroundConfig;
  private backgroundGraphics!: Phaser.GameObjects.Graphics;
  private animationTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, config: OceanBackgroundConfig) {
    this.scene = scene;
    this.config = config;
    this.createOceanBackground();
    this.startAnimation();
  }

  private createOceanBackground(): void {
    // Create graphics object for the ocean background
    this.backgroundGraphics = this.scene.add.graphics();
    this.drawOceanGradient();
    
    console.log('Ocean background created with gradient effect');
  }

  private drawOceanGradient(): void {
    // Clear previous graphics
    this.backgroundGraphics.clear();

    // Create vertical gradient using fillGradientStyle (correct Phaser API)
    this.backgroundGraphics.fillGradientStyle(
      this.config.topColor,    // Top left
      this.config.topColor,    // Top right
      this.config.bottomColor, // Bottom left
      this.config.bottomColor  // Bottom right
    );

    this.backgroundGraphics.fillRect(0, 0, this.config.width, this.config.height);
  }

  private startAnimation(): void {
    // Create subtle color animation to simulate water movement
    let colorOffset = 0;

    this.animationTween = this.scene.tweens.addCounter({
      from: 0,
      to: 360,
      duration: this.config.animationSpeed,
      repeat: -1,
      onUpdate: (tween) => {
        const value = tween.getValue();
        if (value !== null) {
          colorOffset = value;
          this.updateOceanColors(colorOffset);
        }
      }
    });
  }

  private updateOceanColors(offset: number): void {
    // Calculate subtle color variations based on animation offset
    const waveEffect = Math.sin(offset * Math.PI / 180) * this.config.waveIntensity;
    
    // Adjust colors slightly for animation effect
    const topColorAdjusted = this.adjustColor(this.config.topColor, waveEffect);
    const bottomColorAdjusted = this.adjustColor(this.config.bottomColor, waveEffect * 0.5);

    // Redraw with adjusted colors
    this.backgroundGraphics.clear();
    this.backgroundGraphics.fillGradientStyle(
      topColorAdjusted,
      topColorAdjusted,
      bottomColorAdjusted,
      bottomColorAdjusted
    );
    this.backgroundGraphics.fillRect(0, 0, this.config.width, this.config.height);
  }

  private adjustColor(baseColor: number, adjustment: number): number {
    // Extract RGB components
    const color = Phaser.Display.Color.IntegerToColor(baseColor);
    
    // Apply subtle adjustment
    const adjustedR = Math.max(0, Math.min(255, color.red + adjustment));
    const adjustedG = Math.max(0, Math.min(255, color.green + adjustment));
    const adjustedB = Math.max(0, Math.min(255, color.blue + adjustment));
    
    // Convert back to integer color
    return Phaser.Display.Color.GetColor(adjustedR, adjustedG, adjustedB);
  }

  public setColors(topColor: number, bottomColor: number): void {
    this.config.topColor = topColor;
    this.config.bottomColor = bottomColor;
    this.drawOceanGradient();
  }

  public setAnimationSpeed(speed: number): void {
    this.config.animationSpeed = speed;
    
    if (this.animationTween) {
      this.animationTween.destroy();
      this.startAnimation();
    }
  }

  public setWaveIntensity(intensity: number): void {
    this.config.waveIntensity = intensity;
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

  public getGraphics(): Phaser.GameObjects.Graphics {
    return this.backgroundGraphics;
  }

  public destroy(): void {
    if (this.animationTween) {
      this.animationTween.destroy();
    }
    
    if (this.backgroundGraphics) {
      this.backgroundGraphics.destroy();
    }
  }
}
