import Phaser from 'phaser';
import { setRoute } from '../../../launcher/router';
import { Difficulty } from '../types';

const W = 800;
const H = 600;
const HEADER_H = 72;

const PAL = {
  bg:       0x08080f,
  header:   0x071014,
  primary:  0x00ffd1,
  secondary:0x007f67,
  accent:   0xff6b6b,
  btnBg:    0x071014,
  btnHover: 0x062c28,
  textMain: '#E6FFF9',
  textDim:  '#7FBAB0',
};

export class TicTacToeMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TicTacToeMenu' });
  }

  create(): void {
    setRoute('tictactoe');
    this.cameras.main.fadeIn(400, 8, 8, 15);

    this.drawBackground();
    this.drawHeader();
    this.drawDecorativeGrid();
    this.drawSubtitle();
    this.drawButtons();
  }

  private drawBackground(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(PAL.bg, 1);
    gfx.fillRect(0, 0, W, H);
  }

  private drawHeader(): void {
    const gfx = this.add.graphics();
    gfx.fillStyle(PAL.header, 1);
    gfx.fillRect(0, 0, W, HEADER_H);
    gfx.lineStyle(2, PAL.secondary, 0.6);
    gfx.lineBetween(0, HEADER_H, W, HEADER_H);

    // Title starts 12px above final position (y=36) then animates down — spec: 480ms Sine.Out
    const title = this.add
      .text(W / 2, HEADER_H / 2 - 12, 'TIC TAC TOE', {
        fontFamily: "Orbitron, 'Segoe UI', Roboto, sans-serif",
        fontSize: '48px',
        color: PAL.textMain,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: HEADER_H / 2,
      duration: 480,
      ease: 'Sine.Out',
    });
  }

  private drawDecorativeGrid(): void {
    // Mini 3×3 grid preview centered between header and buttons
    const cx = W / 2;
    const cy = Math.round((HEADER_H + 530) / 2); // midpoint between header bottom and buttons top
    const boardSize = 240;
    const cellSize = boardSize / 3;
    const bx = cx - boardSize / 2;
    const by = cy - boardSize / 2;

    const gfx = this.add.graphics();

    // Grid lines — 2 vertical, 2 horizontal
    gfx.lineStyle(4, PAL.secondary, 0.8);
    gfx.lineBetween(bx + cellSize,     by + 8,            bx + cellSize,     by + boardSize - 8);
    gfx.lineBetween(bx + cellSize * 2, by + 8,            bx + cellSize * 2, by + boardSize - 8);
    gfx.lineBetween(bx + 8,            by + cellSize,     bx + boardSize - 8, by + cellSize);
    gfx.lineBetween(bx + 8,            by + cellSize * 2, bx + boardSize - 8, by + cellSize * 2);

    // Sample symbols: col, row, symbol
    const symbols: Array<[number, number, 'X' | 'O']> = [
      [0, 0, 'X'],
      [1, 1, 'O'],
      [2, 0, 'X'],
      [0, 2, 'O'],
    ];

    const r = 24;
    for (const [col, row, sym] of symbols) {
      const scx = bx + col * cellSize + cellSize / 2;
      const scy = by + row * cellSize + cellSize / 2;
      if (sym === 'X') {
        gfx.lineStyle(7, PAL.accent, 0.85);
        gfx.lineBetween(scx - r, scy - r, scx + r, scy + r);
        gfx.lineBetween(scx + r, scy - r, scx - r, scy + r);
      } else {
        gfx.lineStyle(7, PAL.primary, 0.85);
        gfx.strokeCircle(scx, scy, r);
      }
    }

    gfx.setAlpha(0);
    this.tweens.add({ targets: gfx, alpha: 1, duration: 500, delay: 250 });
  }

  private drawSubtitle(): void {
    const text = this.add
      .text(W / 2, 460, 'Human vs AI — can you beat the machine?', {
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        fontSize: '18px',
        color: PAL.textDim,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({ targets: text, alpha: 1, duration: 400, delay: 400 });
  }

  private drawButtons(): void {
    // Positions from DESIGN.md (x, y = top-left corner): w=160, h=48, radius=8
    // x=228 → center 308; x=412 → center 492; y=530 → center 554
    this.createButton(228, 530, 160, 48, 'PLAY', () => {
      this.cameras.main.fadeOut(300, 8, 8, 15);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TicTacToeGame', { difficulty: Difficulty.Hard } satisfies { difficulty: Difficulty });
      });
    });

    this.createButton(412, 530, 160, 48, 'BACK', () => {
      this.cameras.main.fadeOut(300, 8, 8, 15);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Launcher');
      });
    });
  }

  // x, y are the top-left corner of the button (matches DESIGN.md coordinate convention)
  private createButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    onPress: () => void
  ): void {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radius = 8;

    // Graphics positioned at button center so scale tween pivots from center
    const gfx = this.add.graphics();
    gfx.setPosition(cx, cy);

    let hoverTween: Phaser.Tweens.Tween | null = null;

    const drawBtn = (hover: boolean): void => {
      gfx.clear();
      gfx.fillStyle(hover ? PAL.btnHover : PAL.btnBg, 1);
      gfx.fillRoundedRect(-w / 2, -h / 2, w, h, radius);
      gfx.lineStyle(hover ? 3 : 2, PAL.primary, 1);
      gfx.strokeRoundedRect(-w / 2, -h / 2, w, h, radius);
    };

    drawBtn(false);

    const lbl = this.add
      .text(cx, cy, label, {
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        fontSize: '22px',
        color: PAL.textMain,
      })
      .setOrigin(0.5);

    // Invisible hit zone over the button area
    const zone = this.add
      .zone(cx, cy, w, h)
      .setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      drawBtn(true);
      hoverTween = this.tweens.add({
        targets: [gfx, lbl],
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 180,
        ease: 'Sine.Out',
        yoyo: true,
        repeat: -1,
      });
    });

    zone.on('pointerout', () => {
      drawBtn(false);
      hoverTween?.stop();
      hoverTween = null;
      this.tweens.add({
        targets: [gfx, lbl],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    zone.on('pointerdown', () => {
      hoverTween?.stop();
      hoverTween = null;
      this.tweens.add({
        targets: [gfx, lbl],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 80,
        onComplete: () => onPress(),
      });
    });
  }
}
