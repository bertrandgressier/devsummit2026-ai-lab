import Phaser from 'phaser';
import { Difficulty, SceneData, Player, GameResult, GameOverData } from '../types';
import { Grid } from '../objects/Grid';
import { GameLogic } from '../logic/GameLogic';
import { AIPlayer } from '../logic/AIPlayer';

const W = 800;
const H = 600;
const HEADER_H = 72;
const BOARD_X = 190;
const BOARD_Y = 90;
const BOARD_SIZE = 420;
const CELL_SIZE = 140;

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

export class TicTacToeGameScene extends Phaser.Scene {
  private difficulty: Difficulty = Difficulty.Hard;
  private grid!: Grid;
  private logic!: GameLogic;
  private ai!: AIPlayer;
  private currentPlayer: Player = Player.X;
  private gameActive: boolean = false;
  private roundId: number = 0;
  private xScore: number = 0;
  private oScore: number = 0;
  private xScoreText!: Phaser.GameObjects.Text;
  private oScoreText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  // Single world-space Zone covering the board — avoids nested-Container
  // hit-area transform bugs present in Phaser 3.60+.
  private boardZone!: Phaser.GameObjects.Zone;

  constructor() {
    super({ key: 'TicTacToeGame' });
  }

  init(data: SceneData): void {
    this.difficulty = data?.difficulty ?? Difficulty.Hard;
    this.xScore = 0;
    this.oScore = 0;
    this.roundId = 0;
    this.currentPlayer = Player.X;
    this.gameActive = false;
  }

  create(): void {
    this.cameras.main.fadeIn(400, 8, 8, 15);
    this.drawBackground();
    this.drawHeader();
    this.drawScorePanels();
    this.setupGame();
    this.drawButtons();
    this.startRound();
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

    // Title entrance: starts 12 px above y=36, slides down per DESIGN.md
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
    // Left panel — O (AI) with teal stroke per DESIGN.md
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

    // Right panel — X (human) with coral stroke per DESIGN.md
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

    // Turn indicator sits just above the board
    this.turnText = this.add.text(W / 2, BOARD_Y - 14, '', {
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
      fontSize: '16px',
      color: PAL.textDim,
    }).setOrigin(0.5);
  }

  // ─── Game wiring ──────────────────────────────────────────────────────────

  private setupGame(): void {
    this.grid  = new Grid(this, BOARD_X, BOARD_Y);
    this.logic = new GameLogic();
    this.ai    = new AIPlayer();

    // Render marks when logic reports a move
    this.logic.onMove((index: number, player: Player) => {
      this.grid.setCellMark(index, player);
    });

    // Navigate to GameOver when logic signals end
    this.logic.onGameOver((result: GameResult, winningCells: number[] | null) => {
      this.handleGameOver(result, winningCells);
    });

    // ── Board input Zone ──────────────────────────────────────────────────
    // A plain world-space Zone positioned at the board's exact pixel bounds.
    // This completely avoids the Phaser 3.60+ bug where setInteractive() on a
    // Container that is itself a Container child does not apply the parent
    // Container's transform to the hit-area, causing wrong-cell / no-hit issues.
    this.boardZone = this.add
      .zone(BOARD_X + BOARD_SIZE / 2, BOARD_Y + BOARD_SIZE / 2, BOARD_SIZE, BOARD_SIZE)
      .setInteractive({ useHandCursor: true });

    this.boardZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.gameActive || this.currentPlayer !== Player.X) return;
      // Use pointer.worldX/worldY — reliable regardless of camera state
      const lx = pointer.worldX - BOARD_X;
      const ly = pointer.worldY - BOARD_Y;
      if (lx < 0 || lx >= BOARD_SIZE || ly < 0 || ly >= BOARD_SIZE) return;
      const col = Math.floor(lx / CELL_SIZE);
      const row = Math.floor(ly / CELL_SIZE);
      this.handleHumanMove(row * 3 + col);
    });
  }

  private drawButtons(): void {
    // Positions per DESIGN.md: x,y = top-left corner; w=160, h=48
    this.makeButton(228, 530, 160, 48, 'NEW GAME', () => this.restartRound());
    this.makeButton(412, 530, 160, 48, 'BACK', () => {
      this.cameras.main.fadeOut(300, 8, 8, 15);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Launcher'));
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

  // ─── Game flow ────────────────────────────────────────────────────────────

  private startRound(): void {
    this.currentPlayer = Player.X;
    this.gameActive = true;
    this.boardZone.setInteractive({ useHandCursor: true });
    this.updateTurnText();
  }

  private restartRound(): void {
    this.roundId++;
    this.logic.reset();
    this.grid.reset();
    this.startRound();
  }

  private handleHumanMove(index: number): void {
    if (!this.gameActive || this.currentPlayer !== Player.X) return;

    if (this.logic.makeMove(index, Player.X)) {
      if (this.gameActive) {
        // Still ongoing — disable board and let AI respond
        this.currentPlayer = Player.O;
        this.boardZone.disableInteractive();
        this.updateTurnText();

        const thisRound = this.roundId;
        this.time.delayedCall(350, () => {
          if (!this.gameActive || this.roundId !== thisRound) return;
          const aiMove = this.ai.getBestMove(this.logic.cloneBoard(), this.difficulty, Player.O);
          if (aiMove >= 0) {
            this.logic.makeMove(aiMove, Player.O);
          }
          if (this.gameActive) {
            this.currentPlayer = Player.X;
            this.boardZone.setInteractive({ useHandCursor: true });
            this.updateTurnText();
          }
        });
      }
    }
  }

  private handleGameOver(result: GameResult, winningCells: number[] | null): void {
    this.gameActive = false;
    this.boardZone.disableInteractive();

    if (result === GameResult.X_WINS) {
      this.xScore++;
      this.xScoreText.setText(String(this.xScore));
    } else if (result === GameResult.O_WINS) {
      this.oScore++;
      this.oScoreText.setText(String(this.oScore));
    }

    this.turnText.setText('');

    const goToGameOver = (): void => {
      this.time.delayedCall(600, () => {
        this.cameras.main.fadeOut(300, 8, 8, 15);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(
            'TicTacToeGameOver',
            { result, difficulty: this.difficulty } satisfies GameOverData,
          );
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
    if (!this.gameActive) { this.turnText.setText(''); return; }
    this.turnText.setText(
      this.currentPlayer === Player.X ? 'YOUR TURN  ( X )' : 'AI IS THINKING...',
    );
  }

  shutdown(): void {
    this.input.setDefaultCursor('default');
  }
}
