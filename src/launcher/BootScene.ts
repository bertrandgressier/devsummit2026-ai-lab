import Phaser from 'phaser';
import { getStartScene } from './router';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload(): void {
    this.load.image('devsummit-banner', 'assets/images/devsummit.png');
  }

  create(): void {
    this.scene.start(getStartScene());
  }
}
