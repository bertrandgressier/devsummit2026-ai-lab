import Phaser from 'phaser';
import { setRoute } from './router';

const PALETTE = {
  bg: 0x080813,
  cardBg: 0x0f0f28,
  cardBgHover: 0x161636,
  teal: 0x00d4aa,
  coral: 0xff6b35,
  blue: 0x6666ff,
  purple: 0xaa66ff,
  white: 0xffffff,
  dim: 0x666699,
  tealStr: '#00d4aa',
  coralStr: '#ff6b35',
  blueStr: '#6666ff',
  purpleStr: '#aa66ff',
  whiteStr: '#ffffff',
  dimStr: '#555577',
  mutedStr: '#9999bb',
};

const TIPS = [
  'Context is the new code — feed your agents ARCHITECTURE.md first',
  'Small model + precise context  >  large model + vague prompt',
  'One agent, one responsibility. Sound familiar?',
  'Your AGENTS.md is the team contract nobody breaks',
  'Skills are the new npm packages — import and reuse',
  'The best prompt is one your small model cannot misunderstand',
  'Think in sessions, not messages — context is cumulative',
  'An agent without constraints is just a hallucination engine',
  'Start with the types. The types define the problem.',
  'The future of dev: writing instructions for machines that write code',
];

export class LauncherScene extends Phaser.Scene {
  private tipText!: Phaser.GameObjects.Text;
  private tipIndex = 0;

  constructor() {
    super({ key: 'Launcher' });
  }

  create(): void {
    setRoute('launcher');
    const { width, height } = this.scale;

    this.drawBackground(width, height);
    const bannerBottom = this.placeBanner(width);
    this.drawAccentStripes(width, bannerBottom);
    this.drawLabHeader(width, bannerBottom + 22);
    this.drawGameCards(width, height);
    this.drawTipBar(width, height);
    this.drawFooter(width, height);

    this.cameras.main.fadeIn(500, 8, 8, 19);
    this.startTipCycle();
  }

  private drawBackground(width: number, height: number): void {
    const gfx = this.add.graphics();
    gfx.fillGradientStyle(0x08080f, 0x08080f, 0x0a0a18, 0x0a0a18, 1);
    gfx.fillRect(0, 0, width, height);

    gfx.lineStyle(1, PALETTE.blue, 0.06);
    for (let x = 0; x < width; x += 40) {
      gfx.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
      gfx.lineBetween(0, y, width, y);
    }
  }

  private placeBanner(width: number): number {
    const banner = this.add.image(width / 2, 0, 'devsummit-banner');
    const bannerHeight = Math.round(banner.height * (width / banner.width));
    banner.setDisplaySize(width, bannerHeight);
    banner.setOrigin(0.5, 0);
    return bannerHeight;
  }

  private drawAccentStripes(width: number, y: number): void {
    const gfx = this.add.graphics();
    const stripes = [
      { color: PALETTE.coral, offset: 0, h: 3 },
      { color: PALETTE.teal, offset: 5, h: 3 },
      { color: PALETTE.purple, offset: 10, h: 2 },
    ];
    for (const s of stripes) {
      gfx.fillStyle(s.color, 0.85);
      gfx.fillRect(0, y + s.offset, width, s.h);
    }
  }

