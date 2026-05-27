import Phaser from 'phaser';
import { Difficulty, GameOverData, GameResult, SceneData } from '../types';

const W = 800;
const H = 600;
const HEADER_H = 72;

const PAL = {
  bg:       0x08080f,
  header:   0x071014,
  primary:  0x00ffd1,
  secondary:0x007f67,
  accent:   0xff6b6b,
  panel:    0x061c1a,
  btnBg:    0x071014,
  btnHover: 0x062c28,
  textMain: '#E6FFF9',
  textDim:  '#7FBAB0',
};

export class TicTacToeGameOverScene extends Phaser.Scene {
  private result: GameResult = GameResult.DRAW;
  private difficulty: Difficulty = Difficulty.Hard;

  constructor() {
    super({ key: 'TicTacToeGameOver' });
  }

  init(data: GameOverData): void {
    this.result     = data?.result     ?? GameResult.DRAW;
    this.difficulty = data?.difficulty ?? Difficulty.Hard;
  }

  create(): void {
    this.cameras.main.fadeIn(400, 8, 8, 15);
    this.drawBackground();
    this.drawHeader();
    this.drawResult();
    this.drawButtons();
  }

  // ─── Drawing helpers ──────────────────────────────────────────────────────

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

    const title = this.add
      .text(W / 2, HEADER_H / 2 - 12, 'TIC TAC TOE', {
        fontFamily: "Orbitron, 'Segoe UI', Roboto, sans-serif",
        fontSize: '48px',
        color: PAL.textMain,
      })
      .setOrigin(0.5);
    this.tweens.add({ targets: title, y: HEADER_H / 2, duration: 480, ease: 'Sine.Out' });
  }

  private drawResult(): void {
    const cy = Math.round((HEADER_H + 530) / 2); // vertical center between header and buttons

    // Large outcome headline
    const { headline, headlineColor, subtitle } = this.getResultStrings();

    const headText = this.add
      .text(W / 2, cy - 40, headline, {
        fontFamily: "Orbitron, 'Segoe UI', Roboto, sans-serif",
        fontSize: '56px',
        color: headlineColor,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const subText = this.add
      .text(W / 2, cy + 40, subtitle, {
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
        fontSize: '20px',
        color: PAL.textDim,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Entrance animations — headline pops in, subtitle fades after
    this.tweens.add({
      targets: headText,
      alpha: 1,
      scaleX: { from: 0.7, to: 1 },
      scaleY: { from: 0.7, to: 1 },
      duration: 320,
      ease: 'Back.Out',
      delay: 100,
    });
    this.tweens.add({
      targets: subText,
      alpha: 1,
      duration: 300,
      ease: 'Linear',
      delay: 420,
    });
  }

  private drawButtons(): void {
    // Positions per DESIGN.md: x, y = top-left corner; w=160, h=48
    this.makeButton(228, 530, 160, 48, 'PLAY AGAIN', () => {
      this.cameras.main.fadeOut(300, 8, 8, 15);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TicTacToeGame', { difficulty: this.difficulty } satisfies SceneData);
      });
    });
    this.makeButton(412, 530, 160, 48, 'MAIN MENU', () => {
      this.cameras.main.fadeOut(300, 8, 8, 15);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Launcher');
      });
    });
  }

  private makeButton(
    x: number, y: number, w: number, h: number,
    label: string, onPress: () => void,
  ): void {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const gfx = this.add.graphics();
    gfx.setPosition(cx, cy);
    let hoverTween: Phaser.Tweens.Tween | null = null;

    const draw = (hover: boolean): void => {
      gfx.clear();
      gfx.fillStyle(hover ? PAL.btnHover : PAL.btnBg, 1);
      gfx.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
      gfx.lineStyle(hover ? 3 : 2, PAL.primary, 1);
      gfx.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    };
    draw(false);

    const lbl = this.add.text(cx, cy, label, {
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
      fontSize: '22px',
      color: PAL.textMain,
    }).setOrigin(0.5);

    const zone = this.add.zone(cx, cy, w, h).setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      draw(true);
      hoverTween = this.tweens.add({
        targets: [gfx, lbl], scaleX: 1.02, scaleY: 1.02,
        duration: 180, ease: 'Sine.Out', yoyo: true, repeat: -1,
      });
    });
    zone.on('pointerout', () => {
      draw(false);
      hoverTween?.stop(); hoverTween = null;
      this.tweens.add({ targets: [gfx, lbl], scaleX: 1, scaleY: 1, duration: 100 });
    });
    zone.on('pointerdown', () => {
      hoverTween?.stop(); hoverTween = null;
      this.tweens.add({
        targets: [gfx, lbl], scaleX: 0.95, scaleY: 0.95,
        duration: 80, onComplete: () => onPress(),
      });
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private getResultStrings(): { headline: string; headlineColor: string; subtitle: string } {
    switch (this.result) {
      case GameResult.X_WINS:
        return {
          headline: 'YOU WIN!',
          headlineColor: '#FF6B6B',
          subtitle: 'Congratulations — you outsmarted the AI!',
        };
      case GameResult.O_WINS:
        return {
          headline: 'AI WINS!',
          headlineColor: '#00FFD1',
          subtitle: 'The machine got you this time. Try again?',
        };
      case GameResult.DRAW:
      default:
        return {
          headline: 'DRAW!',
          headlineColor: '#7FBAB0',
          subtitle: 'Neither player wins — well played.',
        };
    }
  }
}
