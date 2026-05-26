import Phaser from 'phaser';
import { setRoute } from '../../../launcher/router';
import { Difficulty, SceneData } from '../types';
import { COLOR_PRIMARY } from '../constants';

export class TicTacToeMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TicTacToeMenu' });
  }

  create(): void {
    setRoute('tictactoe');
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 80, 'TIC TAC TOE', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#00E5FF',
      })
      .setOrigin(0.5);

    // Difficulty toggle
    let selected: Difficulty = Difficulty.Hard;

    const easyBtn = this.add
      .text(width / 2 - 60, height / 2 - 20, 'Easy', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#555577',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const hardBtn = this.add
      .text(width / 2 + 60, height / 2 - 20, 'Hard', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const updateToggle = () => {
      if (selected === Difficulty.Easy) {
        easyBtn.setColor('#000000');
        // explicit, shared primary color
        easyBtn.setBackgroundColor(`#${COLOR_PRIMARY.toString(16).padStart(6, '0')}`);
        hardBtn.setColor('#ffffff');
        // clear background explicitly (preferred over empty string)
        (hardBtn.setBackgroundColor as unknown as (c?: string | number) => void)(undefined);
      } else {
        hardBtn.setColor('#000000');
        hardBtn.setBackgroundColor(`#${COLOR_PRIMARY.toString(16).padStart(6, '0')}`);
        easyBtn.setColor('#ffffff');
        (easyBtn.setBackgroundColor as unknown as (c?: string | number) => void)(undefined);
      }
    };

    easyBtn.on('pointerdown', () => {
      selected = Difficulty.Easy;
      updateToggle();
    });
    hardBtn.on('pointerdown', () => {
      selected = Difficulty.Hard;
      updateToggle();
    });

    updateToggle();

    const playBtn = this.add
      .text(width / 2, height / 2 + 60, 'Play', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#000000',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playBtn.setBackgroundColor(`#${COLOR_PRIMARY.toString(16).padStart(6, '0')}`);
    playBtn.on('pointerdown', () => {
      const data: SceneData = { difficulty: selected };
      this.scene.start('TicTacToeGame', data);
    });

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
  }
}