  private drawLabHeader(width: number, y: number): void {
    const cx = width / 2;

    this.add
      .text(cx, y + 14, 'AI4DEV LAB', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: PALETTE.whiteStr,
        letterSpacing: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(cx, y + 50, '2026  —  DEVELOPER EDITION', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: PALETTE.dimStr,
        letterSpacing: 5,
      })
      .setOrigin(0.5);

    this.add
      .text(cx, y + 72, 'Choose your challenge', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: PALETTE.mutedStr,
      })
      .setOrigin(0.5);
  }

  private drawGameCards(width: number, height: number): void {
    const cardW = 290;
    const cardH = 210;
    const cardY = height * 0.62;
    const gap = 28;
    // compute three evenly spaced positions (left, center, right)
    const totalW = cardW * 3 + gap * 2;
    const startX = width / 2 - totalW / 2 + cardW / 2;
    const positions = [0, 1, 2].map(i => startX + i * (cardW + gap));

    this.createGameCard(positions[0], cardY, cardW, cardH, {
      label: 'CHALLENGE #1',
      title: 'TIC TAC TOE',
      accentColor: PALETTE.teal,
      accentStr: PALETTE.tealStr,
      drawIcon: (gfx, cx, cy) => this.drawTicTacToeIcon(gfx, cx, cy),
      targetScene: 'TicTacToeMenu',
    });

    this.createGameCard(positions[1], cardY, cardW, cardH, {
      label: 'CHALLENGE #2',
      title: 'SNAKE',
      accentColor: PALETTE.coral,
      accentStr: PALETTE.coralStr,
      drawIcon: (gfx, cx, cy) => this.drawSnakeIcon(gfx, cx, cy),
      targetScene: 'SnakeGame',
    });

    this.createGameCard(positions[2], cardY, cardW, cardH, {
      label: 'CHALLENGE #3',
      title: 'TETRIS',
      accentColor: PALETTE.blue,
      accentStr: PALETTE.blueStr,
      drawIcon: (gfx, cx, cy) => this.drawTetrisIcon(gfx, cx, cy),
      targetScene: 'TetrisMenu',
    });
  }

  private createGameCard(
    cx: number,
    cy: number,
    w: number,
    h: number,
    opts: {
      label: string;
      title: string;
      accentColor: number;
      accentStr: string;
      drawIcon: (gfx: Phaser.GameObjects.Graphics, cx: number, cy: number) => void;
      targetScene: string;
    }
  ): void {
    const halfW = w / 2;
    const halfH = h / 2;

    const cardGfx = this.add.graphics();
    const iconGfx = this.add.graphics();

    const renderCard = (hover: boolean): void => {
      cardGfx.clear();
      const fillColor = hover ? PALETTE.cardBgHover : PALETTE.cardBg;
      cardGfx.fillStyle(fillColor, 1);
      cardGfx.fillRoundedRect(cx - halfW, cy - halfH, w, h, 8);
      cardGfx.lineStyle(hover ? 2 : 1, opts.accentColor, hover ? 0.9 : 0.45);
      cardGfx.strokeRoundedRect(cx - halfW, cy - halfH, w, h, 8);

      if (hover) {
        cardGfx.lineStyle(1, opts.accentColor, 0.15);
        cardGfx.strokeRoundedRect(cx - halfW - 3, cy - halfH - 3, w + 6, h + 6, 10);
      }

      iconGfx.clear();
      opts.drawIcon(iconGfx, cx, cy - 30);
    };

    renderCard(false);

    const badgeText = this.add
      .text(cx, cy - halfH + 18, opts.label, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: opts.accentStr,
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    const titleText = this.add
      .text(cx, cy - halfH + 38, opts.title, {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: PALETTE.whiteStr,
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    const divGfx = this.add.graphics();
    divGfx.lineStyle(1, opts.accentColor, 0.3);
    divGfx.lineBetween(cx - 80, cy + halfH - 60, cx + 80, cy + halfH - 60);

    const btnBg = this.add
      .rectangle(cx, cy + halfH - 36, 140, 36, opts.accentColor)
      .setInteractive({ useHandCursor: true });

    const btnLabel = this.add
      .text(cx, cy + halfH - 36, 'LAUNCH', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#08080f',
        letterSpacing: 4,
      })
      .setOrigin(0.5);

    const hitZone = this.add
      .rectangle(cx, cy, w, h)
      .setInteractive({ useHandCursor: true })
      .setAlpha(0.001);

    const onHoverIn = (): void => {
      renderCard(true);
      this.tweens.add({ targets: [cardGfx, titleText, badgeText, btnBg, btnLabel], scaleX: 1.02, scaleY: 1.02, duration: 120, ease: 'Quad.easeOut' });
    };

    const onHoverOut = (): void => {
      renderCard(false);
      this.tweens.add({ targets: [cardGfx, titleText, badgeText, btnBg, btnLabel], scaleX: 1, scaleY: 1, duration: 120, ease: 'Quad.easeOut' });
    };

    const onLaunch = (): void => {
      this.cameras.main.fadeOut(350, 8, 8, 19);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(opts.targetScene);
      });
    };

    hitZone.on('pointerover', onHoverIn);
    hitZone.on('pointerout', onHoverOut);
    hitZone.on('pointerdown', onLaunch);
    btnBg.on('pointerover', onHoverIn);
    btnBg.on('pointerout', onHoverOut);
    btnBg.on('pointerdown', onLaunch);

    const container = this.add.container(0, 0, [cardGfx, iconGfx, badgeText, titleText, divGfx, btnBg, btnLabel, hitZone]);
    container.setAlpha(0);
    this.tweens.add({ targets: container, alpha: 1, duration: 400, delay: 300 + (cx < 400 ? 0 : 120) });
  }

  private drawTicTacToeIcon(gfx: Phaser.GameObjects.Graphics, cx: number, cy: number): void {
    const cell = 16;
    const gap = 4;
    const total = cell * 3 + gap * 2;
    const ox = cx - total / 2;
    const oy = cy - total / 2;

    gfx.lineStyle(2, PALETTE.teal, 0.5);
    for (let i = 1; i < 3; i++) {
      const x = ox + i * (cell + gap) - gap / 2;
      gfx.lineBetween(x, oy, x, oy + total);
      const y = oy + i * (cell + gap) - gap / 2;
      gfx.lineBetween(ox, y, ox + total, y);
    }

    const positions: [number, number, string][] = [
      [0, 0, 'X'], [1, 0, 'O'], [2, 1, 'X'],
      [0, 2, 'O'], [2, 0, 'X'],
    ];

    for (const [col, row, sym] of positions) {
      const px = ox + col * (cell + gap) + cell / 2;
      const py = oy + row * (cell + gap) + cell / 2;
      if (sym === 'X') {
        gfx.lineStyle(2, PALETTE.coral, 0.8);
        const s = cell * 0.28;
        gfx.lineBetween(px - s, py - s, px + s, py + s);
        gfx.lineBetween(px + s, py - s, px - s, py + s);
      } else {
        gfx.lineStyle(2, PALETTE.teal, 0.8);
        gfx.strokeCircle(px, py, cell * 0.28);
      }
    }
  }

  private drawSnakeIcon(gfx: Phaser.GameObjects.Graphics, cx: number, cy: number): void {
    const seg = 8;
    const snake: [number, number][] = [
      [0, 1], [1, 1], [2, 1], [2, 2], [2, 3], [1, 3], [0, 3],
    ];
    const ox = cx - (3 * seg) / 2;
    const oy = cy - (4 * seg) / 2;

    snake.forEach(([col, row], i) => {
      const alpha = 0.4 + (i / snake.length) * 0.6;
      gfx.fillStyle(PALETTE.coral, alpha);
      gfx.fillRect(ox + col * seg, oy + row * seg, seg - 1, seg - 1);
    });

    gfx.fillStyle(PALETTE.white, 0.9);
    gfx.fillRect(ox + seg * 0 + 2, oy + seg * 3 + 2, 3, 3);

    gfx.fillStyle(PALETTE.teal, 0.8);
    gfx.fillRect(ox + seg * 3, oy + seg * 1, seg - 1, seg - 1);
    gfx.fillRect(ox + seg * 3, oy + seg * 2, seg - 1, seg - 1);
  }

  private drawTetrisIcon(gfx: Phaser.GameObjects.Graphics, cx: number, cy: number): void {
    // draw a small cluster of tetromino-like blocks (4x4-ish)
    const size = 8;
    const gap = 2;
    const cols = 6;
    const rows = 4;
    const totalW = cols * size + (cols - 1) * gap;
    const totalH = rows * size + (rows - 1) * gap;
    const ox = cx - totalW / 2;
    const oy = cy - totalH / 2;

    // palette order for blocks
    const blocks: { c: number; r: number; color: number }[] = [
      { c: 0, r: 1, color: PALETTE.teal },
      { c: 1, r: 1, color: PALETTE.teal },
      { c: 2, r: 1, color: PALETTE.teal },
      { c: 3, r: 1, color: PALETTE.teal }, // I piece

      { c: 1, r: 0, color: PALETTE.coral },
      { c: 1, r: 1, color: PALETTE.coral },
      { c: 2, r: 1, color: PALETTE.coral },
      { c: 2, r: 0, color: PALETTE.coral }, // O-ish cluster

      { c: 4, r: 1, color: PALETTE.blue },
      { c: 4, r: 2, color: PALETTE.blue },
      { c: 5, r: 2, color: PALETTE.blue },
      { c: 3, r: 2, color: PALETTE.blue }, // J / L-ish pieces
    ];

    blocks.forEach(b => {
      const x = Math.round(ox + b.c * (size + gap));
      const y = Math.round(oy + b.r * (size + gap));
      gfx.fillStyle(b.color, 0.95);
      gfx.fillRect(x, y, size - 1, size - 1);
      gfx.lineStyle(1, PALETTE.cardBgHover, 0.22);
      gfx.strokeRect(x, y, size - 1, size - 1);
    });
  }

  private drawTipBar(width: number, height: number): void {
    const y = height - 72;

    const gfx = this.add.graphics();
    gfx.lineStyle(1, PALETTE.blue, 0.2);
    gfx.lineBetween(40, y - 8, width - 40, y - 8);
    gfx.lineBetween(40, y + 26, width - 40, y + 26);

    this.add
      .text(40, y + 8, '💡', { fontSize: '13px' })
      .setOrigin(0, 0.5);

    this.tipText = this.add
      .text(64, y + 8, TIPS[0], {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: PALETTE.mutedStr,
      })
      .setOrigin(0, 0.5);
  }

  private drawFooter(width: number, height: number): void {
    this.add
      .text(width / 2, height - 22, 'Adeo  ×  Decathlon Digital  —  Dev Summit 2026', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: PALETTE.dimStr,
        letterSpacing: 1,
      })
      .setOrigin(0.5);
  }

  private startTipCycle(): void {
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        this.tipIndex = (this.tipIndex + 1) % TIPS.length;
        this.tweens.add({
          targets: this.tipText,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.tipText.setText(TIPS[this.tipIndex]);
            this.tweens.add({ targets: this.tipText, alpha: 1, duration: 300 });
          },
        });
      },
    });
  }
}
