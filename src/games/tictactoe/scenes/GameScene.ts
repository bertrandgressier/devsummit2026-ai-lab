import Phaser from 'phaser';
import { Difficulty, SceneData, Player, GameResult, GameOverData } from '../types';
import { Grid } from '../objects/Grid';
import { GameLogic } from '../logic/GameLogic';
import { AIPlayer } from '../logic/AIPlayer';
import { GameRoundController } from '../logic/GameRoundController';

const W = 800;
const H = 600;
const HEADER_H = 72;
const BOARD_X = 190;
const BOARD_Y = 90;
const BOARD_SIZE = 420;
const CELL_SIZE = 140;
const PAL = {
  bg: 0x08080f,
  header: 0x071014,
  primary: 0x00ffd1,
  secondary: 0x007f67,
  accent: 0xff6b6b,
  panel: 0x061c1a,
  btnBg: 0x071014,
  btnHover: 0x062c28,
  textMain: '#E6FFF9',
  textDim: '#7FBAB0',
};

export class TicTacToeGameScene extends Phaser.Scene {
  private difficulty: Difficulty = Difficulty.Hard;
  private grid!: Grid;
  private logic!: GameLogic;
  private ai!: AIPlayer;
  private controller!: TicTacToeRoundController;
  private xScoreText!: Phaser.GameObjects.Text;
  private oScoreText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private boardZone!: Phaser.GameObjects.Zone;

  constructor() {
    super({ key: 'TicTacToeGame' });
  }

  init(data: SceneData): void {
    this.difficulty = data?.difficulty ?? Difficulty.Hard;
  }

  create(): void {
    this.cameras.main.fadeIn(400, 8, 8, 15);
    this.drawBackground();
    this.drawHeader();
    this.drawScorePanels();
    this.setupGame();
    this.drawButtons();
    this.controller.startRound();
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

    const title = this.add
      .text(W / 2, HEADER_H / 2 - 12, 'TIC TAC TOE', {
        fontFamily: "Orbitron, 'Segoe UI', Roboto, sans-serif",
        fontSize: '48px',
        color: PAL.textMain,
      })
      .setOrigin(0.5);

    this.tweens.add({ targets: title, y: HEADER_H / 2, duration: 480, ease: 'Sine.Out' });
  }

  private drawScorePanels(): void {
    const lGfx = this.add.graphics();
    lGfx.fillStyle(PAL.panel, 1);
    lGfx.fillRoundedRect(24, 12, 160, 48, 6);
    lGfx.lineStyle(2, PAL.primary, 1);
    lGfx.strokeRoundedRect(24, 12, 160, 48, 6);
    this.add.text(64, 36, 'O', {
      fontFamily: 'monospace', fontSize: '20px', color: '#00FFD1',
    }).setOrigin(0.5);
    this.oScoreText = this.add.text(150, 36, '0', {
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", fontSize: '20px', color: PAL.textMain,
    }).setOrigin(0.5);

    const rGfx = this.add.graphics();
    rGfx.fillStyle(PAL.panel, 1);
    rGfx.fillRoundedRect(616, 12, 160, 48, 6);
    rGfx.lineStyle(2, PAL.accent, 1);
    rGfx.strokeRoundedRect(616, 12, 160, 48, 6);
    this.add.text(656, 36, 'X', {
      fontFamily: 'monospace', fontSize: '20px', color: '#FF6B6B',
    }).setOrigin(0.5);
    this.xScoreText = this.add.text(742, 36, '0', {
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", fontSize: '20px', color: PAL.textMain,
    }).setOrigin(0.5);

    this.turnText = this.add.text(W / 2, BOARD_Y - 14, '', {
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
      fontSize: '16px',
      color: PAL.textDim,
    }).setOrigin(0.5);
  }

  private setupGame(): void {
    this.grid = new Grid(this, BOARD_X, BOARD_Y);
    this.logic = new GameLogic();
    this.ai = new AIPlayer();

    this.controller = new GameRoundController(
      this.logic,
      this.ai,
      this.difficulty,
      (index: number, player: Player) => {
        this.grid.setCellMark(index, player);
      },
      (xScore: number, oScore: number) => {
        this.xScoreText.setText(String(xScore));
        this.oScoreText.setText(String(oScore));
      },
      (player: Player, active: boolean) => {
        if (active && player === Player.X) {
          this.boardZone.setInteractive({ useHandCursor: true });
        } else {
          this.boardZone.disableInteractive();
        }

        this.updateTurnText();
      },
      (result: GameResult, winningCells: number[] | null) => {
        this.handleGameOver(result, winningCells);
      },
      (runAiMove: () => void) => {
        this.time.delayedCall(350, runAiMove);
      },
    );

    this.boardZone = this.add
      .zone(BOARD_X + BOARD_SIZE / 2, BOARD_Y + BOARD_SIZE / 2, BOARD_SIZE, BOARD_SIZE)
      .setInteractive({ useHandCursor: true });

    this.boardZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const lx = pointer.worldX - BOARD_X;
      const ly = pointer.worldY - BOARD_Y;
      if (lx < 0 || lx >= BOARD_SIZE || ly < 0 || ly >= BOARD_SIZE) return;
      const col = Math.floor(lx / CELL_SIZE);
      const row = Math.floor(ly / CELL_SIZE);
      this.controller.handleHumanMove(row * 3 + col);
    });
  }

  private drawButtons(): void {
    this.makeButton(228, 530, 160, 48, 'NEW GAME', () => this.controller.restartRound());
    this.makeButton(412, 530, 160, 48, 'BACK', () => {
      this.cameras.main.fadeOut(300, 8, 8, 15);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Launcher'));
    });
  }

  private makeButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    onPress: () => void,
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
      draw(false);
      hoverTween?.stop();
      hoverTween = null;
      this.tweens.add({ targets: [gfx, lbl], scaleX: 1, scaleY: 1, duration: 100 });
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

  private handleGameOver(result: GameResult, winningCells: number[] | null): void {
    this.boardZone.disableInteractive();
    this.turnText.setText('');

    const goToGameOver = (): void => {
      this.time.delayedCall(600, () => {
        this.cameras.main.fadeOut(300, 8, 8, 15);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('TicTacToeGameOver', {
            result,
            difficulty: this.difficulty,
          } satisfies GameOverData);
        });
      });
    };

    if (winningCells && winningCells.length >= 3) {
      this.grid.drawWinLine(winningCells, goToGameOver);
    } else {
      goToGameOver();
    }
  }

  private updateTurnText(): void {
    if (!this.gameActive) {
      this.turnText.setText('');
      return;
    }

    this.turnText.setText(this.currentPlayer === Player.X ? 'YOUR TURN  ( X )' : 'AI IS THINKING...');
  }

  shutdown(): void {
    this.input.setDefaultCursor('default');
  }
}
