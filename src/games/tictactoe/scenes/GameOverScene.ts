import Phaser from 'phaser';
import { Difficulty, GameOverData, GameState } from '../types';
import { COLOR_PRIMARY } from '../constants';

export class TicTacToeGameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TicTacToeGameOver' });
  }

  create(data: GameOverData): void {
    const result = data?.result ?? GameState.Draw;
    const difficulty = data?.difficulty ?? Difficulty.Hard;
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 40, 'Game Over', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#666699',
      })
      .setOrigin(0.5);

    const which = result === GameState.WonX ? 'X wins' : result === GameState.WonO ? 'O wins' : 'Draw';
    const color = result === GameState.WonO ? '#FF6B6B' : '#00E5FF';

    this.add
      .text(width / 2, height / 2 - 4, `${which} — difficulty: ${difficulty}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color,
      })
      .setOrigin(0.5);

    const playAgain = this.add
      .text(width / 2, height / 2 + 40, 'Play Again', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#000000',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    playAgain.setBackgroundColor(`#${COLOR_PRIMARY.toString(16).padStart(6, '0')}`);
    playAgain.on('pointerdown', () => {
      this.scene.start('TicTacToeGame', { difficulty });
    });

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
