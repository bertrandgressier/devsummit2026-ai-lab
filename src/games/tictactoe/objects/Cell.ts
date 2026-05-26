import Phaser from 'phaser';
import { Player, CellValue } from '../types';
import { GRID_SIZE, CELL_SIZE, MARK_PADDING } from '../constants';

export class Cell {
  private scene: Phaser.Scene;
  private _x: number;
  private _y: number;
  private _row: number;
  private _col: number;
  private bg: Phaser.GameObjects.Rectangle;
  private hit: Phaser.GameObjects.Rectangle;
  private markG: Phaser.GameObjects.Graphics;
  private _occupied: CellValue = null;
  private callback?: (cell: Cell) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, row: number, col: number) {
    this.scene = scene;
    this._x = Math.round(x);
    this._y = Math.round(y);
    this._row = row;
    this._col = col;

    // subtle panel behind cell (very dark)
    this.bg = this.scene.add
      .rectangle(this._x, this._y, CELL_SIZE - 6, CELL_SIZE - 6, 0x0b0b12, 0.6)
      .setOrigin(0.5);

    // mark graphics
    this.markG = this.scene.add.graphics();

    // interactive hit area
    this.hit = this.scene.add
      .rectangle(this._x, this._y, CELL_SIZE, CELL_SIZE, 0x000000, 0)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.hit.on('pointerdown', () => {
      if (this.callback) this.callback(this);
    });

    this.hit.on('pointerover', () => {
      if (!this._occupied) this.bg.setFillStyle(0x00e5ff, 0.06);
    });
    this.hit.on('pointerout', () => {
      if (!this._occupied) this.bg.setFillStyle(0x0b0b12, 0.6);
    });
  }

  get row(): number {
    return this._row;
  }
  get col(): number {
    return this._col;
  }
  get occupied(): boolean {
    return this._occupied !== null;
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }

  onPointerDown(callback: (cell: Cell) => void): void {
    this.callback = callback;
  }

  private clearMark(): void {
    this.markG.clear();
  }

  drawX(): void {
    if (this._occupied) return;
    this._occupied = Player.X;
    const g = this.markG;
    const half = CELL_SIZE / 2 - MARK_PADDING;
    const x = this._x;
    const y = this._y;

    // glow layers
    g.lineStyle(22, 0x00e5ff, 0.08);
    g.strokeLineShape(new Phaser.Geom.Line(x - half, y - half, x + half, y + half));
    g.strokeLineShape(new Phaser.Geom.Line(x - half, y + half, x + half, y - half));

    g.lineStyle(16, 0x00e5ff, 0.12);
    g.strokeLineShape(new Phaser.Geom.Line(x - half, y - half, x + half, y + half));
    g.strokeLineShape(new Phaser.Geom.Line(x - half, y + half, x + half, y - half));

    g.lineStyle(10, 0x00e5ff, 1);
    g.strokeLineShape(new Phaser.Geom.Line(x - half, y - half, x + half, y + half));
    g.strokeLineShape(new Phaser.Geom.Line(x - half, y + half, x + half, y - half));

    // disable hit
    this.hit.disableInteractive();
  }

  drawO(): void {
    if (this._occupied) return;
    this._occupied = Player.O;
    const g = this.markG;
    const radius = CELL_SIZE / 2 - MARK_PADDING;
    const x = this._x;
    const y = this._y;

    g.lineStyle(22, 0xff6b6b, 0.08);
    g.strokeCircle(x, y, radius);
    g.lineStyle(16, 0xff6b6b, 0.12);
    g.strokeCircle(x, y, radius);
    g.lineStyle(10, 0xff6b6b, 1);
    g.strokeCircle(x, y, radius);

    this.hit.disableInteractive();
  }

  disable(): void {
    this.hit.disableInteractive();
    this.bg.setAlpha(0.25);
  }

  enable(): void {
    if (!this._occupied) this.hit.setInteractive({ useHandCursor: true });
    this.bg.setAlpha(1);
  }

  reset(): void {
    this._occupied = null;
    this.clearMark();
    this.hit.setInteractive({ useHandCursor: true });
    this.bg.setFillStyle(0x0b0b12, 0.6);
    this.bg.setAlpha(1);
  }

  destroy(): void {
    this.bg.destroy();
    this.hit.destroy();
    this.markG.destroy();
  }
}
