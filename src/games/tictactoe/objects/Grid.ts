import Phaser from 'phaser';
import { Cell } from './Cell';
import { GRID_SIZE, CELL_SIZE, COLOR_ACCENT } from '../constants';

export class Grid {
  private scene: Phaser.Scene;
  private cx: number;
  private cy: number;
  private cells: Cell[][] = [];
  private linesG: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, cx: number, cy: number) {
    this.scene = scene;
    this.cx = cx;
    this.cy = cy;

    this.linesG = this.scene.add.graphics();
    this.drawGrid();

    const gridX = Math.round(this.cx - GRID_SIZE / 2);
    const gridY = Math.round(this.cy - GRID_SIZE / 2);

    for (let r = 0; r < 3; r++) {
      this.cells[r] = [];
      for (let c = 0; c < 3; c++) {
        const cellCenterX = gridX + c * CELL_SIZE + CELL_SIZE / 2;
        const cellCenterY = gridY + r * CELL_SIZE + CELL_SIZE / 2;
        const cell = new Cell(this.scene, cellCenterX, cellCenterY, r, c);
        this.cells[r][c] = cell;
      }
    }
  }

  private drawGrid(): void {
    const g = this.linesG;
    const gridX = Math.round(this.cx - GRID_SIZE / 2);
    const gridY = Math.round(this.cy - GRID_SIZE / 2);

    g.clear();
    g.lineStyle(6, COLOR_ACCENT, 1);
    // vertical lines
    g.strokeLineShape(new Phaser.Geom.Line(gridX + CELL_SIZE, gridY, gridX + CELL_SIZE, gridY + GRID_SIZE));
    g.strokeLineShape(new Phaser.Geom.Line(gridX + CELL_SIZE * 2, gridY, gridX + CELL_SIZE * 2, gridY + GRID_SIZE));
    // horizontal
    g.strokeLineShape(new Phaser.Geom.Line(gridX, gridY + CELL_SIZE, gridX + GRID_SIZE, gridY + CELL_SIZE));
    g.strokeLineShape(new Phaser.Geom.Line(gridX, gridY + CELL_SIZE * 2, gridX + GRID_SIZE, gridY + CELL_SIZE * 2));
  }

  getCell(row: number, col: number): Cell {
    return this.cells[row][col];
  }

  getAllCells(): Cell[] {
    return this.cells.flat();
  }

  disableAll(): void {
    this.getAllCells().forEach((c) => c.disable());
  }

  enableAll(): void {
    this.getAllCells().forEach((c) => c.enable());
  }

  reset(): void {
    this.getAllCells().forEach((c) => c.reset());
  }

  destroy(): void {
    this.getAllCells().forEach((c) => c.destroy());
    this.linesG.destroy();
  }
}
