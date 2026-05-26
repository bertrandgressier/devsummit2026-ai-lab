import Phaser from 'phaser';

export class Cell {
  constructor(
    _scene: Phaser.Scene,
    _x: number,
    _y: number,
    _row: number,
    _col: number
  ) {}

  get row(): number { return 0; }
  get col(): number { return 0; }
  get occupied(): boolean { return false; }
  get x(): number { return 0; }
  get y(): number { return 0; }

  onPointerDown(_callback: (cell: Cell) => void): void {}
  drawX(): void {}
  drawO(): void {}
  disable(): void {}
  enable(): void {}
  reset(): void {}
  destroy(): void {}
}
