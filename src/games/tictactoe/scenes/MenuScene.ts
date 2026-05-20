import Phaser from 'phaser';
import { setRoute } from '../../../launcher/router';

export class TicTacToeMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TicTacToeMenu' });
  }

  create(): void {
    setRoute('tictactoe');
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 40, 'TIC TAC TOE', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, 'implement me!', {
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
