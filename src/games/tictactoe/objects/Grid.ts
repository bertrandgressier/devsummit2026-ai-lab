import Phaser from 'phaser';
import { Cell } from './Cell';

export class Grid {
  constructor(_scene: Phaser.Scene, _cx: number, _cy: number) {}

  getCell(_row: number, _col: number): Cell {
    return new Cell({} as Phaser.Scene, 0, 0, 0, 0);
  }

  getAllCells(): Cell[] { return []; }
  disableAll(): void {}
  enableAll(): void {}
  reset(): void {}
  destroy(): void {}
}
