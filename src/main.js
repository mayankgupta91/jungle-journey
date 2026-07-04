class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Sky gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a4a2e, 0x1a4a2e, 0x0d2b1a, 0x0d2b1a, 1);
    bg.fillRect(0, 0, W, H);

    // Decorative jungle leaves (simple shapes)
    this.drawLeaves(W, H);

    // Main title
    const title = this.add.text(W / 2, H / 2 - 60, 'JUNGLE JOURNEY', {
      fontFamily: 'Georgia, serif',
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#f5e642',
      stroke: '#3a7a2a',
      strokeThickness: 8,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, fill: true }
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(W / 2, H / 2 + 20, 'A Wild Safari Adventure', {
      fontFamily: 'Georgia, serif',
      fontSize: '26px',
      color: '#a8e88a',
      stroke: '#1a4a2e',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Pulsing start prompt
    const prompt = this.add.text(W / 2, H / 2 + 110, '🌿  Click anywhere to begin  🌿', {
      fontFamily: 'Georgia, serif',
      fontSize: '20px',
      color: '#ffffff',
      alpha: 0.9
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.2,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Gentle float on title
    this.tweens.add({
      targets: title,
      y: H / 2 - 68,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => {
        // Future scenes will go here
        this.add.text(W / 2, H / 2, 'More coming soon!', {
          fontFamily: 'Georgia, serif',
          fontSize: '32px',
          color: '#f5e642'
        }).setOrigin(0.5);
        this.cameras.main.fadeIn(400);
      });
    });
  }

  drawLeaves(W, H) {
    const g = this.add.graphics();

    // Bottom-left leaves
    g.fillStyle(0x2d6e2d, 0.8);
    g.fillEllipse(60, H - 40, 180, 80);
    g.fillStyle(0x3a8a3a, 0.7);
    g.fillEllipse(20, H - 80, 120, 60);
    g.fillStyle(0x1e5e1e, 0.9);
    g.fillEllipse(130, H - 20, 200, 70);

    // Bottom-right leaves
    g.fillStyle(0x2d6e2d, 0.8);
    g.fillEllipse(W - 60, H - 40, 180, 80);
    g.fillStyle(0x3a8a3a, 0.7);
    g.fillEllipse(W - 20, H - 80, 120, 60);
    g.fillStyle(0x1e5e1e, 0.9);
    g.fillEllipse(W - 130, H - 20, 200, 70);

    // Top corners
    g.fillStyle(0x2d6e2d, 0.6);
    g.fillEllipse(40, 40, 140, 60);
    g.fillStyle(0x3a8a3a, 0.5);
    g.fillEllipse(W - 40, 40, 140, 60);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 650,
  backgroundColor: '#1a2e1a',
  scene: [BootScene],
  parent: document.body,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
