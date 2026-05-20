import Phaser from 'phaser';
import { Difficulty, GameOverData, GameState } from '../types';

export class TicTacToeGameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TicTacToeGameOver' });
  }

  create(data: GameOverData): void {
    const result = data?.result ?? GameState.Draw;
    const difficulty = data?.difficulty ?? Difficulty.Hard;
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 20, `Result: ${result} (${difficulty})`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#666699',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, 'implement me!', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#555577',
      })
      .setOrigin(0.5);
  }
}
