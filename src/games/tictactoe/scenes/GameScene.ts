import Phaser from 'phaser';
import { Difficulty, SceneData } from '../types';

export class TicTacToeGameScene extends Phaser.Scene {
  private difficulty: Difficulty = Difficulty.Hard;

  constructor() {
    super({ key: 'TicTacToeGame' });
  }

  init(data: SceneData): void {
    this.difficulty = data?.difficulty ?? Difficulty.Hard;
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 20, `Game — difficulty: ${this.difficulty}`, {
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
