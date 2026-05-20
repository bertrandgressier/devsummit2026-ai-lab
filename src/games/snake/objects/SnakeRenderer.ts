import Phaser from 'phaser';
import { Position } from '../types';

export class SnakeRenderer {
  private readonly gfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.gfx = scene.add.graphics();
  }

  draw(_snake: Position[], _food: Position): void {
    this.gfx.clear();
  }
}
