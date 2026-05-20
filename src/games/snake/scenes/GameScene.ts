import Phaser from 'phaser';
import { setRoute } from '../../../launcher/router';

export class SnakeGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SnakeGame' });
  }

  create(): void {
    setRoute('snake');
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 40, 'SNAKE', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ff6b35',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 10, 'implement me!', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#666699',
      })
      .setOrigin(0.5);

    const backBtn = this.add
      .text(width / 2, height - 40, '← Back to Launcher', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#555577',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#ffffff'));
    backBtn.on('pointerout', () => backBtn.setColor('#555577'));
    backBtn.on('pointerdown', () => this.scene.start('Launcher'));
  }
}
