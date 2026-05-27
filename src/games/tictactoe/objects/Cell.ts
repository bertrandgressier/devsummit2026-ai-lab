import Phaser from 'phaser';
import { Player } from '../types';

// Phaser 3.60+ does not reliably propagate hit-area transforms through nested
// Containers.  Cell is a rendering-only Container — all input is handled at
// scene level via a world-space Zone (see GameScene).

const SYMBOL_RADIUS = 50;
const SYMBOL_STROKE = 12;
const COLOR_X = 0xff6b6b;
const COLOR_O = 0x00ffd1;

export class Cell extends Phaser.GameObjects.Container {
  private markGfx?: Phaser.GameObjects.Graphics;
  private _index: number;
  private _occupied: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    super(scene, x, y);
    this._index = index;
    scene.add.existing(this);
    // No setInteractive — input is owned by the board Zone in GameScene
  }

  get index(): number { return this._index; }
  get row(): number { return Math.floor(this._index / 3); }
  get col(): number { return this._index % 3; }
  get occupied(): boolean { return this._occupied; }

  setMark(player: Player | null): void {
    if (player === Player.X) this.drawX();
    else if (player === Player.O) this.drawO();
    else this.drawEmpty();
  }

  drawEmpty(): void {
    this.clearMark();
    this._occupied = false;
  }

  drawX(): void {
    this.clearMark();
    const gfx = this.scene.add.graphics();
    gfx.lineStyle(SYMBOL_STROKE, COLOR_X, 1);
    gfx.lineBetween(-SYMBOL_RADIUS, -SYMBOL_RADIUS,  SYMBOL_RADIUS,  SYMBOL_RADIUS);
    gfx.lineBetween( SYMBOL_RADIUS, -SYMBOL_RADIUS, -SYMBOL_RADIUS,  SYMBOL_RADIUS);
    this.markGfx = gfx;
    this.add(gfx);
    this._occupied = true;
    this.animateMark(gfx);
  }

  drawO(): void {
    this.clearMark();
    const gfx = this.scene.add.graphics();
    gfx.lineStyle(SYMBOL_STROKE, COLOR_O, 1);
    gfx.strokeCircle(0, 0, SYMBOL_RADIUS);
    this.markGfx = gfx;
    this.add(gfx);
    this._occupied = true;
    this.animateMark(gfx);
  }

  reset(): void {
    this.drawEmpty();
  }

  private animateMark(gfx: Phaser.GameObjects.Graphics): void {
    gfx.setAlpha(0).setScale(0.6);
    this.scene.tweens.add({ targets: gfx, alpha: 1, duration: 160, ease: 'Linear' });
    this.scene.tweens.add({ targets: gfx, scaleX: 1, scaleY: 1, duration: 260, ease: 'Back.Out' });
  }

  private clearMark(): void {
    if (this.markGfx) {
      this.markGfx.destroy();
      this.markGfx = undefined;
    }
  }

  destroy(fromScene?: boolean): void {
    this.clearMark();
    super.destroy(fromScene);
  }

  // Kept as API stubs so Grid can still call them without error
  // (actual input gating is done in GameScene via the board Zone)
  disable(): void { /* no-op: input owned by board Zone */ }
  enable():  void { /* no-op: input owned by board Zone */ }
}
