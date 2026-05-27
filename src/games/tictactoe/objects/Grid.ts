import Phaser from 'phaser';
import { Cell } from './Cell';
import { Player } from '../types';

// Grid is a pure rendering container.
// Input is handled by a world-space Zone in GameScene (see GameScene.setupGame).

const BOARD_SIZE = 420;
const CELL_SIZE = 140;
const GRID_LINE_COLOR = 0x007f67;
const GRID_LINE_THICKNESS = 8;
const WIN_LINE_PADDING = 10;

export class Grid extends Phaser.GameObjects.Container {
  private cells: Cell[] = [];
  private winGfx!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, boardX: number, boardY: number) {
    super(scene, boardX, boardY);
    scene.add.existing(this);
    this.drawGridLines();
    this.createCells();
    this.winGfx = scene.add.graphics();
    this.add(this.winGfx);
  }

  private drawGridLines(): void {
    const gfx = this.scene.add.graphics();
    gfx.lineStyle(GRID_LINE_THICKNESS, GRID_LINE_COLOR, 1);
    // 2 vertical lines at x=140 and x=280
    gfx.lineBetween(CELL_SIZE,     0,          CELL_SIZE,     BOARD_SIZE);
    gfx.lineBetween(CELL_SIZE * 2, 0,          CELL_SIZE * 2, BOARD_SIZE);
    // 2 horizontal lines at y=140 and y=280
    gfx.lineBetween(0,          CELL_SIZE,     BOARD_SIZE, CELL_SIZE);
    gfx.lineBetween(0,          CELL_SIZE * 2, BOARD_SIZE, CELL_SIZE * 2);
    this.add(gfx);
  }

  private createCells(): void {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = r * 3 + c;
        const x = c * CELL_SIZE + CELL_SIZE / 2;
        const y = r * CELL_SIZE + CELL_SIZE / 2;
        const cell = new Cell(this.scene, x, y, idx);
        // No cellclick listener — clicks handled by board Zone in GameScene
        this.add(cell);
        this.cells.push(cell);
      }
    }
  }

  getCell(row: number, col: number): Cell {
    return this.cells[row * 3 + col];
  }

  getAllCells(): Cell[] { return [...this.cells]; }

  setCellMark(index: number, player: Player | null): void {
    const cell = this.cells[index];
    if (cell) cell.setMark(player);
  }

  /**
   * Animate the win line across winning cells.
   * Stroke length animated 0→100% over 500 ms (Linear) per DESIGN.md.
   */
  drawWinLine(winningCells: number[], onComplete?: () => void): void {
    if (winningCells.length < 3) { onComplete?.(); return; }

    const [a, , c] = winningCells;
    const rowA = Math.floor(a / 3);
    const colA = a % 3;
    const rowC = Math.floor(c / 3);
    const colC = c % 3;

    let sx: number, sy: number, ex: number, ey: number;

    if (rowA === rowC) {
      // Horizontal
      sy = ey = rowA * CELL_SIZE + CELL_SIZE / 2;
      sx = WIN_LINE_PADDING;
      ex = BOARD_SIZE - WIN_LINE_PADDING;
    } else if (colA === colC) {
      // Vertical
      sx = ex = colA * CELL_SIZE + CELL_SIZE / 2;
      sy = WIN_LINE_PADDING;
      ey = BOARD_SIZE - WIN_LINE_PADDING;
    } else if (colA < colC) {
      // TL → BR diagonal (cells 0,4,8)
      sx = WIN_LINE_PADDING;              sy = WIN_LINE_PADDING;
      ex = BOARD_SIZE - WIN_LINE_PADDING; ey = BOARD_SIZE - WIN_LINE_PADDING;
    } else {
      // TR → BL diagonal (cells 2,4,6)
      sx = BOARD_SIZE - WIN_LINE_PADDING; sy = WIN_LINE_PADDING;
      ex = WIN_LINE_PADDING;              ey = BOARD_SIZE - WIN_LINE_PADDING;
    }

    const progress = { value: 0 };
    const gfx = this.winGfx;
    gfx.clear();

    this.scene.tweens.add({
      targets: progress,
      value: 1,
      duration: 500,
      ease: 'Linear',
      onUpdate: () => {
        gfx.clear();
        gfx.lineStyle(10, 0xff6b6b, 1);
        gfx.lineBetween(
          sx, sy,
          sx + (ex - sx) * progress.value,
          sy + (ey - sy) * progress.value,
        );
      },
      onComplete: () => onComplete?.(),
    });
  }

  reset(): void {
    this.cells.forEach((c) => c.reset());
    this.winGfx.clear();
  }

  destroy(): void {
    this.cells.forEach((c) => c.destroy());
    super.destroy();
  }
}
