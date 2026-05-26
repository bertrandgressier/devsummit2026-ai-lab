import Phaser from 'phaser';
import { Difficulty, SceneData, Player, GameState, GameOverData } from '../types';
import { GameLogic } from '../logic/GameLogic';
import { AIPlayer } from '../logic/AIPlayer';
import { Grid } from '../objects/Grid';

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
      .text(width / 2, 20, `Tic Tac Toe — ${this.difficulty}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#666699',
      })
      .setOrigin(0.5, 0);

    const logic = new GameLogic();
    const ai = new AIPlayer();
    const grid = new Grid(this, width / 2, height / 2 - 20);

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

    const handleMove = (row: number, col: number, player: Player) => {
      const ok = logic.makeMove(row, col, player);
      if (!ok) return;
      const cell = grid.getCell(row, col);
      if (player === Player.X) cell.drawX(); else cell.drawO();
      cell.disable();

      const res = logic.evaluate();
      if (res.state !== GameState.Playing) {
        // go to game over
        const data: GameOverData = { result: res.state, difficulty: this.difficulty };
        this.time.delayedCall(200, () => this.scene.start('TicTacToeGameOver', data));
        return;
      }

      // if next is AI
      if (player === Player.X) {
        // AI plays O
        grid.disableAll();
        this.time.delayedCall(this.difficulty === Difficulty.Easy ? 300 : 500, () => {
          const mv = ai.getBestMove(logic.cloneBoard(), this.difficulty);
          const ok2 = logic.makeMove(mv.row, mv.col, Player.O);
          if (ok2) {
            const cell2 = grid.getCell(mv.row, mv.col);
            cell2.drawO();
            cell2.disable();
          }
          const res2 = logic.evaluate();
          if (res2.state !== GameState.Playing) {
            const data: GameOverData = { result: res2.state, difficulty: this.difficulty };
            this.scene.start('TicTacToeGameOver', data);
            return;
          }
          grid.enableAll();
        });
      }
    };

    // register taps
    grid.getAllCells().forEach((cell) => {
      cell.onPointerDown((c) => {
        // human is X
        handleMove(c.row, c.col, Player.X);
      });
    });
  }
}
